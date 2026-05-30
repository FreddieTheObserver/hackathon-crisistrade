import { useState } from 'react';

interface CompleteTradeDialogProps {
      open: boolean;
      submitting: boolean;
      error: string | null;
      onCancel: () => void;
      onConfirm: (counterparty: string) => void;
}

export function CompleteTradeDialog({
      open,
      submitting,
      error,
      onCancel,
      onConfirm,
}: CompleteTradeDialogProps) {
      const [name, setName] = useState("");
      const [touched, setTouched] = useState(false);

      if (!open) return null;

      const trimmed = name.trim();
      
      function handleConfirm() {
            setTouched(true);
            if (!trimmed) return;
            onConfirm(trimmed);
      }
      return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onCancel}
            >
                  <div
                        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                        >
                              <h2 className="text-lg font-semibold text-gray-900">Complete this trade</h2>
                              <p className="mt-2 text-sm text-gray-600">
                                    Who did you trade with? Both of you earn a reputation point.
                              </p>

                              <label className="mt-4 block text-sm font-medium text-gray-700">
                                    Counterparty name 
                                    <input
                                          type="text"
                                          value={name}
                                          autoFocus
                                          onChange={(e) => setName(e.target.value)}
                                          placeholder="e.g. Mira Petel"
                                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                    />
                              </label>

                              {touched && !trimmed && (
                                    <p className="mt-1 text-xs text-red-600">A counterparty name is required.</p>
                              )}
                              {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

                              <div className="mt-6 flex justify-end gap-3">
                                    <button
                                          type="button"
                                          onClick={onCancel}
                                          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                          >
                                                Cancel
                                    </button>
                                    <button
                                          type="button"
                                          onClick={handleConfirm}
                                          disabled={submitting}
                                          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                          {submitting ? "Saving..." : "Complete Trade"}
                              </button>
                        </div>
                  </div>
            </div>
      )
}