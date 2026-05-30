import type { ReactNode } from "react";

import type { ProfileStats } from "../types/profile.type";
import { DonationIcon, SendIcon, TrendIcon } from "./ProfileIcons";

type ProfileStatCardProps = {
  detail: string;
  icon: ReactNode;
  label: string;
  value: string;
};

const ProfileStatCard = ({ detail, icon, label, value }: ProfileStatCardProps) => {
  return (
    <article className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm">
      {icon}
      <p className="mt-4 text-2xl font-bold text-emerald-800">{value}</p>
      <h3 className="mt-2 text-sm font-bold text-emerald-800">{label}</h3>
      <p className="mt-2 text-xs font-medium text-[#1F2A44]">{detail}</p>
    </article>
  );
};

type ProfileStatsGridProps = {
  stats: ProfileStats;
};

export const ProfileStatsGrid = ({ stats }: ProfileStatsGridProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <ProfileStatCard
        detail={`${stats.trades.completed} completed`}
        icon={<TrendIcon />}
        label="Trades"
        value={String(stats.trades.total)}
      />
      <ProfileStatCard
        detail={`${stats.requests.helped} helped`}
        icon={<SendIcon />}
        label="Requests"
        value={String(stats.requests.total)}
      />
      <ProfileStatCard
        detail={`${stats.donations.finished} finished`}
        icon={<DonationIcon />}
        label="Donations"
        value={String(stats.donations.total)}
      />
    </div>
  );
};
