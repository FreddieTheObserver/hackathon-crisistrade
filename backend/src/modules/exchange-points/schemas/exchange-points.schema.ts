import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export const exchangePointBaseSchema = z.object({
  placeName: z.string().trim().min(1),
  area: z.string().trim().min(1),
  openTime: z.string().trim().min(1),
  notes: z.string().trim().default(""),
  contactNotes: z.string().trim().default(""),
});

export const exchangePointCreateSchema = exchangePointBaseSchema;

export const exchangePointUpdateSchema = exchangePointBaseSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export const exchangePointQuerySchema = z.object({
  area: z.string().trim().optional(),
  search: z.string().trim().optional(),
});

export type ExchangePointCreateInput = z.infer<typeof exchangePointCreateSchema>;
export type ExchangePointUpdateInput = z.infer<typeof exchangePointUpdateSchema>;
export type ExchangePointQueryInput = z.infer<typeof exchangePointQuerySchema>;