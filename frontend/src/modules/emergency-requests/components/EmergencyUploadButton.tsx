type EmergencyUploadButtonProps = {
  onClick: () => void;
  onRemove?: () => void;
  previewUrl?: string;
};

const EmergencyUploadButton = ({ onClick, onRemove, previewUrl }: EmergencyUploadButtonProps) => {
  return (
    <div className="space-y-2">
      <button
        className={`flex h-12 w-full items-center justify-center gap-3 rounded-md border bg-white px-4 text-sm font-medium transition hover:border-red-300 hover:ring-2 hover:ring-red-100 ${
          previewUrl ? "border-green-300 text-green-700" : "border-slate-300 text-slate-500"
        }`}
        onClick={onClick}
        type="button"
      >
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path
            d="M12 16V4m0 0 4 4m-4-4-4 4M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
        <span>{previewUrl ? "Uploaded" : "Upload"}</span>
      </button>

      {previewUrl && (
        <div className="flex justify-between gap-2">
          <button
            className="text-xs font-semibold text-[#1D2A44] transition hover:text-red-500"
            onClick={onClick}
            type="button"
          >
            Upload again
          </button>
          <button
            className="text-xs font-semibold text-red-500 transition hover:text-red-600"
            onClick={onRemove}
            type="button"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default EmergencyUploadButton;
