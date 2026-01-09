"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard/store-owner", label: "Dashboard" },
  { href: "/dashboard/store-owner/orders", label: "Orders" },
  { href: "/dashboard/store-owner/payouts", label: "Payouts" },
  { href: "/dashboard/store-owner/settings", label: "Settings" },
];

export default function StoreOwnerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r p-4">
      <h2 className="mb-6 font-semibold">Store Owner</h2>

      <nav className="space-y-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "block px-3 py-2 rounded text-sm",
              pathname === l.href ? "bg-black text-white" : "hover:bg-muted"
            )}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
