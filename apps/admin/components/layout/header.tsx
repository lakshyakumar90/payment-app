"use client";

import type { SessionUser } from "../../lib/auth/session-types";

type HeaderProps = {
  user: SessionUser;
  onLogout: () => void | Promise<void>;
};

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold tracking-tight">
          Payment admin
        </span>
      </div>

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
  );
}