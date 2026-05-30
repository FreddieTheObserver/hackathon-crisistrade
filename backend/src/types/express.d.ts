// Shared auth identity attached to every authenticated request by requireAuth.
export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
