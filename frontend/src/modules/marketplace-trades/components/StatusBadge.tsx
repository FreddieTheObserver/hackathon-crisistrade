import type { Status } from '../types/marketplace-trades.types';

// Friendly labels for each status, shared by the badge and the status dropdown
// so the trade card reads the same way the donation card does.
export const STATUS_LABELS: Record<Status, string> = {
  available: "Available",
  pending: "Reserved",
  completed: "Completed",
  unavailable: "Unavailable",
  suspended: "Suspended",
  banned: "Banned",
};

const STATUS_CLASSES: Record<Status, string> = {
  available: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  completed: "bg-blue-100 text-blue-800",
  unavailable: "bg-red-100 text-red-700",
  suspended: "bg-orange-100 text-orange-800",
  banned: "bg-red-200 text-red-800",
};

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
