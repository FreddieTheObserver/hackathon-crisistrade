import type { Request, Response } from "express";
import {
  createEmergency,
  deleteEmergency,
  listEmergencies,
  markEmergencyHelped,
  updateEmergency,
} from "../models/emergency.model";
import {
  createEmergencySchema,
  emergencyIdParamSchema,
  updateEmergencySchema,
} from "../schemas/emergency.schema";

const toEmergencyResponse = (emergency: Awaited<ReturnType<typeof createEmergency>>) => ({
  ...emergency,
  photoUrl: emergency.photoUrl ?? undefined,
  createdAt: emergency.createdAt.toISOString(),
  updatedAt: emergency.updatedAt.toISOString(),
});

export const getEmergencies = async (_req: Request, res: Response) => {
  const emergencies = await listEmergencies();

  res.json({ emergencies: emergencies.map(toEmergencyResponse) });
};

export const postEmergency = async (req: Request, res: Response) => {
  const data = createEmergencySchema.parse(req.body);
  const emergency = await createEmergency(data);

  res.status(201).json({ emergency: toEmergencyResponse(emergency) });
};

export const patchEmergency = async (req: Request, res: Response) => {
  const { id } = emergencyIdParamSchema.parse(req.params);
  const data = updateEmergencySchema.parse(req.body);
  const emergency = await updateEmergency(id, data);

  res.json({ emergency: toEmergencyResponse(emergency) });
};

export const patchEmergencyHelped = async (req: Request, res: Response) => {
  const { id } = emergencyIdParamSchema.parse(req.params);
  const emergency = await markEmergencyHelped(id);

  res.json({ emergency: toEmergencyResponse(emergency) });
};

export const removeEmergency = async (req: Request, res: Response) => {
  const { id } = emergencyIdParamSchema.parse(req.params);

  await deleteEmergency(id);
  res.json({ message: "Emergency request deleted" });
};
