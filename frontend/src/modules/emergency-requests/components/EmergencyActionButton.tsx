import EmergencyIcon from "./EmergencyIcon";

type EmergencyActionButtonProps = {
  iconSrc?: string;
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

const EmergencyActionButton = ({
  iconSrc,
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
      {iconSrc && <EmergencyIcon className="h-3.5 w-3.5" src={iconSrc} />}
      {label}
    </button>
  );
};

export default EmergencyActionButton;
