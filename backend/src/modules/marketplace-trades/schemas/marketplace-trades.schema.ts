import { z } from "zod";

// SQLite has no enums — these const arrays are the single source of truth,
// reused by Zod (.enum) here and surfaced to the frontend as option lists.
export const ITEM_TYPES = ["water", "food", "medicine", "batteries", "shelter", "tools", "other"] as const;
export const URGENCIES = ["low", "medium", "high", "critical"] as const;
export const STATUSES = ["available", "pending", "completed", "unavailable", "suspended", "banned"] as const;
// suspended/banned are moderation-only states: only an admin may move a post
// into or out of them. Enforced server-side in the service layer.
export const MODERATION_STATUSES = ["suspended", "banned"] as const;

export const createTradeSchema = z.object({
      title: z.string().trim().min(1).max(120),
      // ownerName is no longer client-supplied — it is stamped from the session user.
      offering: z.string().trim().min(1).max(200),
      wanting: z.string().trim().min(1).max(200),
      itemType: z.enum(ITEM_TYPES),
      urgency: z.enum(URGENCIES),
      area: z.string().trim().min(1).max(120),
      contact: z.string().trim().min(1).max(60),
      note: z.string().trim().max(500).optional(),
      status: z.enum(STATUSES).default("available"),
      counterparty: z.string().trim().min(1).max(80).optional(),
});

export const updateTradeSchema = createTradeSchema.partial();

export const listTradesQuerySchema = z.object({
      area: z.string().trim().min(1).optional(),
      urgency: z.enum(URGENCIES).optional(),
      itemType: z.enum(ITEM_TYPES).optional(),
      status: z.enum(STATUSES).optional(),
      search: z.string().trim().min(1).optional(), // contains-match on title/offering/wanting/note
});

// cuid string ids (no longer numeric)
export const tradeIdParamSchema = z.object({
      id: z.string().trim().min(1),
});

export const traderNameParamSchema = z.object({
      name: z.string().trim().min(1),
});
