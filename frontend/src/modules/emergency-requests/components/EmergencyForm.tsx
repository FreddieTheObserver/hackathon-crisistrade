import { useState } from "react";

import EmergencyActionButton from "./EmergencyActionButton";
import EmergencyFilterSelect from "./EmergencyFilterSelect";
import EmergencyFormInput from "./EmergencyFormInput";
import EmergencyIcon from "./EmergencyIcon";
import EmergencyUploadButton from "./EmergencyUploadButton";
import EmergencyUploadModal from "./EmergencyUploadModal";
import plusLogo from "../assets/PlusLogo.svg";
import type { EmergencyFormPayload, EmergencyPost, EmergencyUrgency } from "../types/emergency.type";

type EmergencyFormProps = {
  editingPost?: EmergencyPost | null;
  onClose: () => void;
  onSubmit: (payload: EmergencyFormPayload) => Promise<void>;
};

type EmergencyFormValues = {
  contact: string;
  location: string;
  need: string;
  note: string;
  photoUrl?: string;
  title: string;
  urgency: EmergencyUrgency | "";
};

const fieldMaxLengths = {
  contact: 16,
  location: 24,
  need: 45,
  note: 50,
  title: 24,
};

const initialFormValues: EmergencyFormValues = {
  contact: "",
  location: "",
  need: "",
  note: "",
  photoUrl: undefined,
  title: "",
  urgency: "",
};

const getInitialValues = (post?: EmergencyPost | null): EmergencyFormValues => {
  if (!post) {
    return initialFormValues;
  }

  return {
    contact: post.contact,
    location: post.location,
    need: post.need,
    note: post.note,
    photoUrl: post.photoUrl,
    title: post.title,
    urgency: post.urgency,
  };
};

const EmergencyForm = ({ editingPost, onClose, onSubmit }: EmergencyFormProps) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [values, setValues] = useState<EmergencyFormValues>(() => getInitialValues(editingPost));
  const [showRequiredErrors, setShowRequiredErrors] = useState(false);

  const updateValue = (name: string, value: string) => {
    const maxLength = fieldMaxLengths[name as keyof typeof fieldMaxLengths];
    const nextValue = name === "photoUrl" || !maxLength ? value : value.slice(0, maxLength);

    setValues((current) => ({ ...current, [name]: nextValue }));
  };

  const removePhoto = () => {
    setValues((current) => ({ ...current, photoUrl: undefined }));
  };

  const submitEmergency = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hasMissingRequiredField =
      !values.title.trim() ||
      !values.need.trim() ||
      !values.location.trim() ||
      !values.urgency ||
      !values.contact.trim();

    if (hasMissingRequiredField) {
      setShowRequiredErrors(true);
      return;
    }

    await onSubmit({
      contact: values.contact,
      isOwner: true,
      location: values.location,
      need: values.need,
      note: values.note,
      photoUrl: values.photoUrl,
      title: values.title,
      urgency: values.urgency as EmergencyUrgency,
    });
    setValues(initialFormValues);
  };

  const getRequiredError = (fieldName: keyof EmergencyFormValues, label: string) => {
    if (!showRequiredErrors) {
      return undefined;
    }

    return values[fieldName]?.trim() ? undefined : `${label} is required.`;
  };

  return (
    <section className="rounded-lg border border-red-400 bg-red-50/50 px-6 py-5 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-2xl font-medium text-white">
            <EmergencyIcon className="h-4 w-4" src={plusLogo} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-500">
              {editingPost ? "Edit your emergency" : "Add a new emergency"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fill in the details below to post your Emergency need.
            </p>
          </div>
        </div>

      </div>

      <form className="mt-8" onSubmit={submitEmergency}>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.05fr)_minmax(0,0.6fr)_minmax(0,0.9fr)_minmax(0,0.8fr)]">
          <EmergencyFormInput
            label="Title"
            maxLength={fieldMaxLengths.title}
            name="title"
            onChange={updateValue}
            placeholder="e.g., Rice for Families"
            required
            error={getRequiredError("title", "Title")}
            value={values.title}
          />
          <EmergencyFormInput
            label={
              <span className="inline-flex items-center gap-1.5">
                Need
                <EmergencyIcon className="h-2.5 w-2.5" src={plusLogo} />
                Qty
              </span>
            }
            maxLength={fieldMaxLengths.need}
            name="need"
            onChange={updateValue}
            placeholder="e.g., Rice (20 kg)"
            required
            error={getRequiredError("need", "Need + Qty")}
            value={values.need}
          />
          <EmergencyFormInput
            label="Location"
            maxLength={fieldMaxLengths.location}
            name="location"
            onChange={updateValue}
            placeholder="e.g., Kathmandu"
            required
            error={getRequiredError("location", "Location")}
            value={values.location}
          />
          <div>
            <EmergencyFilterSelect
              label="Urgency level"
              onChange={(value) => updateValue("urgency", value)}
              options={["Urgent", "Medium", "Low"]}
              value={values.urgency || "select level"}
              required
            />
            {showRequiredErrors && !values.urgency && (
              <p className="mt-2 text-xs font-medium text-red-500">Urgency level is required.</p>
            )}
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-emerald-900">Photo</span>
            <EmergencyUploadButton
              onClick={() => setIsUploadOpen(true)}
              onRemove={removePhoto}
              previewUrl={values.photoUrl}
            />
          </label>
          <EmergencyFormInput
            label="Note"
            maxLength={fieldMaxLengths.note}
            name="note"
            onChange={updateValue}
            placeholder="Add a short note..."
            value={values.note}
          />
          <EmergencyFormInput
            label="Contact"
            maxLength={fieldMaxLengths.contact}
            name="contact"
            onChange={updateValue}
            placeholder="e.g., 9801234567"
            required
            error={getRequiredError("contact", "Contact")}
            value={values.contact}
          />
        </div>

        <div className="mt-8 flex justify-end gap-5">
          <button
            className="h-12 rounded-md border border-slate-300 bg-white px-8 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-red-300 hover:ring-2 hover:ring-red-100"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <EmergencyActionButton label="Post Emergency" type="submit" />
        </div>
      </form>
      {isUploadOpen && (
        <EmergencyUploadModal
          onClose={() => setIsUploadOpen(false)}
          onUpload={(photoUrl) => updateValue("photoUrl", photoUrl)}
        />
      )}
    </section>
  );
};

export default EmergencyForm;
