"use client";

import { useEffect } from "react";

export default function SuccessPage() {
  useEffect(() => {
    fetch("/api/payments/success", { method: "POST" });
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-serif text-primary">
        Payment Successful 🎉
      </h1>
      <p className="mt-4">You have unlocked 10 AI travel plans.</p>
    </div>
  );
}
