import type { SessionUser } from "./session-types";

function emailAllowList(): string[] {
  const raw = process.env.ADMIN_EMAIL_ALLOW_LIST;
  if (!raw?.trim()) {
    return [];
  }
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: SessionUser): boolean {
    if(user.role === "ADMIN") {
        return true;
    }

    const allowed = emailAllowList();
    if(allowed.length > 0) {
        return allowed.includes(user.email.toLowerCase());
    }

    return false;
}
