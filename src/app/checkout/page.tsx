"use client";

import Button from "@/components/ui/Button";
import { RootState } from "@/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function CheckoutPage() {
  const { status } = useSession();
  const router = useRouter();
  const items = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  async function handleCheckout() {
    const res = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      console.error("Checkout failed");
      return;
    }

    const data = await res.json();
    window.location.href = data.url;
  }

  if (status === "loading") {
    return <p className="p-6">Checking authentication...</p>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <Button
        onClick={handleCheckout}
        className="mt-6 w-full"
        disabled={items.length === 0}
      >
        Pay with Card
      </Button>
    </div>
  );
}
