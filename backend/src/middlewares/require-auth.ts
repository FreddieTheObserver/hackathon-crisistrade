import type { Request, Response, NextFunction } from "express";
import type { AuthUser } from "../types/express";
import { verifyToken } from "../modules/auth/services/auth.service";

const COOKIE_NAME = "token";
export const ADMIN_ROLE = "admin";

// True when the user may moderate any post (bypasses per-post ownership checks).
export function isAdmin(user: Pick<AuthUser, "role"> | undefined): boolean {
  return user?.role === ADMIN_ROLE;
}

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

// Guards admin-only routes. Use after requireAuth (or standalone — it verifies too).
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    requireAuth(req, res, (err?: unknown) => {
      if (err) return next(err);
      enforceAdmin(req, next);
    });
    return;
  }
  enforceAdmin(req, next);
}

function enforceAdmin(req: Request, next: NextFunction): void {
  if (!isAdmin(req.user)) {
    next(Object.assign(new Error("Admin access required"), { status: 403 }));
    return;
  }
  next();
}
