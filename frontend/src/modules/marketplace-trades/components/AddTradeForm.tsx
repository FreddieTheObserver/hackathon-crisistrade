import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  ITEM_TYPES,
  URGENCIES,
  tradeFormSchema,
} from "../schemas/marketplace-trades.schemas";
import type { Trade, TradeFormValues } from "../types/marketplace-trades.types";

const EMPTY_VALUES: TradeFormValues = {
  title: "",
  ownerName: "",
  offering: "",
  wanting: "",
  itemType: "water",
  urgency: "low",
  area: "",
  contact: "",
  note: "",
};

interface AddTradeFormProps {
  open: boolean;
  editingTrade: Trade | null;
  submitting: boolean;
  error: string | null;
  initialArea?: string;
  initialContact?: string;
  initialOwnerName?: string;
  onCancel: () => void;
  onSubmit: (formData: FormData) => void;
}

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-400";

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const NOTE_MAX = 500;

export function AddTradeForm({
  open,
  editingTrade,
  submitting,
  error,
  initialArea = "",
  initialContact = "",
  initialOwnerName = "",
  onCancel,
  onSubmit,
}: AddTradeFormProps) {
  const [values, setValues] = useState<TradeFormValues>(EMPTY_VALUES);
  const [photo, setPhoto] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Reset the form whenever it opens, or when switching between create and a
  // specific trade being edited (pre-fill from that trade).
  useEffect(() => {
    if (editingTrade) {
      setValues({
        title: editingTrade.title,
        ownerName: editingTrade.ownerName,
        offering: editingTrade.offering,
        wanting: editingTrade.wanting,
        itemType: editingTrade.itemType,
        urgency: editingTrade.urgency,
        area: editingTrade.area,
        contact: editingTrade.contact,
        note: editingTrade.note ?? "",
      });
    } else {
      setValues({
        ...EMPTY_VALUES,
        area: initialArea,
        contact: initialContact,
        ownerName: initialOwnerName,
      });
    }
    setPhoto(null);
    setFieldErrors({});
  }, [editingTrade, initialArea, initialContact, initialOwnerName, open]);

  if (!open) return null;

  function set<K extends keyof TradeFormValues>(key: K, value: TradeFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    // Clear the field-level error as soon as the user edits it, so stale
    // validation messages don't linger while they're fixing the input.
    setFieldErrors((errs) => {
      if (!errs[key as string]) return errs;
      const next = { ...errs };
      delete next[key as string];
      return next;
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const parsed = tradeFormSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    const formData = new FormData();
    for (const [key, val] of Object.entries(parsed.data)) {
      if (val !== undefined && val !== "") formData.append(key, String(val));
    }
    if (photo) formData.append("photo", photo);

    onSubmit(formData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-200 bg-white p-4"
    >
      <h2 className="text-lg font-semibold text-gray-900">
        {editingTrade ? "Edit Trade" : "Add a New Trade"}
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Title" error={fieldErrors.title} required>
          <input
            type="text"
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Trading rice for blankets"
            maxLength={120}
            autoFocus
            aria-invalid={Boolean(fieldErrors.title)}
            className={inputClass}
          />
        </Field>

        <Field label="Your name" error={fieldErrors.ownerName} required>
          <input
            type="text"
            value={values.ownerName}
            onChange={(e) => set("ownerName", e.target.value)}
            placeholder="e.g. Aung Aung"
            maxLength={80}
            aria-invalid={Boolean(fieldErrors.ownerName)}
            className={inputClass}
          />
        </Field>

        <Field label="Contact" error={fieldErrors.contact} required>
          <input
            type="text"
            value={values.contact}
            onChange={(e) => set("contact", e.target.value)}
            placeholder="e.g. 09xxxxxxxxx or @telegram"
            maxLength={60}
            aria-invalid={Boolean(fieldErrors.contact)}
            className={inputClass}
          />
        </Field>

        <Field label="Offering (+ qty)" error={fieldErrors.offering} required>
          <input
            type="text"
            value={values.offering}
            onChange={(e) => set("offering", e.target.value)}
            placeholder="e.g. Rice (20 kg)"
            maxLength={200}
            aria-invalid={Boolean(fieldErrors.offering)}
            className={inputClass}
          />
        </Field>

        <Field label="Wanting (+ qty)" error={fieldErrors.wanting} required>
          <input
            type="text"
            value={values.wanting}
            onChange={(e) => set("wanting", e.target.value)}
            placeholder="e.g. Blankets (5)"
            maxLength={200}
            aria-invalid={Boolean(fieldErrors.wanting)}
            className={inputClass}
          />
        </Field>

        <Field label="Location" error={fieldErrors.area} required>
          <input
            type="text"
            value={values.area}
            onChange={(e) => set("area", e.target.value)}
            placeholder="e.g. Yangon, Hlaing Township"
            maxLength={120}
            aria-invalid={Boolean(fieldErrors.area)}
            className={inputClass}
          />
        </Field>

        <Field label="Category" error={fieldErrors.itemType} required>
          <select
            value={values.itemType}
            onChange={(e) => set("itemType", e.target.value as TradeFormValues["itemType"])}
            className={inputClass}
          >
            {ITEM_TYPES.map((t) => (
              <option key={t} value={t}>
                {titleCase(t)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Urgency" error={fieldErrors.urgency} required>
          <select
            value={values.urgency}
            onChange={(e) => set("urgency", e.target.value as TradeFormValues["urgency"])}
            className={inputClass}
          >
            {URGENCIES.map((u) => (
              <option key={u} value={u}>
                {titleCase(u)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Photo (optional)">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-green-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-green-700 hover:file:bg-green-100"
          />
          <span className="mt-1 block text-xs text-gray-500">
            {photo ? `Selected: ${photo.name}` : "PNG or JPG, up to ~2 MB."}
          </span>
        </Field>

        <div className="sm:col-span-2 lg:col-span-3">
          <Field label="Note (optional)" error={fieldErrors.note}>
            <textarea
              value={values.note ?? ""}
              onChange={(e) => set("note", e.target.value)}
              rows={2}
              maxLength={NOTE_MAX}
              placeholder="Any extra details: pickup times, condition, preferred swaps…"
              aria-invalid={Boolean(fieldErrors.note)}
              className={inputClass}
            />
            <span className="mt-1 block text-right text-xs text-gray-400">
              {(values.note ?? "").length}/{NOTE_MAX}
            </span>
          </Field>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? "Saving…" : editingTrade ? "Save Changes" : "Post Trade"}
        </button>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

function Field({ label, error, required, children }: FieldProps) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      <span>
        {label}
        {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
      </span>
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
