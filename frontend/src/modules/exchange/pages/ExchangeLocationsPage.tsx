import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { getExchangePoints } from "../exchange.api";
import { demoExchangePoints } from "../exchange.demo-data";
import type { ExchangePoint } from "../exchange.types";
import { ClockIcon, LocationIcon, SearchIcon, TargetIcon } from "../components/ExchangeLocationIcons";

const allAreasOption = "All Areas";

const locationIcons: Record<string, "station" | "cart" | "office" | "park" | "mall"> = {
  "location-1": "station",
  "location-2": "cart",
  "location-3": "office",
  "location-4": "park",
  "location-5": "mall",
};

const ExchangeLocationsPage = () => {
  const [allLocations, setAllLocations] = useState<ExchangePoint[]>(demoExchangePoints);
  const [searchText, setSearchText] = useState("");
  const [selectedArea, setSelectedArea] = useState(allAreasOption);
  const [selectedLocation, setSelectedLocation] = useState<ExchangePoint | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const exchangePoints = await getExchangePoints();
        setAllLocations(exchangePoints);
        setError(null);
      } catch {
        setAllLocations(demoExchangePoints);
        setError("Showing sample data until the backend is available.");
      }
    };

    void loadLocations();

    const refresh = () => {
      void loadLocations();
    };

    window.addEventListener("exchange-points-updated", refresh);

    return () => {
      window.removeEventListener("exchange-points-updated", refresh);
    };
  }, []);

  const filteredLocations = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return allLocations.filter((location) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        location.placeName.toLowerCase().includes(normalizedSearch) ||
        location.area.toLowerCase().includes(normalizedSearch);

      const matchesArea = selectedArea === allAreasOption || location.area === selectedArea;

      return matchesSearch && matchesArea;
    });
  }, [allLocations, searchText, selectedArea]);

  const areaOptions = useMemo(() => {
    const uniqueAreas = Array.from(
      new Set(
        allLocations
          .map((location) => location.area.trim())
          .filter(Boolean),
      ),
    ).sort((firstArea, secondArea) => firstArea.localeCompare(secondArea));

    return [allAreasOption, ...uniqueAreas];
  }, [allLocations]);

  useEffect(() => {
    if (!areaOptions.includes(selectedArea)) {
      setSelectedArea(allAreasOption);
    }
  }, [areaOptions, selectedArea]);

  const openLocationDetails = (location: ExchangePoint) => {
    setSelectedLocation(location);
  };

  const handleLocationKeyDown = (event: KeyboardEvent<HTMLElement>, location: ExchangePoint) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLocationDetails(location);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main id="locations" className="mx-auto max-w-6xl px-6 py-6">
        <section className="mb-10">
          {error && (
            <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {error}
            </div>
          )}

          <div className="mb-10 flex items-center gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-white">
              <TargetIcon />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-normal text-slate-950">Safe Exchange Locations</h1>
              <p className="mt-1 text-base font-medium text-slate-500">
                Find trusted public places to meet safely in your community.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <label className="relative block w-full max-w-105">
              <span className="absolute left-5 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </span>
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search locations by place name or area..."
                className="h-12 w-full rounded-md border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="relative block w-full max-w-45">
              <span className="absolute left-5 top-1/2 -translate-y-1/2">
                <TargetIcon />
              </span>
              <select
                value={selectedArea}
                onChange={(event) => setSelectedArea(event.target.value)}
                className="h-12 w-full appearance-none rounded-md border border-slate-200 bg-white pl-11 pr-9 text-sm font-semibold text-slate-600 shadow-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              >
                {areaOptions.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-600">
                v
              </span>
            </label>
          </div>
        </section>

        <section className="space-y-6" aria-label="Safe exchange location list">
          {filteredLocations.map((location) => (
            <article
              key={location.id}
              role="button"
              tabIndex={0}
              onClick={() => openLocationDetails(location)}
              onKeyDown={(event) => handleLocationKeyDown(event, location)}
              className="grid cursor-pointer grid-cols-1 items-center gap-6 rounded-xl border border-slate-300 bg-white p-6 shadow-sm transition hover:border-slate-400 hover:shadow-md focus:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100 md:grid-cols-[96px_minmax(260px,1fr)_minmax(170px,220px)_minmax(180px,240px)_80px]"
            >
              <LocationIcon icon={locationIcons[location.id] ?? "station"} />

              <div className="min-w-0">
                <h2 className="text-xl font-bold tracking-normal text-slate-950">{location.placeName}</h2>
                <p className="mt-6 text-base font-semibold text-slate-600 md:mt-7">{location.area}</p>
              </div>

              <div className="border-t border-slate-200 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                <p className="text-sm font-bold text-emerald-600">Open Time</p>
                <div className="mt-3 flex gap-3 text-base font-medium leading-7 text-slate-700">
                  <ClockIcon />
                  <div>
                    <p>{location.openTime}</p>
                    <p>{location.contactNotes}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                <p className="text-sm font-bold text-emerald-600">Notes</p>
                <p className="mt-4 max-w-52.5 text-base font-medium leading-tight text-slate-700">{location.notes}</p>
              </div>

              <div className="flex md:justify-end">
                <span className="inline-flex min-w-16 justify-center rounded-md bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                  Safe
                </span>
              </div>
            </article>
          ))}

          {filteredLocations.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
              <p className="text-lg font-bold text-slate-900">No matching locations found.</p>
              <p className="mt-2 text-sm font-medium text-slate-500">Try a different place name or area.</p>
            </div>
          )}
        </section>
      </main>

      {selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-detail-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-4">
                <LocationIcon icon={locationIcons[selectedLocation.id] ?? "station"} />
                <div className="min-w-0">
                  <h2 id="location-detail-title" className="text-2xl font-bold text-slate-950">
                    {selectedLocation.placeName}
                  </h2>
                  <p className="mt-2 text-base font-semibold text-slate-600">{selectedLocation.area}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLocation(null)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:border-slate-400 hover:text-slate-900"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <section className="rounded-lg border border-slate-300 bg-slate-50 p-4 shadow-sm">
                <h3 className="text-sm font-bold text-emerald-600">Open Time</h3>
                <p className="mt-2 text-base font-semibold text-slate-800">{selectedLocation.openTime}</p>
              </section>

              <section className="rounded-lg border border-slate-300 bg-slate-50 p-4 shadow-sm">
                <h3 className="text-sm font-bold text-emerald-600">Contact Notes</h3>
                <p className="mt-2 whitespace-pre-wrap text-base font-medium leading-7 text-slate-700">
                  {selectedLocation.contactNotes || "No contact notes provided."}
                </p>
              </section>

              <section className="rounded-lg border border-slate-300 bg-slate-50 p-4 shadow-sm md:col-span-2">
                <h3 className="text-sm font-bold text-emerald-600">Notes</h3>
                <p className="mt-2 whitespace-pre-wrap text-base font-medium leading-7 text-slate-700">
                  {selectedLocation.notes || "No notes provided."}
                </p>
              </section>

              {selectedLocation.createdAt && (
                <section className="rounded-lg border border-slate-300 bg-slate-50 p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-emerald-600">Added On</h3>
                  <p className="mt-2 text-base font-semibold text-slate-800">
                    {new Date(selectedLocation.createdAt).toLocaleDateString()}
                  </p>
                </section>
              )}

              {selectedLocation.updatedAt && (
                <section className="rounded-lg border border-slate-300 bg-slate-50 p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-emerald-600">Last Updated</h3>
                  <p className="mt-2 text-base font-semibold text-slate-800">
                    {new Date(selectedLocation.updatedAt).toLocaleDateString()}
                  </p>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExchangeLocationsPage;
