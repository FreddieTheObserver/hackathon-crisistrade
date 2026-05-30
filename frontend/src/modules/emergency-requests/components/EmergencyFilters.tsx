import EmergencyClearFiltersButton from "./EmergencyClearFiltersButton";
import EmergencyFilterSelect from "./EmergencyFilterSelect";
import EmergencySearchInput from "./EmergencySearchInput";
import type { EmergencyStatus, EmergencyUrgency } from "../types/emergency.type";

export type EmergencyFilterValues = {
  location: string;
  search: string;
  status: EmergencyStatus | "All Status";
  urgency: EmergencyUrgency | "All Levels";
};

type EmergencyFiltersProps = {
  locationOptions: string[];
  onChange: (values: EmergencyFilterValues) => void;
  values: EmergencyFilterValues;
};

const EmergencyFilters = ({ locationOptions, onChange, values }: EmergencyFiltersProps) => {
  const updateFilter = <Key extends keyof EmergencyFilterValues>(
    key: Key,
    value: EmergencyFilterValues[Key],
  ) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.85fr)_minmax(0,0.85fr)_minmax(0,0.85fr)_auto]">
      <div className="lg:flex lg:items-end">
        <EmergencySearchInput
          onChange={(value) => updateFilter("search", value)}
          placeholder="Search emergency by item, keyword, or location..."
          value={values.search}
        />
      </div>
      <EmergencyFilterSelect
        label="Location"
        onChange={(value) => updateFilter("location", value)}
        options={["All Locations", ...locationOptions]}
        value={values.location}
      />
      <EmergencyFilterSelect
        label="Urgency"
        onChange={(value) => updateFilter("urgency", value as EmergencyFilterValues["urgency"])}
        options={["All Levels", "Urgent", "Medium", "Low"]}
        value={values.urgency}
      />
      <EmergencyFilterSelect
        label="Status"
        onChange={(value) => updateFilter("status", value as EmergencyFilterValues["status"])}
        options={["All Status", "Open", "Helped", "Suspended", "Banned"]}
        value={values.status}
      />
      <div className="lg:w-36 lg:flex lg:items-end">
        <EmergencyClearFiltersButton
          onClick={() =>
            onChange({
              location: "All Locations",
              search: "",
              status: "All Status",
              urgency: "All Levels",
            })
          }
        />
      </div>
    </section>
  );
};

export default EmergencyFilters;
