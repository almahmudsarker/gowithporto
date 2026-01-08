"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order) => (
        <div key={order._id} className="border p-4 rounded space-y-2">
          <p className="font-semibold">Total: €{order.total}</p>
          <p>Status: {order.status}</p>

          <div className="text-sm text-gray-600">
            <p>
              {order.address.name}, {order.address.street}, {order.address.city}
            </p>
          </div>

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
