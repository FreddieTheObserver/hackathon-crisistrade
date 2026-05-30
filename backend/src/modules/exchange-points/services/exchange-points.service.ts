import { prisma } from "../../../db";
import type {
  ExchangePointCreateInput,
  ExchangePointQueryInput,
  ExchangePointUpdateInput,
} from "../schemas/exchange-points.schema";
import type {
  ExchangePointRecord,
  ExchangePointResponse,
  ExchangePointWhere,
} from "../types/exchange-points.types";

const createNotFoundError = () => {
  const error = new Error("Exchange point not found");
  (error as Error & { status?: number }).status = 404;
  return error;
};

const toResponse = (record: ExchangePointRecord): ExchangePointResponse => ({
  id: record.id,
  placeName: record.placeName,
  area: record.area,
  openTime: record.openTime,
  notes: record.notes,
  contactNotes: record.contactNotes,
  userId: record.userId,
  ownerName: record.ownerName,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

const buildWhere = (query: ExchangePointQueryInput): ExchangePointWhere => {
  const where: ExchangePointWhere = {};

  if (query.area) {
    where.area = { contains: query.area };
  }

  if (query.search) {
    const search = query.search;

    where.OR = [
      { placeName: { contains: search } },
      { area: { contains: search } },
      { openTime: { contains: search } },
      { notes: { contains: search } },
      { contactNotes: { contains: search } },
    ];
  }

  return where;
};

export const listExchangePoints = async (
  query: ExchangePointQueryInput
): Promise<ExchangePointResponse[]> => {
  const exchangePoints = await prisma.exchangePoint.findMany({
    where: buildWhere(query),
    orderBy: { createdAt: "desc" },
  });

  return exchangePoints.map(toResponse);
};

export const getExchangePoint = async (id: string): Promise<ExchangePointResponse> => {
  const exchangePoint = await prisma.exchangePoint.findUnique({ where: { id } });

  if (!exchangePoint) {
    throw createNotFoundError();
  }

  return toResponse(exchangePoint);
};

const createForbiddenError = () => {
  const error = new Error("You can only modify your own exchange points.");
  (error as Error & { status?: number }).status = 403;
  return error;
};

export const createExchangePoint = async (
  payload: ExchangePointCreateInput & { userId: string; ownerName: string }
): Promise<ExchangePointResponse> => {
  const exchangePoint = await prisma.exchangePoint.create({ data: payload });

  return toResponse(exchangePoint);
};

type Actor = { id: string; isAdmin: boolean };

export const updateExchangePoint = async (
  id: string,
  actor: Actor,
  payload: ExchangePointUpdateInput
): Promise<ExchangePointResponse> => {
  const existingExchangePoint = await prisma.exchangePoint.findUnique({ where: { id } });

  if (!existingExchangePoint) {
    throw createNotFoundError();
  }

  if (existingExchangePoint.userId !== actor.id && !actor.isAdmin) {
    throw createForbiddenError();
  }

  const exchangePoint = await prisma.exchangePoint.update({
    where: { id },
    data: payload,
  });

  return toResponse(exchangePoint);
};

export const deleteExchangePoint = async (id: string, actor: Actor): Promise<void> => {
  const existingExchangePoint = await prisma.exchangePoint.findUnique({ where: { id } });

  if (!existingExchangePoint) {
    throw createNotFoundError();
  }

  if (existingExchangePoint.userId !== actor.id && !actor.isAdmin) {
    throw createForbiddenError();
  }

  await prisma.exchangePoint.delete({ where: { id } });
};