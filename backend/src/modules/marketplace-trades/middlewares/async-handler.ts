import type { Request, Response, NextFunction } from "express";

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

// Forwards any rejected promise from an async handler to the central errorHandler.
export const asyncHandler =
      (fn: AsyncRouteHandler) =>
      (req: Request, res: Response, next: NextFunction): void => {
            Promise.resolve(fn(req, res, next)).catch(next);
      };
