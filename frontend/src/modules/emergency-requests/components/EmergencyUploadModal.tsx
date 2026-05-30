import { useRef } from "react";

type EmergencyUploadModalProps = {
  onClose: () => void;
  onUpload: (photoUrl: string) => void;
};

const EmergencyUploadModal = ({ onClose, onUpload }: EmergencyUploadModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const readPhoto = (file: File) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        onUpload(reader.result);
        onClose();
      }
    });
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-6">
      <section className="relative flex h-72 w-72 flex-col items-center justify-center bg-black/85 text-white shadow-2xl">
        <button
          className="absolute right-4 top-4 rounded-sm p-1 transition hover:bg-white/10"
          onClick={onClose}
          type="button"
        >
          <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
          </svg>
        </button>

        <button
          className="flex flex-col items-center transition hover:scale-105"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <svg aria-hidden="true" className="h-24 w-24" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 16V4m0 0 5 5m-5-5-5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
          </svg>
          <span className="mt-5 text-2xl font-bold">upload your photo</span>
        </button>

        <input
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              readPhoto(file);
            }
          }}
          ref={inputRef}
          type="file"
        />
      </section>
    </div>
  );
};

export default EmergencyUploadModal;
