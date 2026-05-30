import type { Request, Response } from "express";
import {
  createExchangePoint,
  deleteExchangePoint,
  getExchangePoint,
  listExchangePoints,
  updateExchangePoint,
} from "../services/exchange-points.service";
import {
  exchangePointCreateSchema,
  exchangePointQuerySchema,
  exchangePointUpdateSchema,
  idParamSchema,
} from "../schemas/exchange-points.schema";
import { isAdmin } from "../../../middlewares/require-auth";

export const listExchangePointsController = async (req: Request, res: Response) => {
  const query = exchangePointQuerySchema.parse(req.query);
  const exchangePoints = await listExchangePoints(query);

  res.json(exchangePoints);
};

export const getExchangePointController = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const exchangePoint = await getExchangePoint(id);

  res.json(exchangePoint);
};

export const createExchangePointController = async (req: Request, res: Response) => {
  const payload = exchangePointCreateSchema.parse(req.body);
  const user = req.user!;
  const exchangePoint = await createExchangePoint({
    ...payload,
    userId: user.id,
    ownerName: user.displayName,
  });

  res.status(201).json(exchangePoint);
};

export const updateExchangePointController = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const payload = exchangePointUpdateSchema.parse(req.body);
  const exchangePoint = await updateExchangePoint(id, { id: req.user!.id, isAdmin: isAdmin(req.user) }, payload);

  res.json(exchangePoint);
};

export const deleteExchangePointController = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);

  await deleteExchangePoint(id, { id: req.user!.id, isAdmin: isAdmin(req.user) });

  res.json({ message: "Exchange point deleted" });
};