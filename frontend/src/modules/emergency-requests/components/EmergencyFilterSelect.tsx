import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "./EmergencySvgIcons";

type EmergencyFilterSelectProps = {
  label: string;
  onChange?: (value: string) => void;
  options?: string[];
  required?: boolean;
  value: string;
};

const EmergencyFilterSelect = ({
  label,
  onChange,
  options = ["Option", "Option", "Option", "Option"],
  required = false,
  value,
}: EmergencyFilterSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <span className="mb-1.5 block text-sm font-semibold text-[#1D2A44]">
        {label}
        {required && " *"}
      </span>
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
        <ChevronDownIcon className={`h-5 w-5 text-[#1D2A44] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-md bg-white py-2 shadow-xl">
          {options.map((option, index) => (
            <button
              className="block w-full border border-transparent px-4 py-3 text-left text-sm font-medium text-[#1D2A44] transition hover:border-red-300 hover:bg-slate-50 hover:shadow-[0_0_0_2px_rgba(254,226,226,1)]"
              key={`${option}-${index}`}
              onClick={() => {
                onChange?.(option);
                setIsOpen(false);
              }}
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
