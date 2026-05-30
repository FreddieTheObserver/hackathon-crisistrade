import api from "../../../api";
import { authResponseSchema } from "../schemas/auth.schema";
import type { AuthUser } from "../schemas/auth.schema";

type LoginPayload = {
  email: string;
  password: string;
};

type SignupPayload = LoginPayload & {
  displayName: string;
};

export const login = async (payload: LoginPayload): Promise<AuthUser> => {
  const response = await api.post("/auth/login", payload);
  return authResponseSchema.parse(response.data).user;
};

export const signup = async (payload: SignupPayload): Promise<AuthUser> => {
  const response = await api.post("/auth/signup", payload);
  return authResponseSchema.parse(response.data).user;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await api.get("/auth/me");
  return authResponseSchema.parse(response.data).user;
};

export const logout = async () => {
  await api.post("/auth/logout");
};
