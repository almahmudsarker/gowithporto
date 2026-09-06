"use client";

import { useEffect, useState } from "react";

import StoreCard from "@/components/shop/StoreCard";

type Store = {
  _id: string;
  name: string;
  slug: string;
  location?: string;
  tagline?: string;
  logoUrl?: string;
  bannerUrl?: string;
};

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stores")
      .then((res) => res.json())
      .then((data) => setStores(Array.isArray(data) ? data : []))
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10 px-4 pt-24 pb-16 sm:px-8 sm:pt-28 lg:px-12">
      <div className="max-w-2xl space-y-3">
        <h1 className="font-serif text-3xl font-medium text-[#1c4c73] sm:text-4xl">
          Our Shops
        </h1>
        <p className="text-[var(--text)]">
          Meet the local shops behind the products — see their story, their
          storefront, and where to find them before you buy.
        </p>
      </div>

      {loading ? (
        <p className="py-16 text-center text-sm text-gray-500">Loading shops...</p>
      ) : stores.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-500">
          No shops listed yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((s) => (
            <StoreCard
              key={s._id}
              name={s.name}
              slug={s.slug}
              location={s.location}
              tagline={s.tagline}
              logoUrl={s.logoUrl}
              bannerUrl={s.bannerUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
