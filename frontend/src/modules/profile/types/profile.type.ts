export type ProfileInfo = {
  bio: string;
  email: string;
  location: string;
  memberSince: string;
  name: string;
  phone: string;
  profilePhotoUrl: string;
  reputationPoints: number;
};

export type UpdateProfilePayload = Omit<ProfileInfo, "memberSince" | "reputationPoints">;
