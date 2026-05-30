type EmergencyUploadButtonProps = {
  onClick: () => void;
  previewUrl?: string;
};

const EmergencyUploadButton = ({ onClick, previewUrl }: EmergencyUploadButtonProps) => {
  return (
    <button
      className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-500 transition hover:border-red-300 hover:ring-2 hover:ring-red-100"
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
      <span>{previewUrl ? "Change" : "Upload"}</span>
    </button>
  );
};

export default EmergencyUploadButton;
