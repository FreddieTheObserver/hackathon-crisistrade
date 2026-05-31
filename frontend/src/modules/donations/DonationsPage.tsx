import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import {
  createDonation,
  deleteDonation,
  getDonations,
  updateDonation,
} from "./donationsApi";
import { DonationCard } from "./components/DonationCard";
import { DonationFilters } from "./components/DonationFilters";
import { DonationForm } from "./components/DonationForm";
import { LoadingState, EmptyState, ErrorState } from "../../components/StateViews";
import { useAuth } from "../../auth/AuthContext";
import type {
  Donation,
  DonationFormValues,
  DonationStatus,
} from "./donationsTypes";

type DonationFormErrors = Partial<Record<keyof DonationFormValues, string>>;

// Turn an unknown thrown value into a message that names the real cause:
// server unreachable vs. expired session vs. a validation/ownership error from
// the API, falling back to a generic message for anything unexpected.
function donationErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Can't reach the server. Make sure the backend is running and try again.";
    }

    const { status } = error.response;
    if (status === 401) {
      return "Your session has expired. Please log in again.";
    }

    const data = error.response.data as
      | { message?: string; issues?: { message?: string }[] }
      | undefined;
    if (data?.issues?.[0]?.message) {
      return data.issues[0].message;
    }
    if (data?.message) {
      return data.message;
    }
    if (status === 403) {
      return "You can only change your own donations.";
    }
  }

  return fallback;
}

const emptyForm: DonationFormValues = {
  title: "",
  item: "",
  quantity: "",
  category: "",
  location: "",
  availableAt: "",
  photoFile: null,
  note: "",
  contact: "",
};

const categories = ["Food", "Water", "Medicine", "Shelter", "Tools", "Other"];

// required messages in one place
const requiredFieldMessages: DonationFormErrors = {
  title: "Title is required",
  item: "Offer item is required",
  quantity: "Quantity is required",
  category: "Category is required",
  location: "Location is required",
  availableAt: "Available time is required",
  contact: "Contact is required",
};

export function DonationsPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [formValues, setFormValues] = useState<DonationFormValues>(emptyForm);
  const [formErrors, setFormErrors] = useState<DonationFormErrors>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // reload after changes
  async function loadDonations() {
    setIsLoading(true);
    setError("");

    try {
      const data = await getDonations();
      setDonations(data);
    } catch (error) {
      setError(donationErrorMessage(error, "Could not load donations."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadDonations();
  }, []);

  const locations = useMemo(() => {
    const locationMap = new Map<string, string>();

    // avoid duplicate locations like Bangkok and bangkok
    donations.forEach((donation) => {
        const normalizedLocation = donation.location.trim().toLowerCase();

        if (!locationMap.has(normalizedLocation)) {
        locationMap.set(normalizedLocation, donation.location.trim());
        }
    });

    return Array.from(locationMap.values());
  }, [donations]);

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      // search the main card text
      const searchableText = [
        donation.title,
        donation.item,
        donation.quantity,
        donation.category,
        donation.location,
        donation.note ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(search.toLowerCase());
      const matchesLocation =
        locationFilter === "ALL" ||
        donation.location.trim().toLowerCase() === locationFilter.toLowerCase();
      const matchesCategory =
        categoryFilter === "ALL" || donation.category === categoryFilter;
      const matchesStatus =
        statusFilter === "ALL" || donation.status === statusFilter;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [donations, search, locationFilter, categoryFilter, statusFilter]);

  function updateFormField(field: keyof DonationFormValues, value: string) {
    setFormValues((current) => ({
        ...current,
        [field]: value,
    }));

    setFormErrors((current) => ({
        ...current,
        [field]: "",
    }));
  }

  function updatePhotoFile(file: File | null) {
    setFormValues((current) => ({
        ...current,
        photoFile: file,
    }));
  }

  function resetForm() {
    setFormValues(emptyForm);
    setFormErrors({});
    setEditingId(null);
    setIsFormOpen(false);
  }

  function getProfilePrefilledForm(): DonationFormValues {
    return {
      ...emptyForm,
      contact: user?.phone || user?.email || "",
      location: user?.location ?? "",
    };
  }

  function startEdit(donation: Donation) {
    // open the same form with this post loaded
    setEditingId(donation.id);
    setIsFormOpen(true);
    setFormValues({
      title: donation.title,
      item: donation.item,
      quantity: donation.quantity,
      category: donation.category,
      location: donation.location,
      availableAt: donation.availableAt,
      photoFile: null,
      note: donation.note ?? "",
      contact: donation.contact,
    });
  }

  function validateForm() {
    const nextErrors: DonationFormErrors = {};

    // show errors under each field
    Object.entries(requiredFieldMessages).forEach(([field, message]) => {
      const formField = field as keyof DonationFormValues;
      const value = formValues[formField];

      if (typeof value === "string" && !value.trim()) {
        nextErrors[formField] = message;
      }
    });

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setError("");

  if (!validateForm()) {
    return;
  }

  try {
    // editingId means save changes instead of post new
    if (editingId) {
      await updateDonation(editingId, formValues);
    } else {
      await createDonation(formValues);
    }

    resetForm();
    await loadDonations();
  } catch (error) {
    setError(donationErrorMessage(error, "Could not save donation."));
  }
}

  async function handleDelete(id: number) {
    setError("");

    try {
      await deleteDonation(id);
      await loadDonations();
    } catch (error) {
      setError(donationErrorMessage(error, "Could not delete donation."));
    }
  }

  async function handleStatusChange(id: number, status: DonationStatus) {
    setError("");

    try {
      await updateDonation(id, { status });
      await loadDonations();
    } catch (error) {
      setError(donationErrorMessage(error, "Could not update status."));
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded border border-rose-100 bg-white text-rose-600">
              <Heart className="h-7 w-7" fill="currentColor" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Donations</h1>
              <p className="mt-1 text-sm text-slate-600">
                Give freely. Support your community in times of need.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsFormOpen(true);
              setEditingId(null);
              setFormValues(getProfilePrefilledForm());
              setFormErrors({});
            }}
            className="rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            + Add Donation
          </button>
        </div>

        <DonationFilters
          search={search}
          locationFilter={locationFilter}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          locations={locations}
          categories={categories}
          onSearchChange={setSearch}
          onLocationFilterChange={setLocationFilter}
          onCategoryFilterChange={setCategoryFilter}
          onStatusFilterChange={setStatusFilter}
          onClearFilters={() => {
            setSearch("");
            setLocationFilter("ALL");
            setCategoryFilter("ALL");
            setStatusFilter("ALL");
          }}
        />

        {isFormOpen ? (
          <DonationForm
            formValues={formValues}
            formErrors={formErrors}
            isEditing={Boolean(editingId)}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            onFieldChange={updateFormField}
            onPhotoFileChange={updatePhotoFile}
          />
        ) : null}

        {error ? (
          <div className="mb-4">
            <ErrorState message={error} />
          </div>
        ) : null}

        {isLoading ? (
          <LoadingState label="Loading donations…" />
        ) : filteredDonations.length === 0 ? (
          <EmptyState title="No donations found." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredDonations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onEdit={startEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
