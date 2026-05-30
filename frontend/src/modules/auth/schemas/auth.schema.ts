import { z } from "zod";

export const authUserSchema = z.object({
  displayName: z.string(),
  email: z.string(),
  id: z.string(),
  reputationPoints: z.number().optional(),
  role: z.string(),
});

export const authResponseSchema = z.object({
  user: authUserSchema,
});

export type AuthUser = z.infer<typeof authUserSchema>;
