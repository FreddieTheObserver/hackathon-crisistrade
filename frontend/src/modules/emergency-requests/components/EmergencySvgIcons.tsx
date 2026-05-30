type IconProps = {
  className?: string;
};

const baseProps = {
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const PlusIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg aria-hidden="true" className={className} {...baseProps}>
    <path d="M12 5v14M5 12h14" strokeWidth="2.5" />
  </svg>
);

export const XIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg aria-hidden="true" className={className} {...baseProps}>
    <path d="M6 6l12 12M18 6 6 18" strokeWidth="2.5" />
  </svg>
);

export const ChevronDownIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg aria-hidden="true" className={className} {...baseProps}>
    <path d="m6 9 6 6 6-6" strokeWidth="2.5" />
  </svg>
);

export const MapPinIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg aria-hidden="true" className={className} {...baseProps}>
    <path d="M12 21s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10Z" strokeWidth="2" />
    <circle cx="12" cy="11" r="2.25" strokeWidth="2" />
  </svg>
);

export const PencilLineIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg aria-hidden="true" className={className} {...baseProps}>
    <path d="M12 20h9" strokeWidth="2" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" strokeWidth="2" />
  </svg>
);

export const Trash2Icon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg aria-hidden="true" className={className} {...baseProps}>
    <path d="M3 6h18" strokeWidth="2" />
    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" strokeWidth="2" />
    <path d="M19 6l-1 14H6L5 6" strokeWidth="2" />
    <path d="M10 11v5M14 11v5" strokeWidth="2" />
  </svg>
);