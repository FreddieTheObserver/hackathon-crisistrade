type EmergencyUploadButtonProps = {
  onFileSelected?: (photoUrl: string) => void;
  onRemove?: () => void;
  previewUrl?: string;
};

const EmergencyUploadButton = ({ onFileSelected, onRemove, previewUrl }: EmergencyUploadButtonProps) => {
  const inputId = `upload-input-${Math.random().toString(36).slice(2, 9)}`;

  const readPhoto = (file: File) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        onFileSelected?.(reader.result);
      }
    });

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className={`flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-md border bg-white px-4 text-sm font-medium transition hover:border-red-300 hover:ring-2 hover:ring-red-100 ${previewUrl ? "border-green-300 text-green-700" : "border-slate-300 text-slate-500"}`}>
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
      </label>

      <input
        id={inputId}
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            readPhoto(file);
          }
        }}
        type="file"
      />

      {previewUrl && (
        <div className="flex justify-center mt-2">
          <button
            className="text-xs font-semibold text-red-500 transition hover:text-red-600 hover:underline hover:underline-offset-2"
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
