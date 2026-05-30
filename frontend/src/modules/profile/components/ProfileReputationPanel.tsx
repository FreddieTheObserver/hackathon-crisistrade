type ProfileReputationPanelProps = {
  isVerified: boolean;
  reputationPoints: number;
};

export const ProfileReputationPanel = ({ isVerified, reputationPoints }: ProfileReputationPanelProps) => {
  return (
    <article className="flex min-h-[260px] flex-col items-center justify-center rounded-lg bg-emerald-50 px-8 py-10 text-center shadow-sm">
      <h2 className="text-xl font-bold text-emerald-800">Reputation Points</h2>

      <div className="mt-8 flex items-center justify-center gap-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white">
          <svg aria-hidden="true" className="h-9 w-9" fill="currentColor" viewBox="0 0 24 24">
            <path d="m12 2.5 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.4l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 2.5Z" />
          </svg>
        </div>

        <p className="text-7xl font-bold tracking-wide text-emerald-800">{reputationPoints.toLocaleString()}</p>
      </div>

      <p className="mt-8 text-xl font-bold text-emerald-800">
        {isVerified ? "Trusted Community Member" : "Build reputation to become verified"}
      </p>
    </article>
  );
};
