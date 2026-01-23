"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AIFormPage() {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    days: "",
    budget: "",
    people: "",
  });

  async function handlePayment() {
    const res = await fetch("/api/payments/ai-credits", {
      method: "POST",
    });

    if (!res.ok) {
      alert("Unable to start payment. Please try again.");
      return;
    }

    const data = await res.json();
    window.location.href = data.url;
  }


  async function handleSubmit() {
    if (!session) {
      alert("Please login first to generate a travel plan.");
      return;
    }

    const res = await fetch("/api/ai/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      alert("Unexpected server response. Please try again.");
      return;
    }

    if (data.locked) {
      await handlePayment();
      return;
    }

    window.location.assign(`/ai/result?id=${data.id}`);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl mb-6">Plan your Porto trip with AI</h1>

      <Card className="space-y-6">
        <Input label="Destination" value="Porto, Portugal" disabled />

        <Input
          label="Number of days"
          type="number"
          value={form.days}
          onChange={(e) => setForm({ ...form, days: e.target.value })}
        />

        <Select
          label="Budget"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          options={["Cheap", "Medium", "Luxury"]}
        />

        <Select
          label="Travel group"
          value={form.people}
          onChange={(e) => setForm({ ...form, people: e.target.value })}
          options={["Solo", "Couple", "Family", "Friends"]}
        />

        <Button className="w-full" onClick={handleSubmit}>
          Generate Plan
        </Button>
      </Card>
    </div>
  );
}
