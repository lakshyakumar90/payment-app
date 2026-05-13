"use client";

import type { ReactNode } from "react";
import type { SessionUser } from "../../lib/auth/session-types";

type AdminShellProps = {
  user: SessionUser;
  onLogout: () => void | Promise<void>;
  children: ReactNode;
};

export function AdminShell({ user, onLogout, children }: AdminShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
        <span className="text-sm font-semibold tracking-tight">
          Payment admin
        </span>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-neutral-600 sm:inline">
            {user.email}
          </span>
          <button
            type="button"
            onClick={() => void onLogout()}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
