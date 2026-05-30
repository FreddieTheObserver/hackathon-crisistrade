import { z } from "zod";

export const profileSchema = z.object({
  bio: z.string(),
  email: z.string(),
  location: z.string(),
  memberSince: z.string(),
  name: z.string(),
  phone: z.string(),
  profilePhotoUrl: z.string(),
  reputationPoints: z.number(),
});

export const profileResponseSchema = z.object({
  profile: profileSchema,
});

export const updateProfilePayloadSchema = z.object({
  bio: z.string(),
  email: z.string().email(),
  location: z.string(),
  name: z.string().min(1),
  phone: z.string(),
  profilePhotoUrl: z.string(),
});
