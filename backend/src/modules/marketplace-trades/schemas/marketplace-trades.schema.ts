import { z } from 'zod';

export const tradeStatusSchema = z.enum([
      "available",
      "pending exchange",
      "completed",
      "unavailable",
]);

export const tradeUrgencySchema = z.enum(["low", "medium", "high"]);

const tradeFields = z.object({
      has: z.string().trim().min(1, "Required").max(200),
      wants: z.string().trim().min(1, "Required").max(200),
      area: z.string().trim().min(1, "Required").max(120),
      urgency: tradeUrgencySchema.default("medium"),
      contactNotes: z.string().trim().max(500).optional(),
});

export const createTradeSchema = tradeFields.extend({
      ownerName: z.string().trim().min(1, "Required").max(80),
});

export const updateTradeSchema = tradeFields.partial().extend({
      status: tradeStatusSchema.optional(),
});

export const listTradesQuerySchema = z.object({
      area: z.string().trim().min(1).optional(),
      urgency: tradeUrgencySchema.optional(),
      status: tradeStatusSchema.optional(),
});

export const tradeIdParamSchema = z.object({
      id: z.coerce.number().int().positive(),
});

export type CreateTradeInput = z.infer<typeof createTradeSchema>;
export type UpdateTradeInput = z.infer<typeof updateTradeSchema>;
export type ListTradesQuery = z.infer<typeof listTradesQuerySchema>;