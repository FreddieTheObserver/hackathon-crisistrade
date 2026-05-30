interface LocationIconProps {
  icon: "station" | "cart" | "office" | "park" | "mall";
}

const iconStyles: Record<LocationIconProps["icon"], string> = {
  station: "bg-emerald-50 text-emerald-600",
  cart: "bg-amber-50 text-slate-600",
  office: "bg-sky-50 text-sky-500",
  park: "bg-emerald-50 text-emerald-500",
  mall: "bg-violet-50 text-violet-600",
};

export const LocationIcon = ({ icon }: LocationIconProps) => {
  return (
    <div
      className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-lg ${iconStyles[icon]}`}
      aria-hidden="true"
    >
      {icon === "station" && (
        <svg className="h-9 w-9" viewBox="0 0 32 32" fill="none">
          <path d="M8 8v18M24 8v18M7 12h18M7 18h18M12 7v20M20 7v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 6h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {icon === "cart" && (
        <svg className="h-9 w-9" viewBox="0 0 32 32" fill="none">
          <path d="M7 9h3l2.3 10.5h10.2l2.2-7.5H11.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="14" cy="24" r="1.8" fill="currentColor" />
          <circle cx="23" cy="24" r="1.8" fill="currentColor" />
        </svg>
      )}
      {icon === "office" && (
        <svg className="h-9 w-9" viewBox="0 0 32 32" fill="none">
          <path d="M8 7h16v18H8zM13 7v18M19 7v18" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
      {icon === "park" && (
        <svg className="h-9 w-9" viewBox="0 0 32 32" fill="none">
          <path d="M16 25V11M16 11c-5-6-12 3-5 7M16 11c5-6 12 3 5 7M16 17c-7-3-9 8 0 5M16 17c7-3 9 8 0 5M10 26h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {icon === "mall" && (
        <svg className="h-9 w-9" viewBox="0 0 32 32" fill="none">
          <path d="M9 8h14v16H9z" stroke="currentColor" strokeWidth="2.5" />
          <path d="M14 13h4v6h-4z" fill="currentColor" />
        </svg>
      )}
    </div>
  );
};

export const TargetIcon = () => (
  <svg className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

export const SearchIcon = () => (
  <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="5" stroke="currentColor" strokeWidth="1.8" />
    <path d="m15 15 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const ClockIcon = () => (
  <svg className="mt-1 h-4 w-4 shrink-0 text-slate-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LogoIcon = () => (
  <div className="relative h-14 w-14" aria-hidden="true">
    <div className="absolute left-1 top-2 h-8 w-8 rounded-full border-[6px] border-emerald-500 border-r-transparent border-b-transparent rotate-45" />
    <div className="absolute right-1 top-2 h-8 w-8 rounded-full border-[6px] border-cyan-500 border-l-transparent border-b-transparent -rotate-45" />
    <div className="absolute bottom-2 left-4 h-5 w-5 rotate-45 rounded bg-emerald-500" />
    <div className="absolute bottom-3 left-5 h-2 w-7 -rotate-45 rounded-full bg-white" />
    <div className="absolute bottom-5 left-4 h-2 w-7 -rotate-45 rounded-full bg-white" />
  </div>
);
