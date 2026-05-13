"use client";

import type { ReactNode } from "react";
import type { SessionUser } from "../../lib/auth/session-types";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

type AdminShellProps = {
  user: SessionUser;
  onLogout: () => void | Promise<void>;
  children: ReactNode;
};

export function AdminShell({ user, onLogout, children }: AdminShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Header user={user} onLogout={onLogout} />
      
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>{" "}
    </div>
  );
}
