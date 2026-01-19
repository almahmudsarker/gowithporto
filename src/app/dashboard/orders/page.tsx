import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getOrders() {
  const cookieStore = await cookies();

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/orders`, {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order: any) => (
        <div key={order._id} className="border p-4 rounded-lg space-y-2 bg-white shadow-sm">
          <div className="flex justify-between items-start">
             <div>
                <p className="font-semibold text-lg">Order #{order._id.slice(-6)}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
             </div>
             <p className="font-bold text-lg">€{order.total.toFixed(2)}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
                {order.status.toUpperCase()}
            </span>
            {order.address ? (
                 <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    DELIVERY
                 </span>
            ) : (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    PICKUP
                </span>
            )}
          </div>

          {order.address ? (
            <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
              <p className="font-medium">Shipping Address:</p>
              <p>
                {order.address.name}, {order.address.street},{" "}
                {order.address.city}, {order.address.postalCode}
              </p>
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic mt-2 bg-gray-50 p-2 rounded">
               Pickup from store location
            </div>
          )}

          <div className="mt-4">
             <p className="font-medium mb-2">Items:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
                {order.items.map((i: any, idx: number) => (
                  <li key={idx}>
                    <span className="font-medium">{i.title}</span> × {i.quantity}
                  </li>
                ))}
              </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
