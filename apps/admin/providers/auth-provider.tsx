"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import * as authApi from "../lib/api/auth-api";
import { isAdminUser } from "../lib/auth/admin-policy";
import type { AuthStatus, SessionUser } from "../lib/auth/session-types";
import {
  clearStoredAccessToken,
  hydrateAccessTokenFromStorage,
  persistAccessToken,
} from "../lib/auth/token-storage";
import { getAccessToken } from "../lib/api/access-token";

type AuthContextValue = {
  status: AuthStatus;
  user: SessionUser | null;
  forbidden: boolean;
  login: (body: authApi.LoginBody) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchSessionUser(): Promise<SessionUser> {
  const { user } = await authApi.getMe();
  return user as SessionUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const bootstrapped = useRef(false);

  // APPLY AUTHENTICATED USER
  const applyAuthenticatedUser = useCallback((next: SessionUser) => {
    if (!isAdminUser(next)) {
      setForbidden(true);
      setUser(null);
      clearStoredAccessToken();
      setStatus("unauthenticated");
      return;
    }
    setForbidden(false);
    setUser(next);
    setStatus("authenticated");
  }, []);

  // BOOTSTRAP
  const bootstrap = useCallback(async () => {
    setStatus("loading");
    setForbidden(false);
    hydrateAccessTokenFromStorage();
    try {
      if (!getAccessToken()) {
        const accessToken = await authApi.refreshToken();
        persistAccessToken(accessToken);
      }
      const me = await fetchSessionUser();
      applyAuthenticatedUser(me);
    } catch {
      clearStoredAccessToken();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, [applyAuthenticatedUser]);

  // BOOTSTRAP EFFECT
  useEffect(() => {
    if (bootstrapped.current) {
      return;
    }
    bootstrapped.current = true;
    void bootstrap();
  }, [bootstrap]);

  // LOGIN
  const login = useCallback(
    async (body: authApi.LoginBody) => {
      setStatus("loading");
      setForbidden(false);
      try {
        const { accessToken, user: loggedIn } = await authApi.login(body);
        persistAccessToken(accessToken);
        const me = await fetchSessionUser();
        applyAuthenticatedUser(me);
      } catch (e) {
        clearStoredAccessToken();
        setUser(null);
        setStatus("unauthenticated");
        throw e;
      }
    },
    [applyAuthenticatedUser],
  );

  // LOGOUT
  const logout = useCallback(async () => {
    setForbidden(false);
    try {
      if (getAccessToken()) {
        await authApi.logout();
      }
    } catch {
    } finally {
      clearStoredAccessToken();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      forbidden,
      login,
      logout,
    }),
    [status, user, forbidden, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
