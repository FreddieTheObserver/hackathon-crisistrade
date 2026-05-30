type EmergencyActionButtonProps = {
  label: string;
};

const EmergencyActionButton = ({ label }: EmergencyActionButtonProps) => {
  return (
    <button
      type="button"
      className="rounded-lg bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
    >
      {label}
    </button>
  );
};

export default EmergencyActionButton;
