import EmergencyClearFiltersButton from "./EmergencyClearFiltersButton";
import EmergencyFilterSelect from "./EmergencyFilterSelect";
import EmergencySearchInput from "./EmergencySearchInput";

const EmergencyFilters = () => {
  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.85fr)_minmax(0,0.85fr)_minmax(0,0.85fr)_auto]">
      <div className="lg:pt-[29px]">
        <EmergencySearchInput placeholder="Search emergency by item, keyword, or location..." />
      </div>
      <EmergencyFilterSelect label="Location" value="All Locations" />
      <EmergencyFilterSelect label="Category" value="All Categories" />
      <EmergencyFilterSelect label="Status" value="All Status" />
      <div className="lg:w-36 lg:pt-[29px]">
        <EmergencyClearFiltersButton />
      </div>
    </section>
  );
};

export default EmergencyFilters;
