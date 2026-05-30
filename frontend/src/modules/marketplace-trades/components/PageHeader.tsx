interface PageHeaderProps {
  formOpen: boolean;
  onToggleForm: () => void;
}

export function PageHeader({ formOpen, onToggleForm }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-green-700">
          trade
        </span>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Marketplace Trades</h1>
        <p className="mt-1 text-sm text-gray-600">
          Buy, sell, or trade essential items with your community.
        </p>
      </div>
      <button
        type="button"
        onClick={onToggleForm}
        className="shrink-0 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
      >
        {formOpen ? "Close" : "+ Add Trade"}
      </button>
    </div>
  );
}
