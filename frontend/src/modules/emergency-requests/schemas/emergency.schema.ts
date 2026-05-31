import { z } from "zod";

export const emergencyUrgencySchema = z.enum(["Urgent", "Medium", "Low"]);
export const emergencyStatusSchema = z.enum(["Open", "Helped", "Suspended", "Banned"]);

export const emergencyPostSchema = z.object({
  contact: z.string(),
  createdAt: z.string(),
  id: z.string(),
  isOwner: z.boolean().optional(),
  location: z.string(),
  need: z.string(),
  note: z.string(),
  ownerName: z.string().default(""),
  photoUrl: z.string().optional(),
  status: emergencyStatusSchema,
  title: z.string(),
  updatedAt: z.string(),
  urgency: emergencyUrgencySchema,
});

export const emergencyListResponseSchema = z.object({
  emergencies: z.array(emergencyPostSchema),
});

export const emergencyResponseSchema = z.object({
  emergency: emergencyPostSchema,
});
