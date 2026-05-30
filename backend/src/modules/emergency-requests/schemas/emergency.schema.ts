import { z } from "zod";

export const emergencyUrgencySchema = z.enum(["Urgent", "Medium", "Low"]);
export const emergencyStatusSchema = z.enum(["Open", "Helped", "Suspended", "Banned"]);

export const createEmergencySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(24, "Title must be 24 characters or fewer"),
  need: z.string().trim().min(1, "Need is required").max(45, "Need must be 45 characters or fewer"),
  location: z.string().trim().min(1, "Location is required").max(24, "Location must be 24 characters or fewer"),
  urgency: emergencyUrgencySchema,
  note: z.string().trim().max(50, "Note must be 50 characters or fewer").optional().default(""),
  contact: z.string().trim().min(1, "Contact is required").max(16, "Contact must be 16 characters or fewer"),
  photoUrl: z.string().max(5_000_000, "Photo is too large").optional(),
  isOwner: z.boolean().optional().default(true),
});

export const updateEmergencySchema = createEmergencySchema.partial().extend({
  status: emergencyStatusSchema.optional(),
});

export const emergencyIdParamSchema = z.object({
  id: z.string().trim().min(1, "Emergency id is required"),
});

export type CreateEmergencyInput = z.infer<typeof createEmergencySchema>;
export type UpdateEmergencyInput = z.infer<typeof updateEmergencySchema>;
