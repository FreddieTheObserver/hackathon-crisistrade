// Shared auth identity attached to every authenticated request by requireAuth.
export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  profilePhotoUrl: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
