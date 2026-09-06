"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Button from "@/components/ui/Button";
import ImageUploader from "@/components/ui/ImageUploader";
import SingleImagePicker from "@/components/ui/SingleImagePicker";

type Profile = {
  name: string;
  slug: string;
  location: string;
  tagline: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  images: string[];
};

export default function StoreOwnerProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/store-owner/profile", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) =>
        data
          ? setProfile({
              name: data.name,
              slug: data.slug,
              location: data.location,
              tagline: data.tagline ?? "",
              description: data.description ?? "",
              logoUrl: data.logoUrl ?? "",
              bannerUrl: data.bannerUrl ?? "",
              images: data.images ?? [],
            })
          : null
      )
      .catch(() => null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const res = await fetch("/api/store-owner/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tagline: profile.tagline,
          description: profile.description,
          logoUrl: profile.logoUrl,
          bannerUrl: profile.bannerUrl,
          images: profile.images,
        }),
      });

      if (!res.ok) throw new Error("Failed to save shop profile");

      toast.success("Shop profile updated");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <p className="text-sm text-black/40">Loading shop profile...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#1d3d5c]">
          Shop Profile
        </h1>
        <p className="mt-1 text-sm text-black/50">
          This is what customers see when they visit your shop page — help
          them get to know you before they buy.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-black/60">
            Tagline
          </label>
          <input
            value={profile.tagline}
            onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
            maxLength={120}
            placeholder="A short line that sums up your shop"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black/60">
            About Your Shop
          </label>
          <textarea
            value={profile.description}
            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            rows={5}
            placeholder="Tell customers your story — who you are, what you sell, what makes your shop special."
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black/60">
            Logo
          </label>
          <SingleImagePicker
            value={profile.logoUrl}
            onChange={(url) => setProfile({ ...profile, logoUrl: url })}
            folder="stores/logo"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black/60">
            Cover Photo
          </label>
          <SingleImagePicker
            value={profile.bannerUrl}
            onChange={(url) => setProfile({ ...profile, bannerUrl: url })}
            folder="stores/banner"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black/60">
            Shop Gallery
          </label>
          <p className="mb-2 text-xs text-black/40">
            A few real photos of your shop or storefront help customers trust
            what they&apos;re buying from.
          </p>
          <ImageUploader
            value={profile.images}
            onChange={(urls) => setProfile({ ...profile, images: urls })}
            folder="stores/gallery"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
