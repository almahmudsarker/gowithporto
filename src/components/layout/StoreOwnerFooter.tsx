export default function StoreOwnerFooter() {
  return (
    <footer className="border-t mt-12 px-6 py-12 text-sm text-gray-600 bg-gray-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div className="max-w-md space-y-4">
          <h3 className="font-bold text-lg text-black">Our Commitment to You</h3>
          <p>
            At GoWithPorto, we are dedicated to empowering local businesses. We
            provide the tools you need to reach more customers, manage your
            inventory efficiently, and grow your brand in the digital age. Your
            success is our success.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-black">Store Owner Resources</h4>
          <ul className="space-y-2">
            <li>
              <a href="/dashboard/store-owner" className="hover:underline">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/dashboard/store-owner/products" className="hover:underline">
                Manage Products
              </a>
            </li>
            <li>
              <a href="/dashboard/store-owner/orders" className="hover:underline">
                View Orders
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-12 pt-8 border-t">
        <p>© {new Date().getFullYear()} GoWithPorto Partner Program.</p>
      </div>
    </footer>
  );
}
