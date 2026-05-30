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
import { isAdmin } from "../../../middlewares/require-auth";

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
  const user = req.user!;
  const emergency = await createEmergency({ ...data, userId: user.id, ownerName: user.displayName });

  res.status(201).json({ emergency: toEmergencyResponse(emergency) });
};

export const patchEmergency = async (req: Request, res: Response) => {
  const { id } = emergencyIdParamSchema.parse(req.params);
  const data = updateEmergencySchema.parse(req.body);
  const emergency = await updateEmergency(id, { id: req.user!.id, isAdmin: isAdmin(req.user) }, data);

  res.json({ emergency: toEmergencyResponse(emergency) });
};

export const patchEmergencyHelped = async (req: Request, res: Response) => {
  const { id } = emergencyIdParamSchema.parse(req.params);
  const emergency = await markEmergencyHelped(id, { id: req.user!.id, isAdmin: isAdmin(req.user) });

  res.json({ emergency: toEmergencyResponse(emergency) });
};

export const removeEmergency = async (req: Request, res: Response) => {
  const { id } = emergencyIdParamSchema.parse(req.params);

  await deleteEmergency(id, { id: req.user!.id, isAdmin: isAdmin(req.user) });
  res.json({ message: "Emergency request deleted" });
};
