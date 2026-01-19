import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import { cookies } from "next/headers";

async function getOrders() {
  const cookieStore = await cookies(); // ✅ async in Next.js 16

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/orders`, {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(), // ✅ correct API
    },
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // 🔒 USER ROLE GUARD
  if (!session) {
    redirect("/");
  }

  if (session.user.role !== "USER") {
    redirect("/dashboard/store-owner");
  }

  const orders = await getOrders();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order: any) => (
        <div key={order._id} className="border p-4 rounded space-y-2">
          <p className="font-semibold">Total: €{order.total}</p>
          <p>Status: {order.status}</p>

          {order.address ? (
            <div className="text-sm text-gray-600">
              <p>
                {order.address.name}, {order.address.street},{" "}
                {order.address.city}
              </p>
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">
              Pickup from store
            </div>
          )}

          <ul className="list-disc ml-6">
            {order.items.map((i: any, idx: number) => (
              <li key={idx}>
                {i.title} × {i.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
