import { Router } from "express";
import { asyncHandler } from "./middlewares/async-handler";
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
router.post("/", asyncHandler(createExchangePointController));
router.patch("/:id", asyncHandler(updateExchangePointController));
router.delete("/:id", asyncHandler(deleteExchangePointController));

export default router;
