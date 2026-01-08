"use client";

import { useAppDispatch } from "@/store";
import { clearCart } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutSuccessPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("checkout-data") || "null");

    if (!data) return;

    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(() => {
      dispatch(clearCart());
      localStorage.removeItem("checkout-data");

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    });
  }, [dispatch, router]);

  return (
    <div className="p-6 max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Successful 🎉</h1>
      <p>Your order has been placed.</p>
    </div>
  );
}
