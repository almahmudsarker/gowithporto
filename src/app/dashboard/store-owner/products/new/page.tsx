"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    price: "",
    category: "",
    images: "",
    quantity: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/store-owner/products", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        images: form.images.split("\n").filter((img) => img.trim()),
      }),
    });

    router.push("/dashboard/store-owner/products");
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      <h1 className="text-xl font-semibold">Add Product</h1>

      <input
        placeholder="Title"
        className="w-full border px-3 py-2"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Slug"
        className="w-full border px-3 py-2"
        value={form.slug}
        onChange={(e) => setForm({ ...form, slug: e.target.value })}
      />

      <input
        type="number"
        placeholder="Price"
        className="w-full border px-3 py-2"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <input
        type="number"
        placeholder="Quantity"
        className="w-full border px-3 py-2"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
      />

      <textarea
        placeholder="Images (one per line)"
        className="w-full border px-3 py-2"
        value={form.images}
        onChange={(e) => setForm({ ...form, images: e.target.value })}
      />

      <input
        placeholder="Category"
        className="w-full border px-3 py-2"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <button className="bg-black text-white px-4 py-2 rounded">Create</button>
    </form>
  );
}
