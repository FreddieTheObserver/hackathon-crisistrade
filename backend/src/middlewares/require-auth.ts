import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../modules/auth/services/auth.service";

const COOKIE_NAME = "token";

// Verifies the JWT cookie and attaches req.user. 401s when absent/invalid.
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    next(Object.assign(new Error("Authentication required"), { status: 401 }));
    return;
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(Object.assign(new Error("Invalid or expired session"), { status: 401 }));
  }
}
