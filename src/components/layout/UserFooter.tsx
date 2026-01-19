import Link from "next/link";

export default function UserFooter() {
  return (
    <footer className="border-t mt-12 px-6 py-8 text-sm text-gray-600">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-4">
        <div>
          <p className="font-semibold text-black">GoWithPorto</p>
          <p>Your personal guide to the best of Porto.</p>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/shop" className="hover:underline">
            Shop Souvenirs
          </Link>
          <Link href="/ai" className="hover:underline">
            AI Trip Planner
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-semibold text-black">My Account</p>
          <Link href="/dashboard" className="hover:underline">
            My Orders
          </Link>
          <Link href="/cart" className="hover:underline">
            My Cart
          </Link>
        </div>
      </div>

      <div className="text-center mt-8 pt-4 border-t">
        <p>© {new Date().getFullYear()} GoWithPorto. Enjoy your stay!</p>
      </div>
    </footer>
  );
}
