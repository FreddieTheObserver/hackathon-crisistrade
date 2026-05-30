export const ProfilePage = () => {
  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <header>
          <h1 className="text-4xl font-bold text-[#1F2A44]">My Profile</h1>
          <p className="mt-4 text-base text-[#1F2A44]">
            Manage your account, view your activity, and update your preferences.
          </p>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)]">
          <div className="min-h-[520px] rounded-lg border border-slate-200 bg-white shadow-md" />

          <div className="space-y-8">
            <div className="min-h-[260px] rounded-lg bg-emerald-50 shadow-sm" />

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="min-h-[220px] rounded-lg border border-slate-200 bg-white shadow-md" />
              <div className="min-h-[220px] rounded-lg border border-slate-200 bg-white shadow-md" />
              <div className="min-h-[220px] rounded-lg border border-slate-200 bg-white shadow-md" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
