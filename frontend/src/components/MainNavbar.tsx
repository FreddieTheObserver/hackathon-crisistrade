import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

type NavTone = "trade" | "emergency" | "donation" | "location";

/** First letters of up to two words, e.g. "Aung Kyaw" → "AK". */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

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
];

const navToneClasses: Record<NavTone, { text: string; underline: string }> = {
  trade: {
    text: "text-trade hover:text-trade",
    underline: "bg-trade",
  },
  emergency: {
    text: "text-emergency hover:text-emergency",
    underline: "bg-emergency",
  },
  donation: {
    text: "text-donation hover:text-donation",
    underline: "bg-donation",
  },
  location: {
    text: "text-location hover:text-location",
    underline: "bg-location",
  },
};

export const MainNavbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (isAdminRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface shadow-sm">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-6 px-6 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src="/MainLogo.png" alt="" className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold tracking-normal text-ink">
            Crisis <span className="text-accent">Trade</span>
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
                    isActive ? tone.text : "text-muted hover:text-ink",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    <span
                      className={[
                        "absolute inset-x-0 -bottom-4 h-0.5 origin-center rounded-full transition-all duration-200",
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

        <div className="flex shrink-0 items-center gap-3">
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                [
                  "hidden rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors duration-200 md:inline-block",
                  isActive
                    ? "border-emerald-300 bg-emerald-600 text-white"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100",
                ].join(" ")
              }
            >
              Admin
            </NavLink>
          )}

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              [
                "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold shadow-sm transition-colors duration-200",
                isActive
                  ? "border-blue-300 bg-blue-600 text-white"
                  : "border-blue-200 bg-blue-100 text-blue-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800",
              ].join(" ")
            }
            aria-label={user ? `Profile — ${user.displayName}` : "Profile"}
            title={user?.displayName}
          >
            {user ? initialsOf(user.displayName) : "?"}
          </NavLink>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink transition-colors hover:bg-page md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-line bg-surface px-6 py-3 md:hidden">
          <ul className="flex flex-col gap-1 text-sm font-semibold">
            {navItems.map((item) => {
              const tone = navToneClasses[item.tone];

              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "block rounded-md px-3 py-2 transition-colors",
                        isActive ? tone.text : "text-muted hover:text-ink",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            })}

            {user?.role === "admin" && (
              <li>
                <NavLink
                  to="/admin"
                  className="block rounded-md px-3 py-2 text-accent transition-colors hover:text-accent-strong"
                >
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};
