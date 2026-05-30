import { useState } from "react";
import type { FormEvent } from "react";
import authBackground from "../assets/auth-background.png";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import crisisTradeLogo from "../assets/crisis-trade-logo.png";

type AuthMode = "login" | "signup";

export function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log(`${mode} submitted`);
  }

  return (
    // Full-screen starter page with generated background artwork.
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-10"
      style={{ backgroundImage: `url(${authBackground})` }}
    >
      <section className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white/95 shadow-xl backdrop-blur md:grid md:h-[520px] md:grid-cols-2">
        <div className="flex flex-col justify-center px-8 py-4">
          {/* CrisisTrade brand header. */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <img
              src={crisisTradeLogo}
              alt="CrisisTrade logo"
              className="h-14 w-14 object-contain"
            />
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Crisis <span className="text-emerald-600">Trade</span>
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Share Resources. Save Lives.
              </p>
            </div>
          </div>

          {/* Local UI-only auth mode switch. */}
          <div className="mb-6 grid grid-cols-2 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`pb-3 text-sm font-semibold ${
                mode === "login"
                  ? "border-b-2 border-emerald-500 text-emerald-700"
                  : "text-slate-500"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`pb-3 text-sm font-semibold ${
                mode === "signup"
                  ? "border-b-2 border-emerald-500 text-emerald-700"
                  : "text-slate-500"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Static form placeholder; auth wiring will be added later. */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Username
                </span>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </label>
            )}

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Password
              </span>
              <input
                type="password"
                placeholder="Enter your password"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </label>

            <button
                type="submit"
                disabled={mode === "signup" && !acceptedTerms}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                >
                {mode === "login" ? "Login" : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Safety guidance stays visible as a reminder on both modes. */}
        <aside className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white/90 px-8 py-4 shadow-sm">
            <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <ShieldCheck className="h-8 w-8 text-emerald-500" />
                </div>
            </div>

            <h2 className="mt-3 text-center text-2xl font-bold text-slate-900">
                {mode === "login" ? "Just a reminder!" : "Your safety matters"}
            </h2>

            {mode === "signup" && (
            <p className="mx-auto mt-2 max-w-xs text-center text-xs leading-5 text-slate-500">
                Please read and understand the following before using CrisisTrade
            </p>
            )}

            <ul className="mt-4 space-y-3">
                <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" />
                <div>
                    <h3 className="text-xs font-bold text-slate-700">
                    Verify information before deciding
                    </h3>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                    Information on CrisisTrade may be incomplete, inaccurate or outdated. Always verify details before making any decisions.
                    </p>
                </div>
                </li>

                <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" />
                <div>
                    <h3 className="text-xs font-bold text-slate-700">
                    Evaluate users and offers carefully
                    </h3>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                    You are responsible for checking the trustworthiness of users and the items or services being offered.
                    </p>
                </div>
                </li>

                <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" />
                <div>
                    <h3 className="text-xs font-bold text-slate-700">Meet safely in public places</h3>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                    Always meet in safe public places and consider bringing a trusted friend or family member.
                    </p>
                </div>
                </li>

                <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" />
                <div>
                    <h3 className="text-xs font-bold text-slate-700">Protect your personal information.</h3>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                    Do not share personal or sensitive information with other users.
                    </p>
                </div>
                </li>
            </ul>

           {mode === "signup" && (
           /* Sign-up requires acknowledgement before the button is enabled. */
           <label className="mt-6 flex cursor-pointer items-center justify-center gap-3 text-xs font-semibold text-slate-400">
                <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>I have read and acknowledged the terms above.</span>
            </label>
           )}
        </aside>
      </section>
    </main>
  );
}
