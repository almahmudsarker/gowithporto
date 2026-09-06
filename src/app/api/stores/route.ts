import { connectDB } from "@/lib/mongodb";
import Store from "@/models/Store";
import { NextResponse } from "next/server";

// GET: Public list of active shops, for the shop directory.
export async function GET() {
  try {
    await connectDB();

    const stores = await Store.find({ active: true })
      .select("name slug location tagline logoUrl bannerUrl")
      .sort({ name: 1 });

    return NextResponse.json(stores);
  } catch (error) {
    console.error("STORES API ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}
