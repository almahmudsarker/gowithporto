"use client";

import { clearCart } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function CheckoutSuccessPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // clear redux + localStorage cart
    dispatch(clearCart());

    // redirect after UX delay
    const t = setTimeout(() => {
      router.push("/dashboard");
    }, 2500);

    return () => clearTimeout(t);
  }, [dispatch, router]);

  return (
    <div className="p-6 max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Successful 🎉</h1>
      <p>Your order has been placed.</p>
      <p>Redirecting to dashboard…</p>
    </div>
  );
}
