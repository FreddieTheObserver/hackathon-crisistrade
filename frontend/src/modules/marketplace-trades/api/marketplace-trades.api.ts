import api from '../../../api';
import { tradeSchema, tradeArraySchema } from '../schemas/marketplace-trades.schemas';
import type { Trade, TradeFilters } from '../types/marketplace-trades.types';

function buildTradeQuery(filters: TradeFilters): string {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.area) params.set("area", filters.area);
      if (filters.itemType) params.set("itemType", filters.itemType);
      if (filters.urgency) params.set("urgency", filters.urgency);
      if (filters.status) params.set("status", filters.status);
      const qs = params.toString();
      return qs ? `?${qs}` : "";
}

/** GET /trades - list, optionally filtered and validation */
export async function fetchTrades(filters: TradeFilters): Promise<Trade[]> {
      const res = await api.get(`/trades${buildTradeQuery(filters)}`);
      return tradeArraySchema.parse(res.data);
}

/** GET /trades/:id - a single trade */
export async function fetchTrade(id: string): Promise<Trade> {
      const res = await api.get(`/trades/${id}`);
      return tradeSchema.parse(res.data);
}

/** POST /trades - create. */
export async function createTrade(formData: FormData): Promise<Trade> {
      const res = await api.post("/trades", formData);
      return tradeSchema.parse(res.data);
}

/** PATCH /trades/:id - update/status chage */
export async function updateTrade(id: string, formData: FormData): Promise<Trade> {
      const res = await api.patch(`/trades/${id}`, formData);
      return tradeSchema.parse(res.data);
}

/** DELETE /trades/:id - backend return { message } */
export async function deleteTrade(id: string): Promise<void> {
      await api.delete(`/trades/${id}`);
}