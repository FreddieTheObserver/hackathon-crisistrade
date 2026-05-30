import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { signup, getAuthErrorMessage } from "./auth.api";
import { useAuth } from "../auth/AuthContext";

export function SignupPage() {
  const navigate = useNavigate();
  const { user, loading, setUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already signed in — no reason to show the form.
  if (!loading && user) return <Navigate to="/" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!acceptedTerms) return;
    setError(null);
    setSubmitting(true);
    try {
      setUser(await signup({ displayName, email, password }));
      navigate("/", { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err, "Unable to sign up. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  const termsCheckbox = (
    <label className="mt-6 flex cursor-pointer items-center justify-center gap-3 text-xs font-semibold text-slate-400">
      <input
        type="checkbox"
        checked={acceptedTerms}
        onChange={(event) => setAcceptedTerms(event.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
      />
      <span>I have read and acknowledged the terms above.</span>
    </label>
  );

  return (
    <AuthLayout mode="signup" asideFooter={termsCheckbox}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Username</span>
          <input
            type="text"
            required
            minLength={2}
            maxLength={40}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Enter your username"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </label>

        <button
          type="submit"
          disabled={!acceptedTerms || submitting}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          {submitting ? "Creating account…" : "Sign Up"}
        </button>
      </form>
    </AuthLayout>
  );
}
