"use client";

import { clearCart } from "@/store/slices/cartSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) return;

    fetch("/api/orders/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    }).then(() => {
      dispatch(clearCart());
      router.replace("/dashboard");
    });
  }, [sessionId, dispatch, router]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Payment Successful 🎉</h1>
      <p className="mt-4">Finalizing your order…</p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<p className="p-10 text-center">Loading payment status...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
