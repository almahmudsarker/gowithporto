"use client";

import { useEffect, useRef } from "react";

export default function SuccessPage() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    fetch("/api/payments/success", { method: "POST" }).then(() => {
      window.location.assign("/ai");
    });
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-serif text-primary">
        Payment Successful 🎉
      </h1>
      <p className="mt-4">Redirecting back to planner...</p>
    </div>
  );
}
