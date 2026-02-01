"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StoreOwnerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    const res = await fetch("/api/store-owner/products", {
      cache: "no-store",
    });
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    const res = await fetch(`/api/store-owner/products/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      alert(`Error: ${error.error || "Failed to delete product"}`);
      return;
    }

    await fetchProducts(); // 🔥 always sync with DB
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/store-owner/products/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Product
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Title</th>
            <th className="p-2">Price</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Active</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b">
              <td className="p-2">{p.title}</td>
              <td className="p-2">€{p.price}</td>
              <td className="p-2">{p.quantity || 0}</td>
              <td className="p-2">{p.active ? "Yes" : "No"}</td>
              <td className="p-2 space-x-3">
                <Link
                  href={`/store-owner/products/${p._id}/edit`}
                  className="underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteProduct(p._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
