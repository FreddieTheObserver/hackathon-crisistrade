import { Pencil, Trash2 } from "lucide-react";
import type { Donation, DonationStatus } from "../donationsTypes";
import {
  DONATION_OWNER_STATUSES,
  DONATION_MODERATION_STATUSES,
} from "../donationsTypes";
import { useIsAdmin } from "../../../auth/AuthContext";

const statusLabels: Record<DonationStatus, string> = {
  AVAILABLE: "Available",
  RESERVED_PENDING: "Reserved",
  TAKEN_FINISHED: "Taken",
  SUSPENDED: "Suspended",
  BANNED: "Banned",
};

const statusClasses: Record<DonationStatus, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-700",
  RESERVED_PENDING: "bg-blue-50 text-blue-700",
  TAKEN_FINISHED: "bg-amber-50 text-amber-700",
  SUSPENDED: "bg-orange-50 text-orange-700",
  BANNED: "bg-red-50 text-red-700",
};

// short time text for cards
function formatTimeAgo(value: string) {
  const createdAt = new Date(value).getTime();
  const now = Date.now();
  const diffInSeconds = Math.max(0, Math.floor((now - createdAt) / 1000));

  if (diffInSeconds < 60) {
    return "just now";
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

  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);

  return `${diffInWeeks}w ago`;
}

type DonationCardProps = {
  donation: Donation;
  onEdit: (donation: Donation) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: DonationStatus) => void;
};

export function DonationCard({
  donation,
  onEdit,
  onDelete,
  onStatusChange,
}: DonationCardProps) {
  const isAdmin = useIsAdmin();
  // Banned posts are locked for owners (only an admin can lift a ban). A
  // suspended post stays editable so the owner can lift their own suspension,
  // but they still can't move a post into a moderation state.
  const moderationLocked = !isAdmin && donation.status === "BANNED";
  const statusOptions: DonationStatus[] = isAdmin
    ? [...DONATION_OWNER_STATUSES, ...DONATION_MODERATION_STATUSES]
    : moderationLocked
      ? [donation.status]
      : donation.status === "SUSPENDED"
        ? [donation.status, ...DONATION_OWNER_STATUSES]
        : DONATION_OWNER_STATUSES;

  return (
    // owner cards show edit controls
    <article
      className={`overflow-hidden rounded border bg-white shadow-sm ${
        donation.isOwner
          ? "border-emerald-500 ring-1 ring-emerald-200"
          : "border-slate-200"
      }`}
    >
      <div className="flex gap-4 p-4">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded bg-slate-200 text-sm font-semibold text-white">
          {donation.photoUrl ? (
            <img
              src={donation.photoUrl}
              alt={donation.item}
              className="h-full w-full rounded object-cover"
            />
          ) : (
            donation.category
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h2 className="font-bold">{donation.title}</h2>
            <span
              className={`rounded px-2 py-1 text-xs font-semibold ${
                statusClasses[donation.status]
              }`}
            >
              {statusLabels[donation.status]}
            </span>
          </div>

          <p className="text-sm font-small">
            <strong>Offer: </strong>{donation.item}
          </p>
          <p className="text-sm font-small">
            <strong>Amount: </strong>{donation.quantity}
          </p>
          <p className="text-sm font-small">
            <strong>Location: </strong>{donation.location}
          </p>
        
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {donation.note || "No additional note."}
          </p>
        </div>
      </div>

      {/* footer details */}
      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-1">
            <span>Posted By: {donation.ownerName}</span>
            <span>Contact: {donation.contact}</span>
          </div>
        </div>

        {donation.isOwner ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(donation)}
              aria-label="Edit donation"
              title="Edit donation"
              className="inline-flex h-7 w-7 items-center justify-center rounded border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              <Pencil size={14} strokeWidth={2} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(donation.id)}
              aria-label="Delete donation"
              title="Delete donation"
              className="inline-flex h-7 w-7 items-center justify-center rounded border border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} strokeWidth={2} />
            </button>
          </div>
        ) : null}
      </div>

      {donation.isOwner ? (
        // owner can update status here
        <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
          <select
            value={donation.status}
            onChange={(event) =>
              onStatusChange(
                donation.id,
                event.target.value as DonationStatus,
              )
            }
            disabled={moderationLocked}
            title={moderationLocked ? "Moderated by an admin" : undefined}
            className="rounded border border-slate-200 px-2 py-1 text-xs disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>

          <span className="text-xs text-slate-400">
            {formatTimeAgo(donation.createdAt)}
          </span>
        </div>
      ) : (
        <div className="flex justify-end border-t border-slate-100 px-4 py-3">
          <span className="text-xs text-slate-400">
            {formatTimeAgo(donation.createdAt)}
          </span>
        </div>
      )}
    </article>
  );
}
