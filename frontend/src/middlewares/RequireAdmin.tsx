import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

interface RequireAdminProps {
  children: ReactNode;
}

/**
 * Gates admin-only routes. Mirrors the backend `requireAdmin` rule: only a
 * session whose `role === "admin"` may render the admin UI. This is layered
 * on top of `ProtectedRoute`, so by the time it runs the session is already
 * resolved — but we still guard `loading`/unauthenticated defensively in case
 * an admin route is ever mounted on its own.
 *
 * Non-admins are bounced to the app home instead of being shown an admin shell
 * they can only get 403s from.
 */
const RequireAdmin = ({ children }: RequireAdminProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-500">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/trades" replace />;
  }

  return children;
};

export default RequireAdmin;
