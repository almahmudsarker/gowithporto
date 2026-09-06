import { connectDB } from "@/lib/mongodb";
import Store from "@/models/Store";
import { NextResponse } from "next/server";

// GET: Public shop profile by slug — only exposes trust-building fields,
// never the auth/payout internals that live on the same Store document.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await connectDB();

    const store = await Store.findOne({ slug, active: true }).select(
      "name slug location googleMapsLink tagline description logoUrl bannerUrl images"
    );

    if (!store) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error("STORE PROFILE API ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch shop" }, { status: 500 });
  }
}
