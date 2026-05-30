import { prisma } from "../../../db";
import type { CreateEmergencyInput, UpdateEmergencyInput } from "../schemas/emergency.schema";

export const listEmergencies = async () => {
  return prisma.emergencyRequest.findMany({
    orderBy: [{ isOwner: "desc" }, { createdAt: "desc" }],
  });
};

export const createEmergency = async (data: CreateEmergencyInput) => {
  return prisma.emergencyRequest.create({ data });
};

export const updateEmergency = async (id: string, data: UpdateEmergencyInput) => {
  return prisma.emergencyRequest.update({
    data,
    where: { id },
  });
};

export const markEmergencyHelped = async (id: string) => {
  return prisma.emergencyRequest.update({
    data: { status: "Helped" },
    where: { id },
  });
};

export const deleteEmergency = async (id: string) => {
  return prisma.emergencyRequest.delete({
    where: { id },
  });
};
