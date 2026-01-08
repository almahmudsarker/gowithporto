"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function Header() {
  const { data: session } = useSession();
  const cartCount = useSelector(
    (state: RootState) =>
      state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  return (
    <header className="border-b px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">
        GoWithPorto
      </Link>

      <nav className="flex items-center gap-6">
        <Link href="/shop">Shop</Link>

        {session && (
          <>
            <Link href="/cart" className="relative">
              🛒 Cart
              {cartCount > 0 && (
                <span className="ml-1 text-sm font-bold">
                  ({cartCount})
                </span>
              )}
            </Link>

            <button
              onClick={() => signOut()}
              className="text-sm text-red-600"
            >
              Logout
            </button>
          </>
        )}

        {!session && (
          <Link href="/api/auth/signin">Login</Link>
        )}
      </nav>
    </header>
  );
}
