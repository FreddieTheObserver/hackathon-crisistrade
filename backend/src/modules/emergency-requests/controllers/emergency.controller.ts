import type { Request, Response } from "express";
import { verifyToken } from "../../auth/services/auth.service";
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

const getViewerId = (req: Request) => {
  if (req.user?.id) {
    return req.user.id;
  }

  const token = req.cookies?.token;
  if (!token) {
    return "";
  }

  try {
    return verifyToken(token).id;
  } catch {
    return "";
  }
};

const normalizeStatus = (status: string) => {
  const normalizedStatus = status.trim().toLowerCase();

  if (normalizedStatus === "helped") {
    return "Helped";
  }

  if (normalizedStatus === "suspended") {
    return "Suspended";
  }

  if (normalizedStatus === "banned") {
    return "Banned";
  }

  return "Open";
};

const normalizeUrgency = (urgency: string) => {
  const normalizedUrgency = urgency.trim().toLowerCase();

  if (normalizedUrgency === "medium") {
    return "Medium";
  }

  if (normalizedUrgency === "low") {
    return "Low";
  }

  return "Urgent";
};

const toEmergencyResponse = (emergency: Awaited<ReturnType<typeof createEmergency>>, viewerId = "") => ({
  contact: emergency.contact,
  createdAt: emergency.createdAt.toISOString(),
  id: emergency.id,
  isOwner: Boolean(viewerId && emergency.userId === viewerId),
  location: emergency.location,
  need: emergency.need,
  note: emergency.note,
  photoUrl: emergency.photoUrl ?? undefined,
  status: normalizeStatus(emergency.status),
  title: emergency.title,
  updatedAt: emergency.updatedAt.toISOString(),
  urgency: normalizeUrgency(emergency.urgency),
});

export const getEmergencies = async (req: Request, res: Response) => {
  const emergencies = await listEmergencies();
  const viewerId = getViewerId(req);

  res.json({ emergencies: emergencies.map((emergency) => toEmergencyResponse(emergency, viewerId)) });
};

export const postEmergency = async (req: Request, res: Response) => {
  const data = createEmergencySchema.parse(req.body);
  const user = req.user!;
  const emergency = await createEmergency({ ...data, userId: user.id, ownerName: user.displayName });

  res.status(201).json({ emergency: toEmergencyResponse(emergency, user.id) });
};

export const patchEmergency = async (req: Request, res: Response) => {
  const { id } = emergencyIdParamSchema.parse(req.params);
  const data = updateEmergencySchema.parse(req.body);
  const emergency = await updateEmergency(id, { id: req.user!.id, isAdmin: isAdmin(req.user) }, data);

  res.json({ emergency: toEmergencyResponse(emergency, req.user!.id) });
};

export const patchEmergencyHelped = async (req: Request, res: Response) => {
  const { id } = emergencyIdParamSchema.parse(req.params);
  const emergency = await markEmergencyHelped(id, { id: req.user!.id, isAdmin: isAdmin(req.user) });

  res.json({ emergency: toEmergencyResponse(emergency, req.user!.id) });
};

export const removeEmergency = async (req: Request, res: Response) => {
  const { id } = emergencyIdParamSchema.parse(req.params);

  await deleteEmergency(id, { id: req.user!.id, isAdmin: isAdmin(req.user) });
  res.json({ message: "Emergency request deleted" });
};
