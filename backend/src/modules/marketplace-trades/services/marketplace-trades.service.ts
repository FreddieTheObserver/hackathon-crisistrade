import { prisma } from "../../../db";
import { MODERATION_STATUSES } from "../schemas/marketplace-trades.schema";
import type {
      CreateTradeInput,
      UpdateTradeInput,
      ListTradesQuery,
} from "../types/marketplace-trades.types";

const MODERATION_STATUS_SET = new Set<string>(MODERATION_STATUSES);

function isModerationStatus(status: string | null | undefined): boolean {
      return status != null && MODERATION_STATUS_SET.has(status);
}

function forbidden(message: string): never {
      throw Object.assign(new Error(message), { status: 403 });
}

// photoUrl is derived server-side from the upload, and userId/ownerName are
// stamped from the session user — so they ride alongside the validated body
// rather than living in the Zod schema.
type CreateTradeData = CreateTradeInput & { photoUrl?: string; userId: string; ownerName: string };
type UpdateTradeData = UpdateTradeInput & { photoUrl?: string };

function notFound(): never {
      throw Object.assign(new Error("Trade not found"), { status: 404 });
}

function badRequest(message: string): never {
      throw Object.assign(new Error(message), { status: 400 });
}

export async function listTrades(filters: ListTradesQuery) {
      const { area, urgency, itemType, status, search } = filters;

      return prisma.trade.findMany({
            where: {
                  ...(area ? { area } : {}),
                  ...(urgency ? { urgency } : {}),
                  ...(itemType ? { itemType } : {}),
                  ...(status ? { status } : {}),
                  ...(search
                        ? {
                                OR: [
                                      { title: { contains: search } },
                                      { offering: { contains: search } },
                                      { wanting: { contains: search } },
                                      { note: { contains: search } },
                                ],
                          }
                        : {}),
            },
            orderBy: { createdAt: "desc" },
      });
}

export async function getTradeById(id: string) {
      const trade = await prisma.trade.findUnique({ where: { id } });
      if (!trade) notFound();
      return trade;
}

export async function createTrade(input: CreateTradeData) {
      return prisma.trade.create({ data: input });
}

/**
 * Update a trade, awarding reputation exactly once when it transitions to
 * "completed". Wrapped in a $transaction so the trade update and both Trader
 * upserts commit together.
 */
type Actor = { id: string; isAdmin: boolean };

export async function updateTradeWithReputation(id: string, actor: Actor, patch: UpdateTradeData) {
      return prisma.$transaction(async (tx) => {
            const existing = await tx.trade.findUnique({ where: { id } });
            if (!existing) notFound();

            if (existing.userId !== actor.id && !actor.isAdmin) {
                  throw Object.assign(new Error("You can only modify your own trades."), { status: 403 });
            }

            // Moderation states (suspended/banned) are admin-only — in both
            // directions. A plain owner can neither set one nor edit a post an
            // admin has already moderated.
            if (!actor.isAdmin && (isModerationStatus(patch.status) || isModerationStatus(existing.status))) {
                  forbidden("Only an admin can change a post's moderation status.");
            }

            const ownerName = existing.ownerName;
            const counterparty = patch.counterparty ?? existing.counterparty;

            if (patch.status === "completed" && !counterparty) {
                  badRequest("Counterparty is required to complete a trade.");
            }

            const becomingCompleted =
                  patch.status === "completed" && !existing.reputationAwarded;

            const updated = await tx.trade.update({
                  where: { id },
                  data: {
                        ...patch,
                        ...(becomingCompleted ? { reputationAwarded: true } : {}),
                  },
            });

            if (becomingCompleted) {
                  // Reputation always credits the trade's owner (never the actor,
                  // which may be a moderating admin) and links to that account.
                  await tx.trader.upsert({
                        where: { name: ownerName },
                        create: { name: ownerName, userId: existing.userId, reputationPoints: 1 },
                        update: { userId: existing.userId, reputationPoints: { increment: 1 } },
                  });
                  // Counterparty stays by-name (typed); no user account linked.
                  // counterparty is guaranteed present here (checked above).
                  await tx.trader.upsert({
                        where: { name: counterparty as string },
                        create: { name: counterparty as string, reputationPoints: 1 },
                        update: { reputationPoints: { increment: 1 } },
                  });
            }

            return updated;
      });
}

export async function deleteTrade(id: string, actor: Actor) {
      const trade = await getTradeById(id); // throws 404 if it doesn't exist
      if (trade.userId !== actor.id && !actor.isAdmin) {
            throw Object.assign(new Error("You can only delete your own trades."), { status: 403 });
      }
      await prisma.trade.delete({ where: { id } });
}

export async function listTraders() {
      return prisma.trader.findMany({ orderBy: { reputationPoints: "desc" } });
}

export async function getTraderByName(name: string) {
      const trader = await prisma.trader.findUnique({ where: { name } });
      return trader ?? { name, reputationPoints: 0 };
}
