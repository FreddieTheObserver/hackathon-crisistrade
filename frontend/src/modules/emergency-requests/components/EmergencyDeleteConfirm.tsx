type EmergencyDeleteConfirmProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

const EmergencyDeleteConfirm = ({ onCancel, onConfirm }: EmergencyDeleteConfirmProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <section
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900">Delete this emergency request?</h2>
        <p className="mt-2 text-sm text-gray-600">
          This action can't be undone. The emergency request will be permanently removed.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            onClick={onConfirm}
            type="button"
          >
            Delete
          </button>
        </div>
      </section>
    </div>
  );
};

export default EmergencyDeleteConfirm;
