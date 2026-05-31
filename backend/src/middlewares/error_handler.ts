import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { MulterError } from "multer";

interface AppError extends Error {
  status?: number;
  type?: string;
}

export function errorHandler(
  err: AppError | ZodError | MulterError,
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

  // File-upload errors (e.g. size limit) are client errors, not 500s.
  if (err instanceof MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image must be 2 MB or smaller"
        : err.message;
    console.error(`[400] Upload failed: ${err.code}`);
    return res.status(400).json({ message });
  }

  const status = err.status ?? 500;
  const message =
    status === 413 || err.type === "entity.too.large"
      ? "Profile photo is too large. Upload an image smaller than 3.5 MB."
      : err.message ?? "Internal server error";

  console.error(`[${status}] ${message}`);

  res.status(status).json({ message });
}
