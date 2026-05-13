"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "../../providers/auth-provider";
import { AdminShell } from "./admin-shell";

type AdminRouteGateProps = {
  children: ReactNode;
};

export function AdminRouteGate({ children }: AdminRouteGateProps) {
  const router = useRouter();
  const { status, user, forbidden, logout } = useAuth();

  useEffect(() => {
    if (status !== "unauthenticated" || forbidden) {
      return;
    }
    router.replace("/login");
  }, [status, forbidden, router]);

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-500" aria-live="polite">
          Loading…
        </p>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 p-6">
        <div className="max-w-md text-center">
          <h1 className="text-lg font-semibold text-neutral-900">
            Access denied
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Your account is signed in but does not have administrator access.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Sign out
        </button>
      </div>
    );
  }

  if (status !== "authenticated" || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-500" aria-live="polite">
          Redirecting…
        </p>
      </div>
    );
  }

  return (
    <AdminShell user={user} onLogout={logout}>
      {children}
    </AdminShell>
  );
}
