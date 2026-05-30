export const ProfileVerifiedBadge = () => {
  return (
    <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
        <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <path d="m5 12 4 4L19 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </svg>
      </span>
      Verified Member
    </div>
  );
};
