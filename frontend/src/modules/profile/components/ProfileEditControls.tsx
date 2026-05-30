type ProfileEditControlsProps = {
  onCancel: () => void;
  onSave: () => void;
};

export const ProfileEditControls = ({ onCancel, onSave }: ProfileEditControlsProps) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <button
        className="whitespace-nowrap rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg"
        onClick={onSave}
        type="button"
      >
        Save
      </button>
      <button
        className="whitespace-nowrap rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#1F2A44] shadow-md transition hover:border-red-200 hover:bg-red-50 hover:ring-2 hover:ring-red-100"
        onClick={onCancel}
        type="button"
      >
        Cancel
      </button>
    </div>
  );
};
