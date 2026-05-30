import { Handshake } from "lucide-react";

interface PageHeaderProps {
  formOpen: boolean;
  onToggleForm: () => void;
}

export function PageHeader({ formOpen, onToggleForm }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded border border-green-100 bg-white text-green-700">
          <Handshake className="h-7 w-7" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketplace Trades</h1>
          <p className="mt-1 text-sm text-gray-600">
            Buy, sell, or trade essential items with your community.
          </p>
        </div>
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
