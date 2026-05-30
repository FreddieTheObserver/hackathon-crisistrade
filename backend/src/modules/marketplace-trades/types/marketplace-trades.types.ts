import { z } from "zod";
import {
      createTradeSchema,
      updateTradeSchema,
      listTradesQuerySchema,
} from "../schemas/marketplace-trades.schema";

// z.infer types only — no hand-written duplicates of the schema shapes.
export type CreateTradeInput = z.infer<typeof createTradeSchema>;
export type UpdateTradeInput = z.infer<typeof updateTradeSchema>;
export type ListTradesQuery = z.infer<typeof listTradesQuerySchema>;
