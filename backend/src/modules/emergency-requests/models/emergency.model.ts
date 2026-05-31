import { prisma } from "../../../db";
import type { CreateEmergencyInput, UpdateEmergencyInput } from "../schemas/emergency.schema";

// Moderation-only states: an owner can never set these, and they are hidden
// from the public board (visible only to admins and the post's own owner).
export const EMERGENCY_MODERATION_STATUSES = ["Suspended", "Banned"] as const;
const MODERATION_STATUS_SET = new Set<string>(EMERGENCY_MODERATION_STATUSES);

function isModerationStatus(status: string | null | undefined): boolean {
  return status != null && MODERATION_STATUS_SET.has(status);
}

type Viewer = { id: string; isAdmin: boolean };

export const listEmergencies = async (viewer: Viewer = { id: "", isAdmin: false }) => {
  return prisma.emergencyRequest.findMany({
    where: viewer.isAdmin
      ? {}
      : {
          OR: [
            { status: { notIn: [...EMERGENCY_MODERATION_STATUSES] } },
            { userId: viewer.id },
          ],
        },
    orderBy: { createdAt: "desc" },
  });
};

export const createEmergency = async (
  data: CreateEmergencyInput & { userId: string; ownerName: string },
) => {
  return prisma.emergencyRequest.create({ data });
};

type Actor = { id: string; isAdmin: boolean };

async function getOwned(id: string, actor: Actor) {
  const existing = await prisma.emergencyRequest.findUnique({ where: { id } });
  if (!existing) throw Object.assign(new Error("Emergency request not found"), { status: 404 });
  if (existing.userId !== actor.id && !actor.isAdmin)
    throw Object.assign(new Error("You can only modify your own requests."), { status: 403 });
  return existing;
}

export const updateEmergency = async (id: string, actor: Actor, data: UpdateEmergencyInput) => {
  const existing = await getOwned(id, actor);

  // Owners may never move a post into a moderation state, and may not touch a
  // banned post at all (only an admin can lift a ban). A suspended post stays
  // editable so the owner can lift their own suspension.
  if (!actor.isAdmin) {
    if (isModerationStatus(data.status)) {
      throw Object.assign(new Error("Only an admin can suspend or ban a post."), { status: 403 });
    }
    if (existing.status === "Banned") {
      throw Object.assign(
        new Error("This post was banned by an admin and can only be changed by an admin."),
        { status: 403 },
      );
    }
  }

  return prisma.emergencyRequest.update({
    data,
    where: { id },
  });
};

export const markEmergencyHelped = async (id: string, actor: Actor) => {
  await getOwned(id, actor);
  return prisma.emergencyRequest.update({
    data: { status: "Helped" },
    where: { id },
  });
};

export const deleteEmergency = async (id: string, actor: Actor) => {
  await getOwned(id, actor);
  return prisma.emergencyRequest.delete({
    where: { id },
  });
};
