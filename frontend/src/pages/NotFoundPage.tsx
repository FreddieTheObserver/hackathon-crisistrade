import { Link } from "react-router-dom";

/**
 * Catch-all 404. Rendered for any path that doesn't match a known route.
 * Mounted inside the protected app shell, so the navbar stays available and
 * the user can get back to a board in one click.
 */
export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <p className="text-5xl font-bold text-emerald-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link
        to="/trades"
        className="mt-6 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Back to Trades
      </Link>
    </div>
  );
}
