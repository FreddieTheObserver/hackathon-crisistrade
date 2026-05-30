import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import logoImage from "./modules/exchange/logo.png";

const navItems = [
  { label: "Trades", to: "/trades" },
  { label: "Emergency", to: "/requests" },
  { label: "Donations", to: "/donations" },
  { label: "Locations", to: "/exchange-points" },
  { label: "Admin", to: "/admin" },
];

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      {!isAdminRoute && (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-6 py-4">
            <Link to="/" className="flex shrink-0 items-center gap-3">
              <img src={logoImage} alt="" className="h-12 w-12 object-contain" />
              <span className="text-2xl font-bold tracking-normal text-slate-900">
                Crisis <span className="text-emerald-600">Trade</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive
                      ? "text-emerald-600"
                      : "transition hover:text-slate-950"
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <NavLink
              to="/admin"
              className={({ isActive }) =>
                [
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-base font-bold shadow-sm transition",
                  isActive
                    ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                    : "border-blue-200 bg-blue-100 text-slate-800 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700",
                ].join(" ")
              }
              aria-label="Open admin dashboard"
            >
              AK
            </NavLink>
          </div>
        </header>
      )}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
