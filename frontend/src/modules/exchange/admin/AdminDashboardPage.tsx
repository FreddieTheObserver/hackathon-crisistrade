import { useEffect, useMemo, useState, type FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import {
  createExchangePoint,
  deleteExchangePoint,
  getExchangePoints,
  updateExchangePoint,
} from "../exchange.api";
import {
  type ExchangePoint,
  type ExchangePointFormValues,
  type ExchangePointPayload,
} from "../exchange.types";
import logoImage from "../logo.png";

const emptyFormValues: ExchangePointFormValues = {
  placeName: "",
  area: "",
  openTimeStart: "",
  openTimeStartMeridiem: "AM",
  openTimeEnd: "",
  openTimeEndMeridiem: "PM",
  notes: "",
  contactNotes: "",
};

const meridiemOptions = ["AM", "PM"] as const;

const timeInputValue = (value: string) => value.replace(/[^\d:]/g, "");

const parseOpenTime = (openTime: string): Pick<ExchangePointFormValues, "openTimeStart" | "openTimeStartMeridiem" | "openTimeEnd" | "openTimeEndMeridiem"> => {
  const rangeMatch = openTime.match(/^(.*?)\s*(AM|PM)\s*-\s*(.*?)\s*(AM|PM)$/i);

  if (!rangeMatch) {
    return {
      openTimeStart: "",
      openTimeStartMeridiem: "AM",
      openTimeEnd: "",
      openTimeEndMeridiem: "PM",
    };
  }

  return {
    openTimeStart: rangeMatch[1].trim(),
    openTimeStartMeridiem: rangeMatch[2].toUpperCase() as "AM" | "PM",
    openTimeEnd: rangeMatch[3].trim(),
    openTimeEndMeridiem: rangeMatch[4].toUpperCase() as "AM" | "PM",
  };
};

const toFormValues = (location: ExchangePoint): ExchangePointFormValues => ({
  placeName: location.placeName,
  area: location.area,
  ...parseOpenTime(location.openTime),
  notes: location.notes,
  contactNotes: location.contactNotes,
});

const toPayload = (formValues: ExchangePointFormValues): ExchangePointPayload => ({
  placeName: formValues.placeName.trim(),
  area: formValues.area.trim(),
  openTime: `${formValues.openTimeStart.trim()} ${formValues.openTimeStartMeridiem} - ${formValues.openTimeEnd.trim()} ${formValues.openTimeEndMeridiem}`,
  notes: formValues.notes.trim(),
  contactNotes: formValues.contactNotes.trim(),
});

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [locations, setLocations] = useState<ExchangePoint[]>([]);
  const [formValues, setFormValues] = useState<ExchangePointFormValues>(emptyFormValues);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [locationsToDelete, setLocationsToDelete] = useState<ExchangePoint[]>([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshLocations = async () => {
    setLoading(true);

    try {
      const exchangePoints = await getExchangePoints();
      setLocations(exchangePoints);
      setError(null);
    } catch {
      setError("Failed to load locations from the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void refreshLocations();
    }, 0);

    const handleRefresh = () => {
      void refreshLocations();
    };

    window.addEventListener("exchange-points-updated", handleRefresh);

    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener("exchange-points-updated", handleRefresh);
    };
  }, []);

  const filteredLocations = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return locations.filter((location) => {
      if (normalizedSearch.length === 0) {
        return true;
      }

      const haystack = [
        location.placeName,
        location.area,
        location.openTime,
        location.notes,
        location.contactNotes,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [locations, searchText]);

  const selectedLocations = useMemo(
    () => locations.filter((location) => selectedLocationIds.includes(location.id)),
    [locations, selectedLocationIds],
  );

  const filteredLocationIds = useMemo(
    () => filteredLocations.map((location) => location.id),
    [filteredLocations],
  );

  const allFilteredLocationsSelected =
    filteredLocationIds.length > 0 && filteredLocationIds.every((id) => selectedLocationIds.includes(id));

  const resetForm = () => {
    setEditingId(null);
    setFormValues(emptyFormValues);
  };

  const toggleCreateForm = () => {
    if (isFormVisible && !editingId) {
      closeForm();
      return;
    }

    resetForm();
    setIsFormVisible(true);
  };

  const closeForm = () => {
    resetForm();
    setIsFormVisible(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = toPayload(formValues);

      if (editingId) {
        await updateExchangePoint(editingId, payload);
      } else {
        await createExchangePoint(payload);
      }

      closeForm();
      window.dispatchEvent(new Event("exchange-points-updated"));
    } catch {
      setError(editingId ? "Could not update that location." : "Could not create that location.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (location: ExchangePoint) => {
    setEditingId(location.id);
    setFormValues(toFormValues(location));
    setIsFormVisible(true);
  };

  const toggleLocationSelection = (locationId: string) => {
    setSelectedLocationIds((currentIds) =>
      currentIds.includes(locationId)
        ? currentIds.filter((id) => id !== locationId)
        : [...currentIds, locationId],
    );
  };

  const toggleFilteredLocationsSelection = () => {
    if (allFilteredLocationsSelected) {
      setSelectedLocationIds((currentIds) => currentIds.filter((id) => !filteredLocationIds.includes(id)));
      return;
    }

    setSelectedLocationIds((currentIds) => Array.from(new Set([...currentIds, ...filteredLocationIds])));
  };

  const handleDeleteRequest = (location: ExchangePoint) => {
    setLocationsToDelete([location]);
  };

  const handleBulkDeleteRequest = () => {
    if (selectedLocations.length === 0) {
      return;
    }

    setLocationsToDelete(selectedLocations);
  };

  const handleDeleteConfirm = async () => {
    if (locationsToDelete.length === 0) {
      return;
    }

    const deletingLocationIds = locationsToDelete.map((location) => location.id);
    setSaving(true);

    try {
      await Promise.all(deletingLocationIds.map((id) => deleteExchangePoint(id)));

      if (editingId && deletingLocationIds.includes(editingId)) {
        closeForm();
      }

      setSelectedLocationIds((currentIds) => currentIds.filter((id) => !deletingLocationIds.includes(id)));
      setLocationsToDelete([]);
      window.dispatchEvent(new Event("exchange-points-updated"));
    } catch {
      setError(locationsToDelete.length === 1 ? "Could not delete that location." : "Could not delete those locations.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    setError(null);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setError("Could not sign out. Please try again.");
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <aside className="flex w-64 flex-col gap-6 border-r border-slate-800 bg-slate-900 p-6 text-white">
        <NavLink to="/trades" className="flex items-center gap-3 rounded-md transition hover:text-emerald-300">
          <img src={logoImage} alt="Crisis Trade logo" className="h-10 w-10 rounded object-contain" />
          <div className="text-xl font-bold">Crisis Trade</div>
        </NavLink>
        <nav className="mt-6 flex flex-col gap-2">
          <NavLink
            to="/admin/overview"
            className={({ isActive }) =>
              `rounded px-3 py-2 font-semibold ${isActive ? "bg-emerald-600" : "bg-transparent"}`
            }
          >
            Overview
          </NavLink>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `rounded px-3 py-2 font-semibold ${isActive ? "bg-emerald-600" : "bg-transparent"}`
            }
          >
            Locations
          </NavLink>
        </nav>
        <div className="mt-auto">
          <NavLink
            to="/profile"
            className="flex items-center gap-3 rounded-md p-2 transition hover:bg-slate-800"
          >
            <div className="h-10 w-10 rounded-full bg-slate-200" />
            <div>
              <div className="font-bold">{user?.displayName ?? "Admin"}</div>
              <div className="text-sm text-emerald-300">
                {user?.role === "admin" ? "Administrator" : "User"}
              </div>
            </div>
          </NavLink>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={signingOut}
            className="mt-6 flex w-full justify-center rounded border border-slate-700 py-2 font-semibold transition hover:bg-slate-800"
          >
            {signingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <NavLink
              to="/exchange-points"
              className="inline-flex rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-400 hover:text-slate-900"
            >
              View Safe Locations
            </NavLink>
            <h1 className="text-2xl font-bold">Locations Management</h1>
            <p className="text-sm text-slate-500">Create, update, and manage safe exchange locations.</p>
          </div>
          <button
            type="button"
            onClick={toggleCreateForm}
            className="rounded-md border border-emerald-700 bg-emerald-600 px-4 py-2 text-white shadow-sm"
          >
            + Add New Location
          </button>
        </div>

        <section className={`mt-6 grid gap-6 ${isFormVisible ? "xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]" : ""}`}>
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm text-slate-500">Total Locations</div>
              <div className="mt-2 text-3xl font-bold">{locations.length}</div>
              <p className="mt-2 text-sm text-slate-500">All locations in system</p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search locations by name, area, or type..."
                className="w-full rounded-md border border-slate-300 bg-white p-3 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-600">
                  {selectedLocationIds.length > 0
                    ? `${selectedLocationIds.length} selected`
                    : "Select locations to delete more than one at once"}
                </p>
                <button
                  type="button"
                  onClick={handleBulkDeleteRequest}
                  disabled={selectedLocations.length === 0 || saving}
                  className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:border-red-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                >
                  Delete Selected
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0 text-left">
                  <thead className="text-sm text-slate-600">
                    <tr>
                      <th className="w-12 border-b border-slate-300 py-3">
                        <input
                          type="checkbox"
                          checked={allFilteredLocationsSelected}
                          onChange={toggleFilteredLocationsSelection}
                          disabled={filteredLocationIds.length === 0}
                          aria-label="Select all visible locations"
                          className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                        />
                      </th>
                      <th className="border-b border-slate-300 py-3">Location Name</th>
                      <th className="border-b border-slate-300 py-3">Area</th>
                      <th className="border-b border-slate-300 py-3">Added On</th>
                      <th className="border-b border-slate-300 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td className="py-6 text-sm text-slate-500" colSpan={5}>
                          Loading locations...
                        </td>
                      </tr>
                    ) : filteredLocations.length === 0 ? (
                      <tr>
                        <td className="py-6 text-sm text-slate-500" colSpan={5}>
                          No locations found.
                        </td>
                      </tr>
                    ) : (
                      filteredLocations.map((location) => (
                        <tr key={location.id} className="align-top">
                          <td className="border-b border-slate-200 py-4">
                            <input
                              type="checkbox"
                              checked={selectedLocationIds.includes(location.id)}
                              onChange={() => toggleLocationSelection(location.id)}
                              aria-label={`Select ${location.placeName}`}
                              className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                            />
                          </td>
                          <td className="border-b border-slate-200 py-4">
                            <div className="font-semibold">{location.placeName}</div>
                            <div className="text-sm text-slate-500">{location.openTime}</div>
                          </td>
                          <td className="border-b border-slate-200 py-4">{location.area}</td>
                          <td className="border-b border-slate-200 py-4">{location.createdAt ? new Date(location.createdAt).toLocaleDateString() : "-"}</td>
                          <td className="border-b border-slate-200 py-4">
                            <button
                              type="button"
                              onClick={() => handleEdit(location)}
                              className="mr-2 rounded-md border border-slate-400 bg-white px-2 py-1 text-sm shadow-sm hover:border-slate-500"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRequest(location)}
                              className="rounded-md border border-red-300 bg-white px-2 py-1 text-sm text-red-600 shadow-sm hover:border-red-500"
                              disabled={saving}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {isFormVisible && (
          <form id="location-form" onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">{editingId ? "Edit Location" : "Add New Location"}</h2>
                <p className="text-sm text-slate-500">Fill the form and save to update the live list.</p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Location Name
                <input
                  value={formValues.placeName}
                  onChange={(event) => setFormValues((current) => ({ ...current, placeName: event.target.value }))}
                  className="rounded-md border border-slate-300 bg-white p-3 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Area
                <input
                  value={formValues.area}
                  onChange={(event) => setFormValues((current) => ({ ...current, area: event.target.value }))}
                  className="rounded-md border border-slate-300 bg-white p-3 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Open Time
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_92px_minmax(0,1fr)_92px]">
                  <input
                    value={formValues.openTimeStart}
                    onChange={(event) =>
                      setFormValues((current) => ({ ...current, openTimeStart: timeInputValue(event.target.value) }))
                    }
                    inputMode="numeric"
                    placeholder="1:00"
                    className="rounded-md border border-slate-300 bg-white p-3 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    required
                  />
                  <select
                    value={formValues.openTimeStartMeridiem}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        openTimeStartMeridiem: event.target.value as "AM" | "PM",
                      }))
                    }
                    className="rounded-md border border-slate-300 bg-white p-3 font-semibold shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  >
                    {meridiemOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    value={formValues.openTimeEnd}
                    onChange={(event) =>
                      setFormValues((current) => ({ ...current, openTimeEnd: timeInputValue(event.target.value) }))
                    }
                    inputMode="numeric"
                    placeholder="2:00"
                    className="rounded-md border border-slate-300 bg-white p-3 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    required
                  />
                  <select
                    value={formValues.openTimeEndMeridiem}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        openTimeEndMeridiem: event.target.value as "AM" | "PM",
                      }))
                    }
                    className="rounded-md border border-slate-300 bg-white p-3 font-semibold shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  >
                    {meridiemOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-xs font-medium text-slate-500">Example: 1:00 AM to 2:00 AM</span>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Notes
                <textarea
                  value={formValues.notes}
                  onChange={(event) => setFormValues((current) => ({ ...current, notes: event.target.value }))}
                  className="min-h-24 rounded-md border border-slate-300 bg-white p-3 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Contact Notes
                <textarea
                  value={formValues.contactNotes}
                  onChange={(event) => setFormValues((current) => ({ ...current, contactNotes: event.target.value }))}
                  className="min-h-24 rounded-md border border-slate-300 bg-white p-3 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  required
                />
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md border border-emerald-700 bg-emerald-600 px-4 py-2 font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-emerald-400"
              >
                {saving ? "Saving..." : editingId ? "Update Location" : "Create Location"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-700 shadow-sm"
              >
                Clear
              </button>
            </div>
          </form>
          )}
        </section>

        {locationsToDelete.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-location-title"
              className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600">
                  !
                </div>
                <div>
                  <h2 id="delete-location-title" className="text-xl font-bold">
                    {locationsToDelete.length === 1 ? "Delete location?" : "Delete selected locations?"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {locationsToDelete.length === 1 ? (
                      <>
                        This will permanently remove <span className="font-semibold text-slate-900">{locationsToDelete[0].placeName}</span> from the safe locations list.
                      </>
                    ) : (
                      <>
                        This will permanently remove <span className="font-semibold text-slate-900">{locationsToDelete.length} locations</span> from the safe locations list.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setLocationsToDelete([])}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm hover:border-slate-400"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleDeleteConfirm()}
                  className="rounded-md border border-red-700 bg-red-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                  disabled={saving}
                >
                  {saving ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
