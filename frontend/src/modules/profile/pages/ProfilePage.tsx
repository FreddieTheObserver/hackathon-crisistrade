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
          <article className="min-h-[520px] rounded-lg border border-slate-200 bg-white px-14 py-16 shadow-md">
            <div className="grid gap-12 md:grid-cols-[170px_minmax(0,1fr)]">
              <div className="relative mx-auto h-40 w-40 rounded-full bg-emerald-100">
                <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-[#1F2A44]">
                  AK
                </div>
                <button
                  className="absolute bottom-3 right-0 flex h-10 w-10 items-center justify-center rounded-md border-4 border-white bg-[#1F2A44] text-white shadow-sm"
                  type="button"
                >
                  <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M4 8h3l1.4-2h7.2L17 8h3v10H4V8Z"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-[#1F2A44]">Arjun Kumar</h2>

                <div className="mt-5 inline-flex items-center gap-2 rounded-md bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">
                    ✓
                  </span>
                  Verified Member
                </div>

                <div className="mt-8 space-y-4 text-base font-medium text-[#1F2A44]">
                  <p className="flex items-center gap-3">
                    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M12 21s7-5.3 7-12A7 7 0 0 0 5 9c0 6.7 7 12 7 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Kathmandu
                  </p>
                  <p className="flex items-center gap-3">
                    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <path d="M7 3v4M17 3v4M4 9h16M5 5h14v16H5V5Z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Member since Jan 2023
                  </p>
                </div>
              </div>
            </div>

            <p className="mx-auto mt-12 max-w-md text-center text-base leading-snug text-[#1F2A44]">
              Community volunteer focused on helping families access essential resources during emergencies.
            </p>

            <div className="my-8 border-t border-slate-400" />

            <div className="mx-auto max-w-md space-y-4 text-base text-[#1F2A44]">
              <p className="flex items-center gap-3">
                <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2 4 1v3.6c0 .7-.5 1.2-1.2 1.2C9.8 21 3 14.2 3 5.8 3 5.1 3.5 4.6 4.2 4.6H8l1 4-2.4 2.2Z"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                98105430
              </p>
              <p className="flex items-center gap-3">
                <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" />
                </svg>
                arjun.kumar@example.com
              </p>
              <p className="flex items-center gap-3">
                <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 21s7-5.3 7-12A7 7 0 0 0 5 9c0 6.7 7 12 7 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
                </svg>
                Kathmandu, Nepal
              </p>
            </div>
          </article>

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
