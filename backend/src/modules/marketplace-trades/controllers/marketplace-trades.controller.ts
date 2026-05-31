import type { Request, Response } from "express";
import * as tradesService from "../services/marketplace-trades.service";
import { isAdmin } from "../../../middlewares/require-auth";
import { verifyToken } from "../../auth/services/auth.service";
import {
      createTradeSchema,
      updateTradeSchema,
      listTradesQuerySchema,
      tradeIdParamSchema,
      traderNameParamSchema,
} from "../schemas/marketplace-trades.schema";

// multer attaches `file` to the request; derive the public /uploads URL from it.
function photoUrlFrom(req: Request): string | undefined {
      const file = (req as Request & { file?: { filename: string } }).file;
      return file ? `/uploads/${file.filename}` : undefined;
}

// The list route is public; read the optional session to decide whether
// moderated posts (suspended/banned) should be included for this viewer.
function currentViewer(req: Request): { id: string; isAdmin: boolean } {
      if (req.user) {
            return { id: req.user.id, isAdmin: isAdmin(req.user) };
      }
      const token = req.cookies?.token;
      if (!token) return { id: "", isAdmin: false };
      try {
            const user = verifyToken(token);
            return { id: user.id, isAdmin: isAdmin(user) };
      } catch {
            return { id: "", isAdmin: false };
      }
}

export async function createTrade(req: Request, res: Response) {
      const input = createTradeSchema.parse(req.body);
      const photoUrl = photoUrlFrom(req);
      const user = req.user!;
      const trade = await tradesService.createTrade({
            ...input,
            userId: user.id,
            ownerName: user.displayName,
            ...(photoUrl ? { photoUrl } : {}),
      });
      res.status(201).json(trade);
}

export async function listTrades(req: Request, res: Response) {
      const filters = listTradesQuerySchema.parse(req.query);
      const trades = await tradesService.listTrades(filters, currentViewer(req));
      res.json(trades);
}

export async function getTrade(req: Request, res: Response) {
      const { id } = tradeIdParamSchema.parse(req.params);
      const trade = await tradesService.getTradeById(id);
      res.json(trade);
}

export async function updateTrade(req: Request, res: Response) {
      const { id } = tradeIdParamSchema.parse(req.params);
      const patch = updateTradeSchema.parse(req.body);
      const photoUrl = photoUrlFrom(req);
      const trade = await tradesService.updateTradeWithReputation(
            id,
            { id: req.user!.id, isAdmin: isAdmin(req.user) },
            {
                  ...patch,
                  ...(photoUrl ? { photoUrl } : {}),
            },
      );
      res.json(trade);
}

export async function deleteTrade(req: Request, res: Response) {
      const { id } = tradeIdParamSchema.parse(req.params);
      await tradesService.deleteTrade(id, { id: req.user!.id, isAdmin: isAdmin(req.user) });
      res.json({ message: "Trade deleted" });
}

export async function listTraders(_req: Request, res: Response) {
      const traders = await tradesService.listTraders();
      res.json(traders);
}

export async function getTrader(req: Request, res: Response) {
      const { name } = traderNameParamSchema.parse(req.params);
      const trader = await tradesService.getTraderByName(name);
      res.json(trader);
}
