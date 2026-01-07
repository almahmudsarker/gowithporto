"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [credits, setCredits] = useState<number>(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (!session) return;

    fetch("/api/user/credits")
      .then((res) => res.json())
      .then((data) => setCredits(data.credits));
  }, [session]);

  useEffect(() => {
    if (!session) return;

    fetch("/api/user/history")
      .then((res) => res.json())
      .then((data) => setResponses(data));
  }, [session]);

  useEffect(() => {
    if (!session) return;

    fetch("/api/user/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Please login to view dashboard.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Dashboard</h1>

      <div className="rounded border p-4">
        <p className="text-lg">
          Remaining Credits: <strong>{credits}</strong>
        </p>
      </div>

      <div className="rounded border p-4">
        <h2 className="font-semibold mb-2">My AI Responses</h2>

        {responses.length === 0 && <p>No AI plans yet.</p>}

        <ul className="space-y-2">
          {responses.map((item) => (
            <li key={item._id} className="border rounded p-2 text-sm">
              <p className="font-medium">{item.response.summary}</p>
              <p className="text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded border p-4">
        <h2 className="font-semibold mb-2">Transactions</h2>

        {transactions.length === 0 && <p>No payments yet.</p>}

        <ul className="space-y-2">
          {transactions.map((tx) => (
            <li key={tx._id} className="border p-2 rounded text-sm">
              <p>
                €{(tx.amount / 100).toFixed(2)} — {tx.creditsAdded} credits
              </p>
              <p className="text-gray-500">
                {new Date(tx.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
