import EmergencyActionButton from "./EmergencyActionButton";

const EmergencyHeader = () => {
  return (
    <section className="flex items-start justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
          <span className="text-3xl font-bold leading-none text-red-500">!</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-800">Emergency</h1>
          <p className="mt-1 text-sm text-slate-600">Ask for help or help people in need</p>
        </div>
      </div>

      <EmergencyActionButton label="+ Add Emergency" />
    </section>
  );
};

export default EmergencyHeader;
