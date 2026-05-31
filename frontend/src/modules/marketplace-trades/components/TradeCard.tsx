import type { Trade, ItemType, Status } from '../types/marketplace-trades.types';
import { STATUSES, OWNER_STATUSES, MODERATION_STATUSES } from '../schemas/marketplace-trades.schemas';
import { StatusBadge, STATUS_LABELS } from './StatusBadge';
import { timeAgo } from '../lib/timeAgo';
import { useCanManage, useIsAdmin } from '../../../auth/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

// Category -> placeholder block color, used when a trade has no uploaded photo
const CATEGORY_COLORS: Record<ItemType, string> = {
      water: "bg-sky-500",
      food: "bg-orange-500",
      medicine: "bg-rose-500",
      batteries: "bg-yellow-500",
      shelter: "bg-emerald-600",
      tools: "bg-slate-500",
      other: "bg-gray-500",
};

interface TradeCardProps {
      trade: Trade;
      highlighted: boolean;
      onEdit: (trade: Trade) => void;
      onDelete: (trade: Trade) => void;
      onStatusChange: (trade: Trade, status: Status) => void;
}

export function TradeCard({
      trade, 
      highlighted,
      onEdit,
      onDelete,
      onStatusChange,
}: TradeCardProps) {
      const photoSrc = trade.photoUrl ? `${API_URL}${trade.photoUrl}` : null
      // Only the owner (or an admin) may change status / edit / delete; the
      // backend enforces this too (403 otherwise), this just hides dead controls.
      const canManage = useCanManage(trade.userId)
      const isAdmin = useIsAdmin()
      // suspended/banned are admin-only. A plain owner only ever sees the normal
      // lifecycle states, and can't touch a post an admin has already moderated.
      const moderationLocked =
            !isAdmin && (MODERATION_STATUSES as readonly string[]).includes(trade.status)
      const statusOptions: readonly string[] = isAdmin
            ? STATUSES
            : moderationLocked
                  ? [trade.status]
                  : OWNER_STATUSES

      return (
            <article
                  className={`flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition ${
                              highlighted
                                    ? "border-emerald-500 ring-2 ring-emerald-300"
                                    : canManage
                                          ? "border-emerald-500 ring-1 ring-emerald-200"
                                          : "border-gray-200"
                  }`}
            >
                  <div className="relative h-40 w-full">
                        {photoSrc ? (
                              <img src={photoSrc} alt={trade.title} className="h-full w-full object-cover"/>
                        ) : (
                              <div
                                    className={`flex h-full w-full items-center justify-center ${CATEGORY_COLORS[trade.itemType]}`}
                              >
                                    <span className="text-sm font-semibold uppercase tracking-wide text-white/90">
                                          {trade.itemType}
                                    </span>
                              </div>
                        )}
                        <div className="absolute right-2 top-2">
                              <StatusBadge status={trade.status} />
                        </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-4">
                        <h3 className="text-base font-semibold text-gray-900">{trade.title}</h3>

                        <div className="flex flex-wrap items-center gap-2 text-sm">
                              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                    Offer
                              </span>
                              <span className="text-gray-700">{trade.offering}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-sm">
                              <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                    Want
                              </span>
                              <span className="text-gray-700">{trade.wanting}</span>
                        </div>

                        <p className="text-sm font-semibold text-gray-900">{trade.area}</p>

                        {trade.note && <p className="text-sm text-gray-500">{trade.note}</p>}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm">
                        <div className="min-w-0">
                              <p className="truncate font-medium text-gray-900">{trade.ownerName}</p>
                              <p className="truncate text-green-600">{trade.contact}</p>
                        </div>
                        <span className="shrink-0 text-xs text-gray-400">{timeAgo(trade.createdAt)}</span>
                  </div>

                  {canManage && (
                        <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-3">
                              <select
                                    value={trade.status}
                                    onChange={(e) => onStatusChange(trade, e.target.value as Status)}
                                    disabled={moderationLocked}
                                    title={moderationLocked ? "Moderated by an admin" : undefined}
                                    className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 focus:border-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                              >
                                    {statusOptions.map((status) => (
                                          <option key={status} value={status}>
                                                {STATUS_LABELS[status as Status]}
                                          </option>
                                    ))}
                              </select>

                              <div className="ml-auto flex gap-2">
                                    <button
                                          type="button"
                                          onClick={() => onEdit(trade)}
                                          className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                          Edit
                                    </button>
                                    <button
                                          type="button"
                                          onClick={() => onDelete(trade)}
                                          className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                                    >
                                          Delete
                                    </button>
                              </div>
                        </div>
                  )}
            </article>
      )
}