import EmergencyFilters from "../components/EmergencyFilters";
import EmergencyHeader from "../components/EmergencyHeader";
import EmergencyList from "../components/EmergencyList";

const EmergencyPage = () => {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <EmergencyHeader />
        <div className="mt-8">
          <EmergencyFilters />
        </div>
        <div className="mt-7">
          <EmergencyList />
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
