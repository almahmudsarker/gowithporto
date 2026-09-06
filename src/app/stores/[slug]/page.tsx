"use client";

import { MapPinIcon } from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import ProductCard from "@/components/shop/ProductCard";
import Link from "@/components/ui/LocalizedLink";

type Store = {
  _id: string;
  name: string;
  slug: string;
  location?: string;
  googleMapsLink?: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  images?: string[];
};

export default function StoreProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/stores/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setStore(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!store?._id) return;

    fetch(`/api/products?storeId=${store._id}`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, [store?._id]);

  if (notFound) {
    return (
      <div className="px-4 pt-24 pb-16 text-center sm:px-8 sm:pt-28 lg:px-12">
        <p className="text-sm text-gray-500">Shop not found.</p>
        <Link href="/stores" className="mt-2 inline-block text-sm text-[#2c6e9b] hover:underline">
          Back to Shops
        </Link>
      </div>
    );
  }

  if (loading || !store) {
    return (
      <div className="px-4 pt-24 pb-16 text-center sm:px-8 sm:pt-28 lg:px-12">
        <p className="text-sm text-gray-500">Loading shop...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 px-4 pt-24 pb-16 sm:px-8 sm:pt-28 lg:px-12">
      <div className="relative h-56 w-full overflow-hidden rounded-3xl bg-gray-100 sm:h-72">
        {store.bannerUrl && (
          <img src={store.bannerUrl} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative -mt-24 h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-sm sm:-mt-28 sm:h-32 sm:w-32">
          {store.logoUrl && (
            <img src={store.logoUrl} alt={store.name} className="h-full w-full object-cover" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <h1 className="font-serif text-3xl font-medium text-[#1c4c73] sm:text-4xl">
            {store.name}
          </h1>
          {store.tagline && <p className="text-[var(--text)]">{store.tagline}</p>}
          {store.location && (
            <p className="flex items-center gap-1 text-sm text-gray-500">
              <MapPinIcon className="h-4 w-4" />
              {store.location}
              {store.googleMapsLink && (
                <a
                  href={store.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 font-medium text-[#2c6e9b] hover:underline"
                >
                  Get Directions
                </a>
              )}
            </p>
          )}
        </div>
      </div>

      {store.description && (
        <p className="max-w-3xl border-t border-black/5 pt-6 text-sm leading-relaxed text-[var(--text)]/80">
          {store.description}
        </p>
      )}

      {store.images && store.images.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-serif text-xl font-medium text-[#1c4c73]">Gallery</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {store.images.map((img, i) => (
              <div
                key={img + i}
                className="aspect-square overflow-hidden rounded-2xl border border-black/5 bg-gray-100"
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-serif text-xl font-medium text-[#1c4c73]">Products</h2>
        {products.length === 0 ? (
          <p className="text-sm text-gray-500">No products listed yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
