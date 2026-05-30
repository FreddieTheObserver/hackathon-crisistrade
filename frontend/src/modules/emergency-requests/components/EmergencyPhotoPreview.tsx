type EmergencyPhotoPreviewProps = {
  onClose: () => void;
  photoUrl: string;
};

const EmergencyPhotoPreview = ({ onClose, photoUrl }: EmergencyPhotoPreviewProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6">
      <section className="relative max-h-[86vh] w-full max-w-4xl rounded-lg bg-white p-4 shadow-2xl">
        <button
          className="absolute right-3 top-3 rounded-md bg-black/70 p-2 text-white transition hover:bg-black"
          onClick={onClose}
          type="button"
        >
          <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
          </svg>
        </button>

        <img className="max-h-[80vh] w-full rounded-md object-contain" src={photoUrl} alt="" />
      </section>
    </div>
  );
};

export default EmergencyPhotoPreview;
