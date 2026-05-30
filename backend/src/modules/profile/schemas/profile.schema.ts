import { z } from "zod";

export const updateProfileSchema = z.object({
  bio: z.string().trim().max(180, "Bio must be 180 characters or fewer").optional().default(""),
  email: z.string().trim().email("Valid email is required").max(120, "Email must be 120 characters or fewer"),
  location: z.string().trim().max(60, "Location must be 60 characters or fewer").optional().default(""),
  name: z.string().trim().min(1, "Name is required").max(60, "Name must be 60 characters or fewer"),
  phone: z.string().trim().max(24, "Number must be 24 characters or fewer").optional().default(""),
  profilePhotoUrl: z.string().max(5_000_000, "Profile photo is too large").optional().default(""),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
