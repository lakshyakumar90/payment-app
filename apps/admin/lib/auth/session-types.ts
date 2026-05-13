import type { AuthUser as ApiAuthUser } from "../api/auth-api";

/** Mirrors API user; extend when backend adds `role`. */
export type SessionUser = ApiAuthUser & {
  role?: "ADMIN" | "USER" | string;
};

export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated";

export type AuthState = {
  status: AuthStatus;
  user: SessionUser | null;
  /** Set when user is logged in but fails admin policy (UI only). */
  forbidden: boolean;
};