import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

interface AppError extends Error {
  status?: number;
}

export function errorHandler(
  err: AppError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    console.error(`[400] Validation failed`, err.issues);
    return res.status(400).json({
      message: "Validation failed",
      issues: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }

  const status = err.status ?? 500;
  const message = err.message ?? "Internal server error";

  console.error(`[${status}] ${message}`);

  res.status(status).json({ message });
}
