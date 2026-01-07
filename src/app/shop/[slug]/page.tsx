"use client";

import Button from "@/components/ui/Button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then(setProduct)
      .catch((err) => {
        console.error(err);
        setProduct({ error: true });
      });
  }, [slug]);

  if (!product) return <p className="p-6">Loading...</p>;
  if (product.error) return <p className="p-6">Product not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <img
        src={product.images?.[0]}
        alt={product.title}
        className="rounded-lg"
      />

      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-xl mt-2 text-gray-600">€{product.price}</p>

        <p className="mt-4">{product.description}</p>

        <p className="mt-4 text-sm text-gray-500">
          Store: {product.storeId?.name}
        </p>

        <Button className="mt-6 w-full">Add to Cart</Button>
      </div>
    </div>
  );
}
