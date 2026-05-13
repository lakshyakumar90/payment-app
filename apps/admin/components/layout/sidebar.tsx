"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
};

const NAV: NavItem[] = [
  { href: "/", label: "Dashboard" },
  { href: "/wallet/top-up", label: "Wallet · Top up" },
  { href: "/wallet/deduct", label: "Wallet · Deduct" },
  { href: "/wallet/reset-cache", label: "Wallet · Reset cache" },
  { href: "/wallet/bulk", label: "Wallet · Bulk ops" },
  {
    href: "/transactions/admin-transfer",
    label: "Transactions · Admin transfer",
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-neutral-200 bg-white p-3 md:w-64 md:border-b-0 md:border-r md:p-4">
      <nav className="flex flex-wrap gap-2 md:flex-col md:gap-1">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-md px-3 py-2 text-sm",
                active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-700 hover:bg-neutral-100",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
