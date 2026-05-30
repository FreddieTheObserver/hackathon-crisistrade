type DonationFiltersProps = {
  search: string;
  locationFilter: string;
  categoryFilter: string;
  statusFilter: string;
  locations: string[];
  categories: string[];
  onSearchChange: (value: string) => void;
  onLocationFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
};

export function DonationFilters({
  search,
  locationFilter,
  categoryFilter,
  statusFilter,
  locations,
  categories,
  onSearchChange,
  onLocationFilterChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onClearFilters,
}: DonationFiltersProps) {
  return (
    // filters come from DonationsPage state
    <div className="mb-5 grid gap-3 md:grid-cols-[1.7fr_1fr_1fr_1fr_auto]">
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search donations by item, keyword, or location..."
        className="rounded border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={locationFilter}
        onChange={(event) => onLocationFilterChange(event.target.value)}
        className="rounded border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        <option value="ALL">All Locations</option>
        {locations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>

      <select
        value={categoryFilter}
        onChange={(event) => onCategoryFilterChange(event.target.value)}
        className="rounded border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        <option value="ALL">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value)}
        className="rounded border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        <option value="ALL">All Status</option>
        <option value="AVAILABLE">Available</option>
        <option value="RESERVED_PENDING">Reserved</option>
        <option value="TAKEN_FINISHED">Taken</option>
      </select>

      <button
        type="button"
        onClick={onClearFilters}
        className="rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
      >
        Clear Filters
      </button>
    </div>
  );
}
