import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Store from "@/models/Store";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "STORE_OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const store = await Store.findById(session.user.storeId).select(
    "name slug location tagline description logoUrl bannerUrl images"
  );

  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  return NextResponse.json(store, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "STORE_OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { tagline, description, logoUrl, bannerUrl, images } = body;

  await connectDB();

  const store = await Store.findByIdAndUpdate(
    session.user.storeId,
    {
      tagline: tagline?.trim() || undefined,
      description: description?.trim() || undefined,
      logoUrl: logoUrl || undefined,
      bannerUrl: bannerUrl || undefined,
      images: Array.isArray(images) ? images : [],
    },
    { new: true }
  ).select("name slug location tagline description logoUrl bannerUrl images");

  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  return NextResponse.json(store);
}
