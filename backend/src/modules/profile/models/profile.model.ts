import { prisma } from "../../../db";
import type { UpdateProfileInput } from "../schemas/profile.schema";

const toMonthYear = (date: Date) => {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
};

const getProfileStats = async (userId: string) => {
  const [
    totalTrades,
    completedTrades,
    totalRequests,
    helpedRequests,
    totalDonations,
    finishedDonations,
  ] = await Promise.all([
    prisma.trade.count({ where: { userId } }),
    prisma.trade.count({ where: { status: "completed", userId } }),
    prisma.emergencyRequest.count({ where: { userId } }),
    prisma.emergencyRequest.count({ where: { status: "Helped", userId } }),
    prisma.donation.count({ where: { ownerId: userId } }),
    prisma.donation.count({ where: { ownerId: userId, status: "TAKEN_FINISHED" } }),
  ]);

  return {
    donations: {
      finished: finishedDonations,
      total: totalDonations,
    },
    requests: {
      helped: helpedRequests,
      total: totalRequests,
    },
    trades: {
      completed: completedTrades,
      total: totalTrades,
    },
  };
};

export const getProfileByUserId = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }

  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  const trader = await prisma.trader.findUnique({ where: { userId } });
  const reputationPoints = trader?.reputationPoints ?? 0;
  const stats = await getProfileStats(userId);

  return {
    bio: profile?.bio ?? "",
    email: user.email,
    isVerified: reputationPoints >= 100,
    location: profile?.location ?? "",
    memberSince: toMonthYear(user.createdAt),
    name: user.displayName,
    phone: profile?.phone ?? "",
    profilePhotoUrl: profile?.profilePhotoUrl ?? "",
    reputationPoints,
    stats,
  };
};

export const updateProfileByUserId = async (userId: string, data: UpdateProfileInput) => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!existingUser) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }

  const conflictingUser = await prisma.user.findFirst({
    where: {
      id: { not: userId },
      OR: [{ email: data.email }, { displayName: data.name }],
    },
  });

  if (conflictingUser) {
    throw Object.assign(new Error("Name or email is already in use"), { status: 409 });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        displayName: data.name,
        email: data.email,
      },
    }),
    prisma.userProfile.upsert({
      where: { userId },
      create: {
        bio: data.bio,
        location: data.location,
        phone: data.phone,
        profilePhotoUrl: data.profilePhotoUrl,
        userId,
      },
      update: {
        bio: data.bio,
        location: data.location,
        phone: data.phone,
        profilePhotoUrl: data.profilePhotoUrl,
      },
    }),
  ]);

  return getProfileByUserId(userId);
};
