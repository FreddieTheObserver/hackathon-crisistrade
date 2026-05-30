import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import authBackground from "../assets/auth-background.png";
import crisisTradeLogo from "../assets/crisis-trade-logo.png";

type AuthMode = "login" | "signup";

interface AuthLayoutProps {
  mode: AuthMode;
  /** The auth form for this page. */
  children: ReactNode;
  /** Optional aside footer (e.g. the sign-up terms acknowledgement). */
  asideFooter?: ReactNode;
}

const safetyTips = [
  {
    title: "Verify information before deciding",
    body: "Information on CrisisTrade may be incomplete, inaccurate or outdated. Always verify details before making any decisions.",
  },
  {
    title: "Evaluate users and offers carefully",
    body: "You are responsible for checking the trustworthiness of users and the items or services being offered.",
  },
  {
    title: "Meet safely in public places",
    body: "Always meet in safe public places and consider bringing a trusted friend or family member.",
  },
  {
    title: "Protect your personal information.",
    body: "Do not share personal or sensitive information with other users.",
  },
];

function tabClass({ isActive }: { isActive: boolean }) {
  return `pb-3 text-center text-sm font-semibold ${
    isActive
      ? "border-b-2 border-emerald-500 text-emerald-700"
      : "text-slate-500"
  }`;
}

/**
 * Shared chrome for the `/login` and `/signup` pages: full-screen background,
 * brand header, login/sign-up tab links, and the safety reminder aside.
 * Each page supplies its own form as `children`.
 */
export function AuthLayout({ mode, children, asideFooter }: AuthLayoutProps) {
  return (
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

          {/* Tabs route between the two pages. */}
          <div className="mb-6 grid grid-cols-2 border-b border-slate-200">
            <NavLink to="/login" className={tabClass}>
              Login
            </NavLink>
            <NavLink to="/signup" className={tabClass}>
              Sign Up
            </NavLink>
          </div>

          {children}
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
            {safetyTips.map((tip) => (
              <li key={tip.title} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" />
                <div>
                  <h3 className="text-xs font-bold text-slate-700">{tip.title}</h3>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">{tip.body}</p>
                </div>
              </li>
            ))}
          </ul>

          {asideFooter}
        </aside>
      </section>
    </main>
  );
}
