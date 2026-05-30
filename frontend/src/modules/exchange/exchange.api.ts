import { z } from "zod";
import api from "../../api";
import { type ExchangePoint, type ExchangePointPayload } from "./exchange.types";

const idSchema = z.union([z.string(), z.number()]).transform(String);

const exchangePointSchema = z.object({
  id: idSchema,
  placeName: z.string(),
  area: z.string(),
  openTime: z.string(),
  notes: z.string().default(""),
  contactNotes: z.string().default(""),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const exchangePointListSchema = z.union([
  z.array(exchangePointSchema),
  z.object({ data: z.array(exchangePointSchema) }).transform((response) => response.data),
  z.object({ exchangePoints: z.array(exchangePointSchema) }).transform((response) => response.exchangePoints),
]);

const exchangePointResponseSchema = z.union([
  exchangePointSchema,
  z.object({ data: exchangePointSchema }).transform((response) => response.data),
  z.object({ exchangePoint: exchangePointSchema }).transform((response) => response.exchangePoint),
]);

export interface ExchangePointFilters {
  area?: string;
  search?: string;
}

export const getExchangePoints = async (filters: ExchangePointFilters = {}): Promise<ExchangePoint[]> => {
  const response = await api.get<unknown>("/exchange-points", { params: filters });
  return exchangePointListSchema.parse(response.data);
};

export const createExchangePoint = async (payload: ExchangePointPayload): Promise<ExchangePoint> => {
  const response = await api.post<unknown>("/exchange-points", payload);
  return exchangePointResponseSchema.parse(response.data);
};

export const updateExchangePoint = async (
  id: string,
  payload: ExchangePointPayload,
): Promise<ExchangePoint> => {
  const response = await api.patch<unknown>(`/exchange-points/${id}`, payload);
  return exchangePointResponseSchema.parse(response.data);
};

export const deleteExchangePoint = async (id: string): Promise<void> => {
  await api.delete(`/exchange-points/${id}`);
};
