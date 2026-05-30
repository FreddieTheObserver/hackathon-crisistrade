import { XIcon } from "./EmergencySvgIcons";

type EmergencyClearFiltersButtonProps = {
  onClick: () => void;
};

const EmergencyClearFiltersButton = ({ onClick }: EmergencyClearFiltersButtonProps) => {
  return (
    <button
      className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-5 text-sm font-medium text-[#1D2A44] shadow-sm transition hover:border-red-300 hover:bg-slate-50 hover:ring-2 hover:ring-red-100"
      onClick={onClick}
      type="button"
    >
      <XIcon className="h-3 w-3" />
      <span>Clear Filters</span>
    </button>
  );
};

export default EmergencyClearFiltersButton;
