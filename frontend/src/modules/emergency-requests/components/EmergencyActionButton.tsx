import type { ReactNode } from "react";

type EmergencyActionButtonProps = {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

const EmergencyActionButton = ({
  icon,
  label,
  onClick,
  type = "button",
}: EmergencyActionButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
    >
      {icon}
      {label}
    </button>
  );
};

export default EmergencyActionButton;
