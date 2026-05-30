import { useState } from "react";

type EmergencyFilterSelectProps = {
  label: string;
  options?: string[];
  value: string;
};

const EmergencyFilterSelect = ({
  label,
  options = ["Option", "Option", "Option", "Option"],
  value,
}: EmergencyFilterSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <span className="mb-1.5 block text-sm font-semibold text-[#1D2A44]">{label}</span>
      <button
        className={`flex h-12 w-full items-center justify-between rounded-md border bg-white px-4 text-left text-[#1D2A44] shadow-sm transition ${
          isOpen
            ? "border-red-300 ring-2 ring-red-100"
            : "border-slate-300 hover:border-red-300 hover:ring-2 hover:ring-red-100"
        }`}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="text-sm font-semibold">{value}</span>
        <svg
          aria-hidden="true"
          className={`h-5 w-5 text-[#1D2A44] transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-md bg-white py-2 shadow-xl">
          {options.map((option, index) => (
            <button
              className="block w-full border border-transparent px-4 py-3 text-left text-sm font-medium text-[#1D2A44] transition hover:border-red-300 hover:bg-slate-50 hover:shadow-[0_0_0_2px_rgba(254,226,226,1)]"
              key={`${option}-${index}`}
              onClick={() => setIsOpen(false)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyFilterSelect;
