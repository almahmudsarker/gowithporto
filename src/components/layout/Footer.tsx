import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-12 px-6 py-8 text-sm text-muted-foreground">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <p className="font-semibold text-black">GoWithPorto</p>
          <p>Discover Porto with AI & local stores.</p>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/shop">Shop</Link>
          <Link href="/ai">AI Trip Planner</Link>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-semibold text-black">Store Owners</p>
          <Link href="/store-owner/login" className="underline">
            Store Owner Login
          </Link>
        </div>
      </div>

      <p className="mt-6 text-xs">
        © {new Date().getFullYear()} GoWithPorto. All rights reserved.
      </p>
    </footer>
  );
}
