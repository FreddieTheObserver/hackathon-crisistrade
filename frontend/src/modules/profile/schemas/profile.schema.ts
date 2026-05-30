import { z } from "zod";

export const profileSchema = z.object({
  bio: z.string(),
  email: z.string(),
  isVerified: z.boolean(),
  location: z.string().optional().default(""),
  memberSince: z.string(),
  name: z.string(),
  phone: z.string(),
  profilePhotoUrl: z.string(),
  reputationPoints: z.number(),
  stats: z.object({
    donations: z.object({
      finished: z.number(),
      total: z.number(),
    }),
    requests: z.object({
      helped: z.number(),
      total: z.number(),
    }),
    trades: z.object({
      completed: z.number(),
      total: z.number(),
    }),
  }),
});

export const profileResponseSchema = z.object({
  profile: profileSchema,
});

export const updateProfilePayloadSchema = z.object({
  bio: z.string(),
  email: z.string().email(),
  location: z.string().optional().default(""),
  name: z.string().min(1),
  phone: z.string(),
  profilePhotoUrl: z.string(),
});
