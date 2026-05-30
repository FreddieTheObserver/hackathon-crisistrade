import type { Request, Response } from "express";

import { getProfileByUserId, updateProfileByUserId } from "../models/profile.model";
import { updateProfileSchema } from "../schemas/profile.schema";

export const getMyProfile = async (req: Request, res: Response) => {
  const profile = await getProfileByUserId(req.user!.id);

  res.json({ profile });
};

export const patchMyProfile = async (req: Request, res: Response) => {
  const data = updateProfileSchema.parse(req.body);
  const profile = await updateProfileByUserId(req.user!.id, data);

  res.json({ profile });
};
