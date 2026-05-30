import api from "../../../api";
import { profileResponseSchema, updateProfilePayloadSchema } from "../schemas/profile.schema";
import type { ProfileInfo, UpdateProfilePayload } from "../types/profile.type";

export const getMyProfile = async (): Promise<ProfileInfo> => {
  const response = await api.get("/profile/me");
  return profileResponseSchema.parse(response.data).profile;
};

export const updateMyProfile = async (payload: UpdateProfilePayload): Promise<ProfileInfo> => {
  const safePayload = updateProfilePayloadSchema.parse(payload);
  const response = await api.patch("/profile/me", safePayload);
  return profileResponseSchema.parse(response.data).profile;
};
