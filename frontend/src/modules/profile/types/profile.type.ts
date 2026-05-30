export type ProfileInfo = {
  bio: string;
  email: string;
  isVerified: boolean;
  location: string;
  memberSince: string;
  name: string;
  phone: string;
  profilePhotoUrl: string;
  reputationPoints: number;
  stats: ProfileStats;
};

export type ProfileStats = {
  donations: {
    finished: number;
    total: number;
  };
  requests: {
    helped: number;
    total: number;
  };
  trades: {
    completed: number;
    total: number;
  };
};

export type UpdateProfilePayload = Omit<ProfileInfo, "isVerified" | "memberSince" | "reputationPoints" | "stats">;
