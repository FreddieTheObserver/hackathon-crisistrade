import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { deleteDonation, getDonations, updateDonation } from "../../donations/donationsApi";
import type { Donation, DonationStatus } from "../../donations/donationsTypes";
import { deleteEmergency, getEmergencies, updateEmergency } from "../../emergency-requests/apis/emergency.api";
import type { EmergencyPost, EmergencyStatus } from "../../emergency-requests/types/emergency.type";
import { deleteTrade, fetchTrades, updateTrade } from "../../marketplace-trades/api/marketplace-trades.api";
import type { Trade } from "../../marketplace-trades/types/marketplace-trades.types";
import logoImage from "../logo.png";

type BoardFilter = "all" | "trades" | "donations" | "emergency";
type TimeFilter = "all" | "day" | "week";
type AdminAction = "ban" | "suspend" | "delete" | "restore";

type AdminPost = {
  board: "Trades" | "Donations" | "Emergency";
  contact: string;
  createdAt: string;
  id: string;
  owner: string;
  route: string;
  searchableText: string;
  status: string;
  title: string;
};

const boardOptions: { label: string; value: BoardFilter }[] = [
  { label: "All Boards", value: "all" },
  { label: "Trades", value: "trades" },
  { label: "Donations", value: "donations" },
  { label: "Emergency", value: "emergency" },
];

const timeOptions: { label: string; value: TimeFilter }[] = [
  { label: "All Time", value: "all" },
  { label: "Last 24 hours", value: "day" },
  { label: "Last 7 days", value: "week" },
];

const pageSize = 10;

function formatStatus(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClassName(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("ban")) {
    return "bg-red-100 text-red-700";
  }

  if (normalized.includes("suspend")) {
    return "bg-orange-100 text-orange-700";
  }

  if (["available", "approved", "open"].includes(normalized)) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (["pending", "reserved_pending"].includes(normalized)) {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-blue-100 text-blue-700";
}

function isBanned(status: string) {
  return status.toLowerCase().includes("ban");
}

function isSuspended(status: string) {
  return status.toLowerCase().includes("suspend");
}

function actionLabel(action: AdminAction) {
  if (action === "ban") {
    return "Ban";
  }

  if (action === "suspend") {
    return "Suspend";
  }

  if (action === "restore") {
    return "Restore";
  }

  return "Delete";
}

function actionResultLabel(action: AdminAction) {
  if (action === "ban") {
    return "banned";
  }

  if (action === "suspend") {
    return "suspended";
  }

  if (action === "restore") {
    return "restored";
  }

  return "deleted";
}

function formatPosted(value: string) {
  const createdAt = new Date(value).getTime();

  if (Number.isNaN(createdAt)) {
    return "Unknown";
  }

  const diffInSeconds = Math.max(0, Math.floor((Date.now() - createdAt) / 1000));

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  return `${diffInDays}d ago`;
}

function toTradePost(trade: Trade): AdminPost {
  return {
    board: "Trades",
    contact: trade.contact,
    createdAt: trade.createdAt,
    id: trade.id,
    owner: trade.ownerName,
    route: "/trades",
    searchableText: [trade.title, trade.ownerName, trade.offering, trade.wanting, trade.area, trade.contact, trade.note ?? ""].join(" "),
    status: trade.status,
    title: trade.title,
  };
}

function toDonationPost(donation: Donation): AdminPost {
  return {
    board: "Donations",
    contact: donation.contact,
    createdAt: donation.createdAt,
    id: String(donation.id),
    owner: donation.ownerName,
    route: "/donations",
    searchableText: [
      donation.title,
      donation.ownerName,
      donation.item,
      donation.quantity,
      donation.category,
      donation.location,
      donation.contact,
      donation.note ?? "",
    ].join(" "),
    status: donation.status,
    title: donation.title,
  };
}

function toEmergencyPost(post: EmergencyPost): AdminPost {
  return {
    board: "Emergency",
    contact: post.contact,
    createdAt: post.createdAt,
    id: post.id,
    owner: post.contact,
    route: "/requests",
    searchableText: [post.title, post.need, post.location, post.urgency, post.contact, post.note].join(" "),
    status: post.status,
    title: post.title,
  };
}

async function updatePostStatus(post: AdminPost, action: Exclude<AdminAction, "delete">) {
  if (post.board === "Trades") {
    const formData = new FormData();
    formData.append("status", action === "ban" ? "banned" : action === "suspend" ? "suspended" : "available");
    await updateTrade(post.id, formData);
    return;
  }

  if (post.board === "Donations") {
    await updateDonation(Number(post.id), {
      status: action === "ban" ? "BANNED" : action === "suspend" ? "SUSPENDED" : "AVAILABLE",
    } satisfies { status: DonationStatus });
    return;
  }

  await updateEmergency(post.id, {
    status: action === "ban" ? "Banned" : action === "suspend" ? "Suspended" : "Open",
  } satisfies { status: EmergencyStatus });
}

async function deletePost(post: AdminPost) {
  if (post.board === "Trades") {
    await deleteTrade(post.id);
    return;
  }

  if (post.board === "Donations") {
    await deleteDonation(Number(post.id));
    return;
  }

  await deleteEmergency(post.id);
}

const AdminOverviewPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [search, setSearch] = useState("");
  const [boardFilter, setBoardFilter] = useState<BoardFilter>("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ action: AdminAction; post: AdminPost } | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const [trades, donations, emergencies] = await Promise.all([
        fetchTrades({ search: "", area: "", itemType: "", urgency: "", status: "" }),
        getDonations(),
        getEmergencies(),
      ]);

      const combinedPosts = [
        ...trades.map(toTradePost),
        ...donations.map(toDonationPost),
        ...emergencies.map(toEmergencyPost),
      ].sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime());

      setPosts(combinedPosts);
    } catch {
      setError("Could not load posts from all boards.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, boardFilter, statusFilter, timeFilter]);

  const statusOptions = useMemo(() => {
    const statuses = Array.from(new Set(posts.map((post) => post.status))).sort((first, second) =>
      formatStatus(first).localeCompare(formatStatus(second)),
    );

    return [{ label: "All Statuses", value: "all" }, ...statuses.map((status) => ({ label: formatStatus(status), value: status }))];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const now = Date.now();

    return posts.filter((post) => {
      const matchesSearch =
        !normalizedSearch || post.searchableText.toLowerCase().includes(normalizedSearch);
      const matchesBoard =
        boardFilter === "all" || post.board.toLowerCase() === boardFilter;
      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      const createdAt = new Date(post.createdAt).getTime();
      const age = now - createdAt;
      const matchesTime =
        timeFilter === "all" ||
        (timeFilter === "day" && age <= 24 * 60 * 60 * 1000) ||
        (timeFilter === "week" && age <= 7 * 24 * 60 * 60 * 1000);

      return matchesSearch && matchesBoard && matchesStatus && matchesTime;
    });
  }, [boardFilter, posts, search, statusFilter, timeFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visiblePosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstVisiblePost = filteredPosts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastVisiblePost = Math.min(currentPage * pageSize, filteredPosts.length);

  const handleAction = async (post: AdminPost, action: AdminAction) => {
    const actionKey = `${action}-${post.board}-${post.id}`;
    setBusyAction(actionKey);
    setError(null);
    setSuccessMessage(null);

    try {
      if (action === "delete") {
        await deletePost(post);
      } else {
        await updatePostStatus(post, action);
      }

      setSuccessMessage(`${post.board} post ${actionResultLabel(action)}.`);
      await loadPosts();
    } catch {
      setError(`Could not ${action} that ${post.board.toLowerCase()} post.`);
    } finally {
      setBusyAction(null);
      setConfirmation(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="flex w-64 flex-col gap-6 bg-slate-900 p-6 text-white">
        <NavLink to="/trades" className="flex items-center gap-3 rounded-md transition hover:text-emerald-300">
          <img src={logoImage} alt="Crisis Trade logo" className="h-10 w-10 rounded object-contain" />
          <div className="text-xl font-bold">Crisis Trade</div>
        </NavLink>
        <nav className="mt-6 flex flex-col gap-2">
          <NavLink
            to="/admin/overview"
            className={({ isActive }) =>
              `rounded px-3 py-2 font-semibold ${isActive ? "bg-emerald-600" : "bg-transparent hover:bg-slate-800"}`
            }
          >
            Overview
          </NavLink>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `rounded px-3 py-2 font-semibold ${isActive ? "bg-emerald-600" : "bg-transparent hover:bg-slate-800"}`
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
            <NavLink
              to="/trades"
              className="mb-2 inline-flex rounded-md border border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
            >
              View Marketplace
            </NavLink>
            <h1 className="text-2xl font-bold">Admin Overview</h1>
            <p className="text-sm text-slate-500">Review, moderate, and take action on user posts.</p>
          </div>
        </div>

        <section className="mt-6 space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold">Manage Posts</h3>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="col-span-1 md:col-span-2">
                <input
                  className="w-full rounded border border-slate-200 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search posts by title, keyword, or user..."
                  value={search}
                />
              </div>
              <select
                className="rounded border border-slate-200 p-3"
                onChange={(event) => setBoardFilter(event.target.value as BoardFilter)}
                value={boardFilter}
              >
                {boardOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                className="rounded border border-slate-200 p-3"
                onChange={(event) => setStatusFilter(event.target.value)}
                value={statusFilter}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                className="rounded border border-slate-200 p-3"
                onChange={(event) => setTimeFilter(event.target.value as TimeFilter)}
                value={timeFilter}
              >
                {timeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mt-4 rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {successMessage}
              </div>
            )}

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-sm text-slate-500">
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
                  {loading ? (
                    <tr>
                      <td className="py-6 text-sm text-slate-500" colSpan={6}>
                        Loading posts...
                      </td>
                    </tr>
                  ) : visiblePosts.length === 0 ? (
                    <tr>
                      <td className="py-6 text-sm text-slate-500" colSpan={6}>
                        No posts match these filters.
                      </td>
                    </tr>
                  ) : (
                    visiblePosts.map((post) => (
                      <tr key={`${post.board}-${post.id}`} className="align-top">
                        <td className="py-4">
                          <button
                            className="text-left font-medium text-slate-900 hover:text-emerald-700"
                            onClick={() => navigate(post.route)}
                            type="button"
                          >
                            {post.title}
                          </button>
                        </td>
                        <td className="py-4">{post.board}</td>
                        <td className="py-4">
                          <div>{post.owner}</div>
                          <div className="text-xs text-slate-400">{post.contact}</div>
                        </td>
                        <td className="py-4">
                          <span className={`rounded-full px-3 py-1 text-sm ${statusClassName(post.status)}`}>
                            {formatStatus(post.status)}
                          </span>
                        </td>
                        <td className="py-4">{formatPosted(post.createdAt)}</td>
                        <td className="space-x-2 py-4">
                          {isBanned(post.status) || isSuspended(post.status) ? (
                            <button
                              className="text-sm font-medium text-emerald-600 disabled:cursor-not-allowed disabled:text-slate-300"
                              disabled={busyAction !== null}
                              onClick={() => setConfirmation({ action: "restore", post })}
                              type="button"
                            >
                              Restore
                            </button>
                          ) : (
                            <>
                              <button
                                className="text-sm font-medium text-red-600 disabled:cursor-not-allowed disabled:text-slate-300"
                                disabled={busyAction !== null}
                                onClick={() => setConfirmation({ action: "ban", post })}
                                type="button"
                              >
                                Ban
                              </button>
                              <button
                                className="text-sm font-medium text-amber-600 disabled:cursor-not-allowed disabled:text-slate-300"
                                disabled={busyAction !== null}
                                onClick={() => setConfirmation({ action: "suspend", post })}
                                type="button"
                              >
                                Suspend
                              </button>
                            </>
                          )}
                          <button
                            className="text-sm font-medium text-red-400 disabled:cursor-not-allowed disabled:text-slate-300"
                            disabled={busyAction !== null}
                            onClick={() => setConfirmation({ action: "delete", post })}
                            type="button"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Showing {firstVisiblePost} to {lastVisiblePost} of {filteredPosts.length} posts
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded border px-2 py-1 disabled:cursor-not-allowed disabled:text-slate-300"
                  disabled={currentPage === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  type="button"
                >
                  &lt;
                </button>
                <span className="rounded bg-emerald-600 px-3 py-1 text-white">{currentPage}</span>
                <button
                  className="rounded border px-2 py-1 disabled:cursor-not-allowed disabled:text-slate-300"
                  disabled={currentPage === pageCount}
                  onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                  type="button"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {confirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <section
            aria-modal="true"
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl"
            role="dialog"
          >
            <h2 className="text-xl font-bold text-slate-950">
              Confirm {actionLabel(confirmation.action)}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Are you sure you want to {actionLabel(confirmation.action).toLowerCase()} this {confirmation.post.board.toLowerCase()} post?
            </p>
            <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">{confirmation.post.title}</p>
              <p className="mt-1 text-sm text-slate-500">
                Current status: {formatStatus(confirmation.post.status)}
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:border-slate-400 hover:text-slate-900"
                disabled={busyAction !== null}
                onClick={() => setConfirmation(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300 ${
                  confirmation.action === "delete" || confirmation.action === "ban"
                    ? "bg-red-600 hover:bg-red-700"
                    : confirmation.action === "suspend"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                }`}
                disabled={busyAction !== null}
                onClick={() => void handleAction(confirmation.post, confirmation.action)}
                type="button"
              >
                {busyAction ? "Working..." : actionLabel(confirmation.action)}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminOverviewPage;
