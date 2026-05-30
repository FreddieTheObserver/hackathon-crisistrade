import { Link, NavLink, useLocation } from "react-router-dom";

type NavTone = "trade" | "emergency" | "donation" | "location";

type NavItem = {
  label: string;
  to: string;
  tone: NavTone;
};

const navItems: NavItem[] = [
  { label: "Trades", to: "/trades", tone: "trade" },
  { label: "Emergency", to: "/requests", tone: "emergency" },
  { label: "Donations", to: "/donations", tone: "donation" },
  { label: "Locations", to: "/exchange-points", tone: "location" },
  // Add new navbar route links here when router integration is ready.
];

const navToneClasses: Record<NavTone, { text: string; underline: string }> = {
  trade: {
    text: "text-yellow-500 hover:text-yellow-500",
    underline: "bg-yellow-400",
  },
  emergency: {
    text: "text-red-500 hover:text-red-500",
    underline: "bg-red-500",
  },
  donation: {
    text: "text-green-600 hover:text-green-600",
    underline: "bg-green-500",
  },
  location: {
    text: "text-sky-600 hover:text-sky-600",
    underline: "bg-sky-500",
  },
};

export const MainNavbar = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img src="/MainLogo.png" alt="" className="h-12 w-12 object-contain" />
          <span className="text-2xl font-bold tracking-normal text-slate-900">
            Crisis <span className="text-emerald-600">Trade</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          {navItems.map((item) => {
            const tone = navToneClasses[item.tone];

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "group relative px-1 py-2 transition-colors duration-200",
                    isActive ? tone.text : "text-slate-600 hover:text-slate-950",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    <span
                      className={[
                        "absolute inset-x-0 -bottom-6 h-0.5 origin-center rounded-full transition-all duration-200",
                        tone.underline,
                        isActive
                          ? "scale-x-100 opacity-100"
                          : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100",
                      ].join(" ")}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            [
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-base font-bold shadow-sm transition-colors duration-200",
              isActive
                ? "border-blue-300 bg-blue-600 text-white"
                : "border-blue-200 bg-blue-100 text-blue-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800",
            ].join(" ")
          }
          aria-label="Profile"
        >
          AK
        </NavLink>
      </div>
    </header>
  );
};
