type EmergencyDeleteConfirmProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

const EmergencyDeleteConfirm = ({ onCancel, onConfirm }: EmergencyDeleteConfirmProps) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/20 px-6">
      <section className="w-full max-w-md border-2 border-red-500 bg-white px-8 py-7 shadow-xl">
        <p className="mx-auto max-w-xs text-center text-lg font-bold leading-snug text-black">
          Are you sure you want to permanently delete this post?
        </p>

        <div className="mt-5 flex justify-center gap-4">
          <button
            className="h-9 rounded-md bg-red-500 px-7 text-sm font-bold text-white shadow-md transition hover:bg-red-600 hover:ring-2 hover:ring-red-100"
            onClick={onConfirm}
            type="button"
          >
            Delete
          </button>
          <button
            className="h-9 rounded-md bg-slate-400 px-7 text-sm font-bold text-white shadow-md transition hover:bg-slate-500 hover:ring-2 hover:ring-slate-200"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
};

export default EmergencyDeleteConfirm;
