"use client";

import { RootState } from "@/store";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function CheckoutPage() {
  const cart = useSelector((state: RootState) => state.cart.items);

  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">(
    "pickup"
  );
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    postalCode: "",
    country: "Portugal",
  });

  const handleCheckout = async () => {
    if (deliveryType === "delivery") {
      for (const key of Object.keys(address)) {
        if (!address[key as keyof typeof address]) {
          alert("Please fill in all delivery address fields.");
          return;
        }
      }
    }

    setLoading(true);

    const res = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        deliveryType,
        address: deliveryType === "delivery" ? address : null,
      }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* DELIVERY TYPE */}
      <div className="space-y-2">
        <label className="flex gap-2 items-center">
          <input
            type="radio"
            checked={deliveryType === "pickup"}
            onChange={() => setDeliveryType("pickup")}
          />
          Pick up from store (Free)
        </label>

        <label className="flex gap-2 items-center">
          <input
            type="radio"
            checked={deliveryType === "delivery"}
            onChange={() => setDeliveryType("delivery")}
          />
          Delivery (fee applies)
        </label>
      </div>

      {/* ADDRESS FORM */}
      {deliveryType === "delivery" && (
        <div className="space-y-3 border p-4 rounded">
          <h2 className="font-semibold">Delivery Address</h2>

          <input
            className="w-full border p-2 rounded"
            placeholder="Full Name"
            value={address.name}
            onChange={(e) => setAddress({ ...address, name: e.target.value })}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Street Address"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Postal Code"
            value={address.postalCode}
            onChange={(e) =>
              setAddress({ ...address, postalCode: e.target.value })
            }
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Country"
            value={address.country}
            onChange={(e) =>
              setAddress({ ...address, country: e.target.value })
            }
          />
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded"
      >
        {loading ? "Redirecting..." : "Proceed to Payment"}
      </button>
    </div>
  );
}
