"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { apiClient, getStoredAccessToken, setAccessToken } from "../lib/api/client";
import { LoginSchemaType } from "@repo/zod-schemas";

type User = {
  id: string;
  name: string;
  email: string;
};

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginSchemaType) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = getStoredAccessToken();
        if (stored) setAccessToken(stored);

        const res = await apiClient.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (data: LoginSchemaType) => {
    const res = await apiClient.post("/auth/login", data);
    const { accessToken, user } = res.data;
    setAccessToken(accessToken);
    setUser(user);

    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (err) {}

    setAccessToken("");
    setUser(null);

    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
