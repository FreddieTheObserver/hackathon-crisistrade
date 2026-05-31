import { prisma } from "../../../db";
import {
  DONATION_MODERATION_STATUSES,
  type CreateDonationInput,
  type UpdateDonationInput,
} from "../schemas/donations.schema";

const MODERATION_STATUS_SET = new Set<string>(DONATION_MODERATION_STATUSES);

function isModerationStatus(status: string | null | undefined): boolean {
  return status != null && MODERATION_STATUS_SET.has(status);
}

type CurrentDonationUser = {
  id: string;
  name: string;
  isAdmin?: boolean;
};

class DonationServiceError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// add isOwner for the frontend
function withOwnership(
  donation: Awaited<ReturnType<typeof prisma.donation.findMany>>[number],
  user: CurrentDonationUser,
) {
  return {
    ...donation,
    isOwner: donation.ownerId === user.id,
  };
}

// block edit and delete for other owners
async function getOwnedDonation(id: number, user: CurrentDonationUser) {
  const donation = await prisma.donation.findUnique({
    where: { id },
  });

  if (!donation) {
    throw new DonationServiceError(404, "Donation not found");
  }

  if (donation.ownerId !== user.id && !user.isAdmin) {
    throw new DonationServiceError(
      403,
      "You can only modify your own donation posts",
    );
  }

  return donation;
}

export async function listDonations(user: CurrentDonationUser) {
  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: "desc" },
  });

  return donations.map((donation) => withOwnership(donation, user));
}

export async function createDonation(
  data: CreateDonationInput,
  user: CurrentDonationUser,
  uploadedPhotoUrl: string | null,
) {
  const donation = await prisma.donation.create({
    data: {
      ...data,
      photoUrl: uploadedPhotoUrl,
      ownerId: user.id,
      ownerName: user.name,
    },
  });

  return withOwnership(donation, user);
}

export async function updateDonation(
  id: number,
  data: UpdateDonationInput,
  user: CurrentDonationUser,
  uploadedPhotoUrl: string | null,
) {
  const existing = await getOwnedDonation(id, user);

  // Moderation states (SUSPENDED/BANNED) are admin-only — in both directions.
  // A plain owner can neither set one nor edit a post an admin has moderated.
  if (
    !user.isAdmin &&
    (isModerationStatus(data.status) || isModerationStatus(existing.status))
  ) {
    throw new DonationServiceError(
      403,
      "Only an admin can change a post's moderation status",
    );
  }

  // keep old photo if no new upload
  const photoUpdate = uploadedPhotoUrl ? { photoUrl: uploadedPhotoUrl } : {};

  const donation = await prisma.donation.update({
    where: { id },
    data: {
      ...data,
      ...photoUpdate,
    },
  });

  return withOwnership(donation, user);
}

export async function deleteDonation(id: number, user: CurrentDonationUser) {
  await getOwnedDonation(id, user);

  await prisma.donation.delete({
    where: { id },
  });
}
