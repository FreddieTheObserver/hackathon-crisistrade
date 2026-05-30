import type { FormEvent } from "react";
import { Upload } from "lucide-react";
import type { DonationFormValues } from "../donationsTypes";

type DonationFormProps = {
  formValues: DonationFormValues;
  formErrors: Partial<Record<keyof DonationFormValues, string>>;
  isEditing: boolean;
  categories: string[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onFieldChange: (field: keyof DonationFormValues, value: string) => void;
  onPhotoFileChange: (file: File | null) => void;
};

export function DonationForm({
  formValues,
  formErrors,
  isEditing,
  categories,
  onSubmit,
  onCancel,
  onFieldChange,
  onPhotoFileChange,
}: DonationFormProps) {
  return (
    // form values come from DonationsPage
    <form
      onSubmit={onSubmit}
      className="mb-5 rounded border border-emerald-100 bg-white p-4 shadow-sm"
    >
      <div className="mb-3">
        <h2 className="font-semibold">
          {isEditing ? "Edit Donation" : "Add a New Donation"}
        </h2>
        <p className="text-sm text-slate-500">
          Fill in the details below to post your free donation.
        </p>
      </div>

      {/* donation fields */}
      <div className="grid gap-3 lg:grid-cols-4">
        <div>
          <input
            value={formValues.title}
            onChange={(event) => onFieldChange("title", event.target.value)}
            placeholder="Title"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          />
          {formErrors.title ? (
            <p className="mt-1 text-xs text-red-600">{formErrors.title}</p>
          ) : null}
        </div>

        <div>
          <input
            value={formValues.item}
            onChange={(event) => onFieldChange("item", event.target.value)}
            placeholder="Offer item"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          />
          {formErrors.item ? (
            <p className="mt-1 text-xs text-red-600">{formErrors.item}</p>
          ) : null}
        </div>

        <div>
          <input
            value={formValues.quantity}
            onChange={(event) => onFieldChange("quantity", event.target.value)}
            placeholder="Quantity"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          />
          {formErrors.quantity ? (
            <p className="mt-1 text-xs text-red-600">{formErrors.quantity}</p>
          ) : null}
        </div>

        <div>
          <select
            value={formValues.category}
            onChange={(event) => onFieldChange("category", event.target.value)}
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {formErrors.category ? (
            <p className="mt-1 text-xs text-red-600">{formErrors.category}</p>
          ) : null}
        </div>

        <div>
          <input
            value={formValues.location}
            onChange={(event) => onFieldChange("location", event.target.value)}
            placeholder="Location"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          />
          {formErrors.location ? (
            <p className="mt-1 text-xs text-red-600">{formErrors.location}</p>
          ) : null}
        </div>

        <div>
          <input
            value={formValues.availableAt}
            onChange={(event) =>
              onFieldChange("availableAt", event.target.value)
            }
            placeholder="Available time"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          />
          {formErrors.availableAt ? (
            <p className="mt-1 text-xs text-red-600">
              {formErrors.availableAt}
            </p>
          ) : null}
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50">
          <Upload className="h-5 w-5 text-slate-700" />
          <span>{formValues.photoFile ? formValues.photoFile.name : "Upload"}</span>

          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              onPhotoFileChange(event.target.files?.[0] ?? null)
            }
            className="hidden"
          />
        </label>

        <div>
          <input
            value={formValues.contact}
            onChange={(event) => onFieldChange("contact", event.target.value)}
            placeholder="Contact"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          />
          {formErrors.contact ? (
            <p className="mt-1 text-xs text-red-600">{formErrors.contact}</p>
          ) : null}
        </div>

        <input
          value={formValues.note}
          onChange={(event) => onFieldChange("note", event.target.value)}
          placeholder="Note"
          className="lg:col-span-3 rounded border border-slate-200 px-3 py-2 text-sm"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded border border-slate-200 px-3 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            {isEditing ? "Save" : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
