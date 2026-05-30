import { prisma } from "../../../db";
import type { CreateEmergencyInput, UpdateEmergencyInput } from "../schemas/emergency.schema";

export const listEmergencies = async () => {
  return prisma.emergencyRequest.findMany({
    orderBy: [{ isOwner: "desc" }, { createdAt: "desc" }],
  });
};

export const createEmergency = async (
  data: CreateEmergencyInput & { userId: string; ownerName: string },
) => {
  return prisma.emergencyRequest.create({ data });
};

async function getOwned(id: string, userId: string) {
  const existing = await prisma.emergencyRequest.findUnique({ where: { id } });
  if (!existing) throw Object.assign(new Error("Emergency request not found"), { status: 404 });
  if (existing.userId !== userId)
    throw Object.assign(new Error("You can only modify your own requests."), { status: 403 });
  return existing;
}

export const updateEmergency = async (id: string, userId: string, data: UpdateEmergencyInput) => {
  await getOwned(id, userId);
  return prisma.emergencyRequest.update({
    data,
    where: { id },
  });
};

export const markEmergencyHelped = async (id: string, userId: string) => {
  await getOwned(id, userId);
  return prisma.emergencyRequest.update({
    data: { status: "Helped" },
    where: { id },
  });
};

export const deleteEmergency = async (id: string, userId: string) => {
  await getOwned(id, userId);
  return prisma.emergencyRequest.delete({
    where: { id },
  });
};
