import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  getCurrentUser,
  logout as logoutRequest,
  type AuthUser,
} from "../pages/auth.api";

/**
 * Global auth state (Area I integration).
 *
 * Resolves the current session from the httpOnly cookie via `GET /auth/me`
 * on first load, then holds the user in memory. The login/signup pages push
 * the freshly authenticated user in via `setUser`; the navbar and
 * `ProtectedRoute` read from here.
 */
interface AuthContextValue {
  user: AuthUser | null;
  /** True until the initial `/auth/me` check resolves. */
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      setUser(await getCurrentUser());
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function logout() {
    await logoutRequest();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

/**
 * Whether the current user may edit/delete a record owned by `ownerId`.
 * True for the owner, and for admins (who bypass every board's owner check
 * server-side). Mirrors the backend rule `record.userId === user.id || isAdmin`.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useCanManage(ownerId?: string | null): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return user.role === "admin" || (ownerId != null && user.id === ownerId);
}
