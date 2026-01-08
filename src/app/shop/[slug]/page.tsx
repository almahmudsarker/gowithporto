"use client";

import Button from "@/components/ui/Button";
import { addToCart } from "@/store/slices/cartSlice";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then(setProduct);
  }, [slug]);

  if (!product) return <p className="p-6">Loading...</p>;

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

        <Button
          className="mt-6 w-full"
          onClick={() =>
            dispatch(
              addToCart({
                productId: product._id,
                title: product.title,
                price: product.price,
                image: product.images?.[0],
                quantity: 1,
              })
            )
          }
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
