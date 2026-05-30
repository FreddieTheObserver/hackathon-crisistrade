import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

/**
 * Route-level error boundary. React Router renders this when a route element
 * (or its loader/action) throws, instead of showing a blank shell or the
 * unbranded default error screen.
 */
export function RouteErrorPage() {
  const error = useRouteError();

  let detail = "An unexpected error occurred.";
  if (isRouteErrorResponse(error)) {
    detail = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    detail = error.message;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-6 text-center">
      <h1 className="text-2xl font-bold text-ink">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-muted">{detail}</p>
      <Link
        to="/trades"
        className="mt-6 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-strong"
      >
        Back to safety
      </Link>
    </div>
  );
}
