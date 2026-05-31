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
  // Moderated posts (SUSPENDED/BANNED) are visible only to admins and to their
  // own owner; hidden from everyone else on the public board.
  const donations = await prisma.donation.findMany({
    where: user.isAdmin
      ? {}
      : {
          OR: [
            { status: { notIn: [...DONATION_MODERATION_STATUSES] } },
            { ownerId: user.id },
          ],
        },
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

  // Owners may never move a post into a moderation state, and may not touch a
  // banned post at all (only an admin can lift a ban). A suspended post stays
  // editable so the owner can lift their own suspension.
  if (!user.isAdmin) {
    if (isModerationStatus(data.status)) {
      throw new DonationServiceError(
        403,
        "Only an admin can suspend or ban a post",
      );
    }
    if (existing.status === "BANNED") {
      throw new DonationServiceError(
        403,
        "This post was banned by an admin and can only be changed by an admin",
      );
    }
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
