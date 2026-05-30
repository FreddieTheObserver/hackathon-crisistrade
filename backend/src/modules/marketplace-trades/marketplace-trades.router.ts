import { Router } from "express";
import { asyncHandler } from "./middlewares/async-handler";
import { requireAuth } from "../../middlewares/require-auth";
import { uploadTradePhoto } from "./middlewares/marketplace-trades.upload";
import {
      createTrade,
      listTrades,
      getTrade,
      updateTrade,
      deleteTrade,
      listTraders,
      getTrader,
} from "./controllers/marketplace-trades.controller";

const marketplaceTradesRouter = Router();

// Reputation reads — declared BEFORE /:id so Express 5 does not capture
// "traders" as a trade :id.
marketplaceTradesRouter.get("/traders", asyncHandler(listTraders)); // GET /trades/traders
marketplaceTradesRouter.get("/traders/:name", asyncHandler(getTrader)); // GET /trades/traders/:name

marketplaceTradesRouter.post("/", requireAuth, uploadTradePhoto, asyncHandler(createTrade)); // POST /trades
marketplaceTradesRouter.get("/", asyncHandler(listTrades)); // GET /trades
marketplaceTradesRouter.get("/:id", asyncHandler(getTrade)); // GET /trades/:id
marketplaceTradesRouter.patch("/:id", requireAuth, uploadTradePhoto, asyncHandler(updateTrade)); // PATCH /trades/:id
marketplaceTradesRouter.delete("/:id", requireAuth, asyncHandler(deleteTrade)); // DELETE /trades/:id

export default marketplaceTradesRouter;
