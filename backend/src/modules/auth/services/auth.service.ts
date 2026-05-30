import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../../../db";
import type { AuthUser } from "../../../types/express";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");

const TOKEN_TTL = "7d";

function httpError(status: number, message: string): never {
  throw Object.assign(new Error(message), { status });
}

async function toAuthUser(u: { id: string; email: string; displayName: string; role: string }): Promise<AuthUser> {
  const profile = await prisma.userProfile.findUnique({
    select: { profilePhotoUrl: true },
    where: { userId: u.id },
  });

  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    profilePhotoUrl: profile?.profilePhotoUrl ?? "",
    role: u.role,
  };
}

export function signToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET as string, { expiresIn: TOKEN_TTL });
}

export function verifyToken(token: string): AuthUser {
  const decoded = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload & AuthUser;
  return {
    id: decoded.id,
    email: decoded.email,
    displayName: decoded.displayName,
    profilePhotoUrl: decoded.profilePhotoUrl ?? "",
    role: decoded.role ?? "user",
  };
}

export async function registerUser(input: {
  email: string;
  password: string;
  displayName: string;
}): Promise<AuthUser> {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email }, { displayName: input.displayName }] },
  });
  if (existing) {
    httpError(
      409,
      existing.email === input.email ? "Email already in use" : "Display name already taken",
    );
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: { email: input.email, displayName: input.displayName, passwordHash },
  });
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    profilePhotoUrl: "",
    role: user.role,
  };
}

export async function authenticateUser(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) httpError(401, "Invalid email or password");
  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) httpError(401, "Invalid email or password");
  return toAuthUser(user);
}

export async function getReputationPoints(userId: string): Promise<number> {
  const trader = await prisma.trader.findUnique({ where: { userId } });
  return trader?.reputationPoints ?? 0;
}

export async function getAuthUserById(userId: string): Promise<AuthUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) httpError(404, "User not found");
  return toAuthUser(user);
}
