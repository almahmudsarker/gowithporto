"use client";

import Card from "@/components/ui/Card";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ResultContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No plan ID provided.");
      setLoading(false);
      return;
    }

    fetch(`/api/ai/result?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch travel plan");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-10 text-center">Reading the stars for your trip... ✨</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!data) return <div className="p-10 text-center">Plan not found.</div>;

  const { response, prompt } = data;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="font-serif text-4xl">Your AI Porto Trip ✨</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Tailored for {prompt.days} days, {prompt.budget} budget, for {prompt.people}.
        </p>
      </section>

      <section>
        <Card className="bg-blue-50/50 border-blue-100">
          <h2 className="font-serif text-2xl mb-4 text-blue-900">Summary</h2>
          <p className="text-lg text-blue-800 leading-relaxed">{response.summary}</p>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="font-serif text-3xl">Itinerary</h2>
        <div className="grid gap-8">
          {response.itinerary?.map((day: any, idx: number) => (
            <div key={idx} className="relative pl-8 border-l-2 border-primary/20 pb-8 last:pb-0">
              <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-primary border-4 border-white shadow-sm" />
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-primary uppercase tracking-widest">Day {day.day}</span>
                  <h3 className="text-xl font-bold">{day.title}</h3>
                </div>
                <ul className="grid md:grid-cols-2 gap-3">
                  {day.activities?.map((act: string, aIdx: number) => (
                    <li key={aIdx} className="bg-white p-3 rounded-lg border shadow-sm text-gray-700 flex items-start gap-2">
                      <span className="text-primary mt-1">→</span>
                      {act}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function AIResultPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading Result...</div>}>
      <ResultContent />
    </Suspense>
  );
}
