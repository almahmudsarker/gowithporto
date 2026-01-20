"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Hide footer on specific login pages to avoid clutter if desired, 
  // but user asked for logic based on Login status mostly.
  // We'll keep it simple for now based on Roles.

  const isGuest = !session;
  const isAdmin = session?.user?.role === "ADMIN";
  const isStoreOwner = session?.user?.role === "STORE_OWNER";
  const isUser = session?.user?.role === "USER";

  // Admin Footer
  if (isAdmin) {
    return (
      <footer className="mt-auto border-t bg-white px-6 py-4 text-center text-xs text-gray-500">
        <p>Admin Portal &copy; {new Date().getFullYear()} GoWithPorto</p>
      </footer>
    );
  }

  // Store Owner Footer
  if (isStoreOwner) {
    return (
      <footer className="mt-12 border-t bg-gray-50 px-6 py-8 text-sm text-gray-600">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="font-semibold text-gray-900">Partner Dashboard</p>
          <p className="text-xs">Manage your store and orders efficiently.</p>
          <p className="mt-4 text-xs">
            &copy; {new Date().getFullYear()} GoWithPorto Partners
          </p>
        </div>
      </footer>
    );
  }

  // Standard Footer (User & Guest)
  return (
    <footer className="mt-12 border-t px-6 py-8 text-sm text-muted-foreground">
      <div className="flex flex-col justify-between gap-8 md:flex-row">
        <div>
          <p className="font-semibold text-black">GoWithPorto</p>
          <p>Discover Porto with AI & local stores.</p>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/shop">Shop</Link>
          <Link href="/ai">AI Trip Planner</Link>
        </div>

        {/* Access Links - Only visible to Guests */}
        {isGuest && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-black">Partners</p>
              <Link href="/store-owner/login" className="text-gray-600 hover:text-black hover:underline">
                Store Owner Login
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-black">Administration</p>
              <Link href="/admin/login" className="text-gray-600 hover:text-black hover:underline">
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-gray-400">
        © {new Date().getFullYear()} GoWithPorto. All rights reserved.
      </p>
    </footer>
  );
}
