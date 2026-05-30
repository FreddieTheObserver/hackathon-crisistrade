import type { Status } from '../types/marketplace-trades.types';

const STATUS_STYLES: Record<Status, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-green-100 text-green-800" },
  pending: { label: "Reserved", className: "bg-amber-100 text-amber-800" },
  completed: { label: "Completed", className: "bg-blue-100 text-blue-800" },
  unavailable: { label: "Unavailable", className: "bg-red-100 text-red-700" },
  suspended: { label: "Suspended", className: "bg-orange-100 text-orange-800" },
  banned: { label: "Banned", className: "bg-red-200 text-red-800" },
};

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
