"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  userEmail: string;
  status: string;
  createdAt: string;
  address: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
};

export default function StoreOwnerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/store-owner/orders", { cache: "no-store" })
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>

      {orders.length === 0 && (
        <p className="text-muted-foreground">No orders yet for your store.</p>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span>
                <strong>User:</strong> {order.userEmail}
              </span>
              <span>
                <strong>Status:</strong> {order.status}
              </span>
            </div>

            <div className="text-sm">
              <strong>Order date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </div>

            <div className="border-t pt-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-1">Product</th>
                    <th className="py-1">Qty</th>
                    <th className="py-1">Price</th>
                    <th className="py-1">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-1">{item.title}</td>
                      <td className="py-1">{item.quantity}</td>
                      <td className="py-1">€{item.price}</td>
                      <td className="py-1">€{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-sm text-muted-foreground">
              <strong>Delivery address:</strong>
              <div>
                {order.address.name}, {order.address.street},{" "}
                {order.address.city}, {order.address.postalCode},{" "}
                {order.address.country}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
