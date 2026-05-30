import { z } from "zod";

export const donationStatusSchema = z.enum([
  "AVAILABLE",
  "RESERVED_PENDING",
  "TAKEN_FINISHED",
]);

// create request rules
export const createDonationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  item: z.string().min(1, "Item is required"),
  quantity: z.string().min(1, "Quantity is required"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  availableAt: z.string().min(1, "Available time is required"),
  note: z.string().optional(),
  contact: z.string().min(1, "Contact is required"),
});

// update request rules
export const updateDonationSchema = createDonationSchema.partial().extend({
  status: donationStatusSchema.optional(),
});

export type CreateDonationInput = z.infer<typeof createDonationSchema>;
export type UpdateDonationInput = z.infer<typeof updateDonationSchema>;
