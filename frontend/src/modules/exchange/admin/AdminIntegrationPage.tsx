import { NavLink } from "react-router-dom";
import logoImage from "../logo.png";

const AdminIntegrationPage = () => (
  <div className="min-h-screen flex bg-slate-50 text-slate-900">
    <aside className="flex w-64 flex-col gap-6 border-r border-slate-800 bg-slate-900 p-6 text-white">
      <div className="flex items-center gap-3">
        <img src={logoImage} alt="Crisis Trade logo" className="h-10 w-10 rounded object-contain" />
        <div className="text-xl font-bold">Crisis Trade</div>
      </div>
      <nav className="mt-6 flex flex-col gap-2">
        <NavLink
          to="/admin/overview"
          className={({ isActive }) =>
            `rounded px-3 py-2 font-semibold ${isActive ? "bg-emerald-600" : "bg-transparent"}`
          }
        >
          Overview
        </NavLink>
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `rounded px-3 py-2 font-semibold ${isActive ? "bg-emerald-600" : "bg-transparent"}`
          }
        >
          Locations
        </NavLink>
      </nav>
    </aside>

    <main className="flex-1 p-8">
      <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-600">Integration pending</p>
        <h1 className="mt-3 text-2xl font-bold">Needs to be integrated with other members later</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          This admin profile and sign-out flow depends on the shared authentication work. It is a placeholder until the team integrates auth, current-user state, and logout behavior.
        </p>
      </section>
    </main>
  </div>
);

export default AdminIntegrationPage;
