import { ITEM_TYPES, URGENCIES, STATUSES } from "../schemas/marketplace-trades.schemas";
import type { TradeFilters as TradeFiltersState } from "../types/marketplace-trades.types";

interface TradeFiltersProps {
  filters: TradeFiltersState;
  areaOptions: string[];
  onChange: (filters: TradeFiltersState) => void;
  onClear: () => void;
}

const selectClass =
  "rounded-md border border-gray-300 px-2 py-2 text-sm text-gray-700 focus:border-green-500 focus:outline-none";

export function TradeFilters({ filters, areaOptions, onChange, onClear }: TradeFiltersProps) {
  function set<K extends keyof TradeFiltersState>(key: K, value: TradeFiltersState[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <input
        type="text"
        value={filters.search}
        onChange={(e) => set("search", e.target.value)}
        placeholder="Search trades…"
        className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
      />

      <select
        value={filters.area}
        onChange={(e) => set("area", e.target.value)}
        className={selectClass}
      >
        <option value="">All Locations</option>
        {areaOptions.map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </select>

      <select
        value={filters.itemType}
        onChange={(e) => set("itemType", e.target.value as TradeFiltersState["itemType"])}
        className={selectClass}
      >
        <option value="">All Categories</option>
        {ITEM_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        value={filters.urgency}
        onChange={(e) => set("urgency", e.target.value as TradeFiltersState["urgency"])}
        className={selectClass}
      >
        <option value="">All Urgencies</option>
        {URGENCIES.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => set("status", e.target.value as TradeFiltersState["status"])}
        className={selectClass}
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onClear}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
      >
        ✕ Clear Filters
      </button>
    </div>
  );
}
