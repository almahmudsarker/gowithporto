import { MapPinIcon } from "@heroicons/react/24/outline";

import Link from "@/components/ui/LocalizedLink";

type Props = {
  name: string;
  slug: string;
  location?: string;
  tagline?: string;
  logoUrl?: string;
  bannerUrl?: string;
};

export default function StoreCard({
  name,
  slug,
  location,
  tagline,
  logoUrl,
  bannerUrl,
}: Props) {
  return (
    <Link
      href={`/stores/${slug}`}
      className="group block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-32 w-full overflow-hidden bg-gray-100">
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <div className="space-y-1 p-4">
        <div className="flex items-center gap-3">
          <div className="relative -mt-8 h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-sm">
            {logoUrl && (
              <img src={logoUrl} alt={name} className="h-full w-full object-cover" />
            )}
          </div>
          <h3 className="font-semibold text-[var(--text)]">{name}</h3>
        </div>

        {tagline && (
          <p className="line-clamp-2 text-sm text-gray-500">{tagline}</p>
        )}

        {location && (
          <p className="flex items-center gap-1 text-xs text-gray-400">
            <MapPinIcon className="h-3.5 w-3.5" />
            {location}
          </p>
        )}
      </div>
    </Link>
  );
}
