"use client";

import Button from "@/components/ui/Button";
import { RootState } from "@/store";
import { removeFromCart } from "@/store/slices/cartSlice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <p className="p-6">Loading cart…</p>;
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return <p className="p-6">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>

      {items.map((item) => (
        <div
          key={item.productId}
          className="flex justify-between border p-4 rounded"
        >
          <div>
            <p className="font-semibold">{item.title}</p>
            <p>
              €{item.price} × {item.quantity}
            </p>
          </div>

          <Button
            variant="outline"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => dispatch(removeFromCart(item.productId))}
          >
            Remove
          </Button>
        </div>
      ))}

      <p className="text-xl font-bold">Total: €{total}</p>

      <Link href="/checkout">
        <Button className="w-full">Proceed to Checkout</Button>
      </Link>
    </div>
  );
}
