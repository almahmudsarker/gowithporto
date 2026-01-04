"use client";

import Button from "@/components/ui/Button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-xl text-primary">
          GoWithPorto
        </h1>

        <nav className="flex items-center gap-4">
          <Button variant="secondary">Login</Button>
          <Button>Plan Trip</Button>
        </nav>
      </div>
    </header>
  );
}
