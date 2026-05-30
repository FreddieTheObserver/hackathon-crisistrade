import { prisma } from "../../../db";
import type { CreateEmergencyInput, UpdateEmergencyInput } from "../schemas/emergency.schema";

export const listEmergencies = async () => {
  return prisma.emergencyRequest.findMany({
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
  await getOwned(id, actor);
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
