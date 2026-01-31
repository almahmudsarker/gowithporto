"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetch("/api/store-owner/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p: any) => p._id === id);
        setProduct(found);
      });
  }, [id]);

  if (!product) return null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/store-owner/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: product.title,
        price: product.price,
        category: product.category,
        images: product.images,
        quantity: product.quantity,
        active: product.active,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(`Error: ${error.error || "Failed to update product"}`);
      return;
    }

    router.push("/store-owner/products");
  };

  return (
    <form onSubmit={save} className="space-y-4 max-w-md">
      <h1 className="text-xl font-semibold">Edit Product</h1>

      <input
        className="w-full border px-3 py-2"
        value={product.title}
        onChange={(e) => setProduct({ ...product, title: e.target.value })}
      />

      <input
        type="number"
        className="w-full border px-3 py-2"
        value={product.price}
        onChange={(e) =>
          setProduct({ ...product, price: Number(e.target.value) })
        }
      />

      <input
        type="number"
        className="w-full border px-3 py-2"
        placeholder="Quantity"
        value={product.quantity || 0}
        onChange={(e) =>
          setProduct({ ...product, quantity: Number(e.target.value) })
        }
      />

      <textarea
        className="w-full border px-3 py-2"
        placeholder="Images (one per line)"
        value={product.images?.join("\n") || ""}
        onChange={(e) =>
          setProduct({
            ...product,
            images: e.target.value.split("\n").filter((img) => img.trim()),
          })
        }
      />

      <input
        className="w-full border px-3 py-2"
        placeholder="Category"
        value={product.category || ""}
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={product.active}
          onChange={(e) => setProduct({ ...product, active: e.target.checked })}
        />
        Active
      </label>

      <button className="bg-black text-white px-4 py-2 rounded">Save</button>
    </form>
  );
}
