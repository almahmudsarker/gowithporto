"use client";

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

  if (loading) return <div className="p-20 text-center font-serif text-xl animate-pulse">Reading the stars for your trip... ✨</div>;
  if (error) return <div className="p-20 text-center text-red-500 font-serif">{error}</div>;
  if (!data) return <div className="p-20 text-center font-serif">Plan not found.</div>;

  const { response, prompt } = data;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 bg-[#F9F7F2] min-h-screen text-[#2A2A2A]">
      {/* Header */}
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <span className="hidden md:block h-[1px] w-16 bg-gradient-to-r from-transparent to-amber-400"></span>
          <h1 className="font-serif text-5xl md:text-6xl text-[#2F3E46] italic">Your AI Porto Trip <span className="text-4xl not-italic">✨</span></h1>
          <span className="hidden md:block h-[1px] w-16 bg-gradient-to-l from-transparent to-amber-400"></span>
        </div>
        <p className="font-medium text-lg text-gray-600">
          Tailored for <span className="font-bold">{prompt.days} days</span>, <span className="font-bold">{prompt.budget} budget</span>, for <span className="font-bold">{prompt.people}</span>.
        </p>
      </header>

      {/* Hero Image */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-3xl shadow-xl border-4 border-white">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1632245809643-8d40095f45db?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fHBvcnRvJTIwcG9ydHVnYWx8ZW58MHx8MHx8fDA%3D"
          alt="Porto View"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Summary */}
      <section className="space-y-6">
        <h2 className="text-center font-serif text-4xl text-[#2F3E46] relative pb-4">
          Summary
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-amber-300 rounded-full"></span>
        </h2>
        <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-sm border border-blue-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>
          <p className="text-xl leading-relaxed text-gray-700 italic font-serif">
            &ldquo;{response.summary}&rdquo;
          </p>
        </div>
      </section>

      {/* Itinerary */}
      <section className="space-y-10 relative">
        <h2 className="text-center font-serif text-4xl text-[#2F3E46] relative pb-6">
          Itinerary
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-amber-300 rounded-full"></span>
        </h2>

        <div className="space-y-12 relative flex flex-col">
          {/* Vertical Line */}
          <div className="absolute left-[27px] md:left-[39px] top-4 bottom-0 w-0.5 bg-amber-200" />

          {response.itinerary?.map((day: any, idx: number) => (
            <div key={idx} className="relative pl-20 md:pl-28">
              {/* Day Circle/Image */}
              <div className="absolute left-0 top-0 z-10">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border-4 border-amber-50 shadow-lg overflow-hidden relative bg-white">
                  <img
                    src={`https://images.unsplash.com/photo-${[
                      '1615892438475-694629f05c7b', // Tile
                      '1677344087971-91eee10dfeb1', // Bridge
                      '1659821668900-d08d2107edda', // Food
                      '1673347666468-819d27318d69', // Wine
                      '1679507923204-bbff99cf8d1b'  // Street
                    ][idx % 5]}?w=200&h=200&fit=crop`}
                    alt={`Day ${day.day}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Small gold dot on current line pos */}
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 rounded-full border-2 border-white "></div>
                </div>
              </div>

              {/* Card Content */}
              <div className="bg-white rounded-2xl shadow-md border hover:border-amber-200 transition-colors overflow-hidden group">
                {/* Header Gradient */}
                <div className="bg-gradient-to-r from-amber-600/90 to-amber-700/60 p-4 text-white relative">
                  {/* Texture overlay (CSS pattern could go here) */}
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-2xl italic">Day {day.day}</span>
                    <span className="text-amber-100 font-medium opacity-80">|</span>
                    <h3 className="font-medium text-lg md:text-xl tracking-wide text-amber-50">{day.title}</h3>
                  </div>
                </div>

                <div className="p-6 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                  <ul className="space-y-3">
                    {day.activities?.map((act: string, aIdx: number) => (
                      <li key={aIdx} className="flex items-start gap-3 text-gray-700">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                        <span className="leading-relaxed">{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
    <Suspense fallback={<div className="p-20 text-center font-serif">Loading Result...</div>}>
      <ResultContent />
    </Suspense>
  );
}
