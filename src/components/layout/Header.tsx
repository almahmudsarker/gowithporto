"use client";

import { RootState } from "@/store";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Header() {
  const { data: session } = useSession();

  const isStoreOwner = session?.user?.role === "STORE_OWNER";

  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  // Hide header for Admin
  if (session?.user?.role === "ADMIN") {
    return null;
  }

  return (
    <header className="border-b px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">
        GoWithPorto
      </Link>

      <nav className="flex items-center gap-6">
        <Link href="/shop">Shop</Link>

        {/* USER FEATURES ONLY */}
        {session && !isStoreOwner && (
          <>
            <Link href="/cart" className="relative">
              🛒 Cart
              {cartCount > 0 && (
                <span className="ml-1 text-sm font-bold">({cartCount})</span>
              )}
            </Link>

            <Link href="/ai">AI Planner</Link>
          </>
        )}

        {/* USER DASHBOARD LINK */}
        {session && session.user.role === "USER" && (
          <Link href="/dashboard" className="text-sm font-semibold">
            User Dashboard
          </Link>
        )}

        {/* STORE OWNER LINK */}
        {session && isStoreOwner && (
          <Link href="/dashboard/store-owner" className="text-sm font-semibold">
            Store-owner Dashboard
          </Link>
        )}

        {/* AUTH ACTIONS */}
        {session ? (
          <button onClick={() => signOut()} className="text-sm text-red-600">
            Logout
          </button>
        ) : (
          <button onClick={() => signIn("google")} className="text-sm">
            Login
          </button>
        )}
      </nav>
    </header>
  );
}
