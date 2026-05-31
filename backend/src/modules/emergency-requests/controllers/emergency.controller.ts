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

type Viewer = { id: string; isAdmin: boolean };

const getViewer = (req: Request): Viewer => {
  if (req.user?.id) {
    return { id: req.user.id, isAdmin: isAdmin(req.user) };
  }

  const token = req.cookies?.token;
  if (!token) {
    return { id: "", isAdmin: false };
  }

  try {
    const user = verifyToken(token);
    return { id: user.id, isAdmin: isAdmin(user) };
  } catch {
    return { id: "", isAdmin: false };
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
  ownerName: emergency.ownerName,
  photoUrl: emergency.photoUrl ?? undefined,
  status: normalizeStatus(emergency.status),
  title: emergency.title,
  updatedAt: emergency.updatedAt.toISOString(),
  urgency: normalizeUrgency(emergency.urgency),
});

export const getEmergencies = async (req: Request, res: Response) => {
  const viewer = getViewer(req);
  const emergencies = await listEmergencies(viewer);

  res.json({ emergencies: emergencies.map((emergency) => toEmergencyResponse(emergency, viewer.id)) });
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
