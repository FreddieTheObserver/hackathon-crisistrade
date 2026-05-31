import axios from "axios";
import { z } from "zod";
import api from "../api";

/**
 * Auth API client (Area I integration).
 *
 * Talks to the backend `modules/auth` endpoints mounted at `/auth`.
 * The shared Axios instance sends `withCredentials`, so the httpOnly
 * session cookie is set/cleared by the server automatically.
 */

const authUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  displayName: z.string(),
  location: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  profilePhotoUrl: z.string().optional().default(""),
  role: z.string(),
  reputationPoints: z.number().optional(),
});

const authResponseSchema = z.object({ user: authUserSchema });

export type AuthUser = z.infer<typeof authUserSchema>;

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  password: string;
  displayName: string;
}

export const login = async (input: LoginInput): Promise<AuthUser> => {
  const response = await api.post<unknown>("/auth/login", input);
  return authResponseSchema.parse(response.data).user;
};

export const signup = async (input: SignupInput): Promise<AuthUser> => {
  const response = await api.post<unknown>("/auth/signup", input);
  return authResponseSchema.parse(response.data).user;
};

/** Returns the current session user, or `null` when not authenticated (401). */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const response = await api.get<unknown>("/auth/me");
    return authResponseSchema.parse(response.data).user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) return null;
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

/**
 * Turn an unknown thrown value (Axios error, network failure, …) into a
 * human-readable message. The backend error handler returns `{ message }`
 * (and `issues[]` for Zod validation failures).
 */
export const getAuthErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; issues?: { message: string }[] }
      | undefined;
    if (data?.issues?.length) return data.issues[0].message;
    if (data?.message) return data.message;
    if (!error.response) return "Cannot reach the server. Check your connection and try again.";
  }
  return fallback;
};
