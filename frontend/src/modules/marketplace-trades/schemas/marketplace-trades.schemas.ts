import { z } from 'zod';

/**
 * Frontend mirrors of the Marketplace Trades API (backend
 * marketplace-trades.schema.ts + Prisma Trade model).
 * Module is isolated: re-declared here, never imported from the backend.
 */

// option lists for the selects - single source of truth on the frontend.
export const ITEM_TYPES = [
      "water",
      "food",
      "medicine",
      "batteries",
      "shelter",
      "tools",
      "other",
] as const;

export const URGENCIES = ["low", "medium", "high", "critical"] as const;
export const STATUSES = ["available", "pending", "completed", "unavailable", "suspended", "banned"] as const;
// suspended/banned are admin-only moderation states; everything else is the
// normal owner-managed lifecycle. Owners only get OWNER_STATUSES in the UI.
export const MODERATION_STATUSES = ["suspended", "banned"] as const;
export const OWNER_STATUSES = ["available", "pending", "completed", "unavailable"] as const;

export type ItemType = (typeof ITEM_TYPES)[number];
export type Urgency = (typeof URGENCIES)[number];
export type Status = (typeof STATUSES)[number];

/** a trade as returned by the API (mirrors the Prisma Trade model). */
export const tradeSchema = z.object({
      id: z.string(),
      title: z.string(),
      ownerName: z.string(),
      userId: z.string(),
      offering: z.string(),
      wanting: z.string(),
      itemType: z.enum(ITEM_TYPES),
      urgency: z.enum(URGENCIES),
      area: z.string(),
      contact: z.string(),
      note: z.string().nullable(),
      photoUrl: z.string().nullable(),
      status: z.enum(STATUSES),
      counterparty: z.string().nullable(),
      reputationAwarded: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
});

/** the list endpoint returns an array of trades */
export const tradeArraySchema = z.array(tradeSchema);

export const tradeFormSchema = z.object({
      title: z.string().trim().min(1, "Title is required").max(120),
      ownerName: z.string().trim().min(1, "Name is required").max(80),
      offering: z.string().trim().min(1, "Offer is required").max(200),
      wanting: z.string().trim().min(1, "Want is requried").max(200),
      itemType: z.enum(ITEM_TYPES),
      urgency: z.enum(URGENCIES),
      area: z.string().trim().min(1, "Location is required").max(120),
      contact: z.string().trim().min(1, "Contact is required").max(60),
      note: z.string().trim().max(500).optional(),
});
