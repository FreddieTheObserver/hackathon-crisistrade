import React from "react";
import { NavLink } from "react-router-dom";
import logoImage from "../logo.png";

const AdminOverviewPage: React.FC = () => {
  const posts = [
    { id: "p1", title: "Rice for Blankets", board: "Trades", user: "Ramesh T.", status: "Approved", posted: "2h ago" },
    { id: "p2", title: "Water Bottles for Power Bank", board: "Trades", user: "Sita K.", status: "Approved", posted: "3h ago" },
    { id: "p3", title: "Blankets for Gas Cylinder", board: "Trades", user: "Maya L.", status: "Pending", posted: "4h ago" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="Crisis Trade logo" className="h-10 w-10 rounded object-contain" />
          <div className="text-xl font-bold">Crisis Trade</div>
        </div>
        <nav className="flex flex-col gap-2 mt-6">
          <NavLink
            to="/admin/overview"
            className={({ isActive }) =>
              `px-3 py-2 rounded font-semibold ${isActive ? 'bg-emerald-600' : 'bg-transparent'}`
            }
          >
            Overview
          </NavLink>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded font-semibold ${isActive ? 'bg-emerald-600' : 'bg-transparent'}`
            }
          >
            Locations
          </NavLink>
        </nav>
        <div className="mt-auto">
          <NavLink
            to="/admin/integration-needed"
            className="flex items-center gap-3 rounded-md p-2 transition hover:bg-slate-800"
          >
            <div className="h-10 w-10 rounded-full bg-slate-200" />
            <div>
              <div className="font-bold">Admin</div>
              <div className="text-sm text-emerald-300">Super Admin</div>
            </div>
          </NavLink>
          <NavLink
            to="/admin/integration-needed"
            className="mt-6 flex w-full justify-center rounded border border-slate-700 py-2 font-semibold transition hover:bg-slate-800"
          >
            Sign Out
          </NavLink>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold">Admin Overview</h1>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Needs to be integrated with other members later
              </span>
            </div>
            <p className="text-sm text-slate-500">Review, moderate, and take action on user posts.</p>
          </div>
        </div>

        <section className="mt-6 space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold">Manage Posts</h3>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="col-span-1 md:col-span-2">
                <input
                  className="w-full rounded border border-slate-200 p-3"
                  placeholder="Search posts by title, keyword, or user..."
                />
              </div>
              <select className="rounded border border-slate-200 p-3">
                <option>All Boards</option>
                <option>Trades</option>
                <option>Donations</option>
              </select>
              <select className="rounded border border-slate-200 p-3">
                <option>All Statuses</option>
                <option>Approved</option>
                <option>Pending</option>
              </select>
              <select className="rounded border border-slate-200 p-3">
                <option>All Time</option>
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
              </select>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-slate-500 text-sm">
                  <tr>
                    <th className="py-3">Title</th>
                    <th className="py-3">Board</th>
                    <th className="py-3">User</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Posted</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {posts.map((p) => (
                    <tr key={p.id} className="align-top">
                      <td className="py-4">{p.title}</td>
                      <td className="py-4">{p.board}</td>
                      <td className="py-4">{p.user}</td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            p.status === "Approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : p.status === "Pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4">{p.posted}</td>
                      <td className="py-4 space-x-2">
                        <button className="text-sm text-red-600">Ban</button>
                        <button className="text-sm text-amber-600">Suspend</button>
                        <button className="text-sm text-red-400">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-500">Showing 1 to 10 of 1,248 posts</div>
              <div className="flex items-center gap-2">
                <button className="rounded border px-2 py-1">&lt;</button>
                <button className="rounded bg-emerald-600 px-3 py-1 text-white">1</button>
                <button className="rounded border px-3 py-1">2</button>
                <button className="rounded border px-2 py-1">&gt;</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminOverviewPage;
