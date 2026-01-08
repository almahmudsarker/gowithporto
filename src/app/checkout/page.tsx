"use client";

import Button from "@/components/ui/Button";
import { RootState } from "@/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function CheckoutPage() {
  const { status } = useSession();
  const router = useRouter();
  const items = useSelector((state: RootState) => state.cart.items);

  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
  }

  async function handleCheckout() {
    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }

    localStorage.setItem("checkout-data", JSON.stringify({ items, address }));

    const res = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, address }),
    });

    if (!res.ok) {
      console.error("Checkout failed");
      alert("Checkout failed");
      return;
    }

    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <input
        placeholder="Name"
        onChange={(e) => setAddress({ ...address, name: e.target.value })}
      />
      <input
        placeholder="Street"
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
      />
      <input
        placeholder="City"
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
      />
      <input
        placeholder="Postal Code"
        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
      />
      <input
        placeholder="Country"
        onChange={(e) => setAddress({ ...address, country: e.target.value })}
      />

      <Button onClick={handleCheckout} className="w-full">
        Pay with Card
      </Button>
    </div>
  );
}
