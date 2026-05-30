import { Router } from "express";
import { asyncHandler } from "./middlewares/async-handler";
import { requireAuth } from "../../middlewares/require-auth";
import {
  createExchangePointController,
  deleteExchangePointController,
  getExchangePointController,
  listExchangePointsController,
  updateExchangePointController,
} from "./controllers/exchange-points.controller";

const router = Router();

router.get("/", asyncHandler(listExchangePointsController));
router.get("/:id", asyncHandler(getExchangePointController));
router.post("/", requireAuth, asyncHandler(createExchangePointController));
router.patch("/:id", requireAuth, asyncHandler(updateExchangePointController));
router.delete("/:id", requireAuth, asyncHandler(deleteExchangePointController));

export default router;
