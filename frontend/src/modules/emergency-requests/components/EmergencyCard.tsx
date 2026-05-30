const EmergencyCard = () => {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="p-4">
        <div className="mb-4 h-32 rounded-md bg-slate-200" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="h-5 w-32 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-44 rounded bg-slate-100" />
          </div>

          <div className="h-6 w-16 rounded-md bg-slate-100" />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <div className="h-6 w-14 rounded-md bg-slate-100" />
          <div className="h-6 w-20 rounded-md bg-slate-100" />
        </div>

        <div className="mt-3 h-4 w-40 rounded bg-slate-100" />
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
        <div className="h-3 w-20 rounded bg-slate-100" />
        <div className="h-3 w-12 rounded bg-slate-100" />
      </div>
    </article>
  );
};

export default EmergencyCard;
