import type { Request, Response } from "express";
import { signupSchema, loginSchema } from "../schemas/auth.schema";
import {
  registerUser,
  authenticateUser,
  signToken,
  getAuthUserById,
  getReputationPoints,
} from "../services/auth.service";

const COOKIE_NAME = "token";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: SEVEN_DAYS_MS,
    path: "/",
  };
}

export async function signup(req: Request, res: Response) {
  const input = signupSchema.parse(req.body);
  const user = await registerUser(input);
  res.cookie(COOKIE_NAME, signToken(user), cookieOptions());
  res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);
  const user = await authenticateUser(input);
  res.cookie(COOKIE_NAME, signToken(user), cookieOptions());
  res.json({ user });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
  res.json({ message: "Logged out" });
}

export async function me(req: Request, res: Response) {
  // requireAuth guarantees req.user is set.
  const user = await getAuthUserById(req.user!.id);
  const reputationPoints = await getReputationPoints(user.id);
  res.json({ user: { ...user, reputationPoints } });
}
