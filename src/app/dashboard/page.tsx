"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!session) return;

    fetch("/api/orders")
      .then((res) => res.json())
      .then(setOrders);
  }, [session]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Dashboard</h1>

      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">My Orders</h2>

        {orders.length === 0 && <p>No orders yet.</p>}

        {orders.map((order) => (
          <div key={order._id} className="border p-3 rounded mb-3">
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <ul className="text-sm">
              {order.items.map((item: any, i: number) => (
                <li key={i}>
                  {item.title} × {item.quantity}
                </li>
              ))}
            </ul>

            <p className="font-semibold mt-2">Total: €{order.total}</p>
            <p className="text-xs text-green-600">{order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
