"use client";

import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import { useEffect, useState } from "react";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (sort) params.append("sort", sort);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then(setProducts);
  }, [category, sort]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Shop Porto Souvenirs</h1>

      <div className="flex gap-4">
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="ceramics">Ceramics</option>
          <option value="stationery">Stationery</option>
          <option value="souvenir">Souvenir</option>
        </Select>

        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="name">Name</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <Card key={p._id} className="space-y-2">
            <img
              src={p.images?.[0]}
              alt={p.title}
              className="h-40 w-full object-cover rounded"
            />
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-gray-500">{p.storeId?.name}</p>
            <p className="font-bold">€{p.price}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
