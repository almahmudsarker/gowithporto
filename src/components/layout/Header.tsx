"use client";

import Button from "@/components/ui/Button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-xl text-primary">GoWithPorto</h1>

        <nav className="flex items-center gap-4">
          {session ? (
            <Button variant="secondary" onClick={() => signOut()}>
              Logout
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => signIn("google")}>
              Login with Google
            </Button>
          )}
          <Button onClick={() => (window.location.href = "/ai")}>
            Plan Trip
          </Button>
        </nav>
      </div>
    </header>
  );
}
