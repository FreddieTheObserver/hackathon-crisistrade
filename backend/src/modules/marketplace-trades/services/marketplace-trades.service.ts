import { prisma } from '../../../db';
import type {
      CreateTradeInput,
      UpdateTradeInput,
      ListTradesQuery,
} from '../schemas/marketplace-trades.schema';

// Always attach the owner (id, name, reputation) to a returned trade,
// so the client can show reputation without a second request.
const withOwner = { owner: true } as const;

function notFound(): never {
      throw Object.assign(new Error("Trade not found"), { status: 404 });
}

export async function createTrade(input: CreateTradeInput) {
      const { ownerName, ...tradeData } = input;

      return prisma.trade.create({
            data: {
                  ...tradeData,
                  owner: {
                        connectOrCreate: {
                              where: { name: ownerName },
                              create: { name: ownerName },
                        },
                  },
            },
            include: withOwner,
      });
}

export async function listTrades(filters: ListTradesQuery) {
      return prisma.trade.findMany({
            where: {
                  area: filters.area,
                  urgency: filters.urgency,
                  status: filters.status,
            },
            include: withOwner,
            orderBy: { createdAt: "desc" },
      });
}

export async function getTradeById(id: number) {
      const trade = await prisma.trade.findUnique({
            where: { id },
            include: withOwner,
      });
      if (!trade) notFound();
      return trade;
}

export async function updateTrade(id: number, input: UpdateTradeInput) {
      await getTradeById(id); // throws 404 if it doesn't exist
      return prisma.trade.update({
            where: { id },
            data: input,
            include: withOwner,
      });
}

export async function deleteById(id: number) {
      await getTradeById(id); // throws 404 if it doesn't exist
      await prisma.trade.delete({ where: { id }});
}