import type { Request, Response } from 'express';
import * as tradesService from '../services/marketplace-trades.service';
import {
      createTradeSchema,
      updateTradeSchema,
      listTradesQuerySchema,
      tradeIdParamSchema,
} from '../schemas/marketplace-trades.schema';

export async function createTrade(req: Request, res: Response) {
      const input = createTradeSchema.parse(req.body);
      const trade = await tradesService.createTrade(input);
      res.status(201).json(trade);
}

export async function listTrades(req: Request, res: Response) {
      const filters = listTradesQuerySchema.parse(req.query);
      const trades = await tradesService.listTrades(filters);
      res.json(trades);
}

export async function getTrade(req: Request, res: Response) {
      const { id } = tradeIdParamSchema.parse(req.params);
      const trade = await tradesService.getTradeById(id);
      res.json(trade);
}

export async function updateTrade(req: Request, res: Response) {
      const { id } = tradeIdParamSchema.parse(req.params);
      const input = updateTradeSchema.parse(req.body);
      const trade = await tradesService.updateTrade(id, input);
      res.json(trade);
}

export async function deleteTrade(req: Request, res: Response) {
      const { id } = tradeIdParamSchema.parse(req.params);
      await tradesService.deleteById(id);
      res.json({ message: "Trade deleted" });
}