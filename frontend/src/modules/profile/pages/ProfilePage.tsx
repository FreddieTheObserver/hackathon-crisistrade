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
                  className="absolute bottom-3 right-0 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#1F2A44] text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#263657] hover:shadow-lg hover:ring-2 hover:ring-emerald-100"
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
            <article className="flex min-h-[260px] flex-col items-center justify-center rounded-lg bg-emerald-50 px-8 py-10 text-center shadow-sm">
              <h2 className="text-xl font-bold text-emerald-800">Reputation Points</h2>

              <div className="mt-8 flex items-center justify-center gap-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <svg aria-hidden="true" className="h-9 w-9" fill="currentColor" viewBox="0 0 24 24">
                    <path d="m12 2.5 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.4l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 2.5Z" />
                  </svg>
                </div>

                <p className="text-7xl font-bold tracking-wide text-emerald-800">1,250</p>
              </div>

              <p className="mt-8 text-xl font-bold text-emerald-800">Trusted Community Member</p>
            </article>

            <div className="grid gap-6 sm:grid-cols-3">
              <article className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-8 text-center shadow-md">
                <svg aria-hidden="true" className="h-12 w-12 text-black" fill="none" viewBox="0 0 24 24">
                  <path d="M3 17 9 11l4 4 8-8" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M16 7h5v5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                </svg>
                <p className="mt-8 text-4xl font-bold text-emerald-800">28</p>
                <h3 className="mt-4 text-xl font-bold text-emerald-800">Trades</h3>
                <p className="mt-4 text-sm font-medium text-[#1F2A44]">12 completed</p>
              </article>

              <article className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-8 text-center shadow-md">
                <svg aria-hidden="true" className="h-12 w-12 text-black" fill="none" viewBox="0 0 24 24">
                  <path d="m21 3-8.5 18-3-8.5L1 9l20-6Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
                </svg>
                <p className="mt-8 text-4xl font-bold text-emerald-800">15</p>
                <h3 className="mt-4 text-xl font-bold text-emerald-800">Requests</h3>
                <p className="mt-4 text-sm font-medium text-[#1F2A44]">8 fulfilled</p>
              </article>

              <article className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-8 text-center shadow-md">
                <svg aria-hidden="true" className="h-12 w-12 text-black" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M4 12h4l3-3h4a3 3 0 0 1 3 3v1M4 12v7h8l8-4v-3l-7 2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                  <path d="M16 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="currentColor" />
                </svg>
                <p className="mt-8 text-4xl font-bold text-emerald-800">9</p>
                <h3 className="mt-4 text-xl font-bold text-emerald-800">Donations</h3>
                <p className="mt-4 text-sm font-medium text-[#1F2A44]">6 received</p>
              </article>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
