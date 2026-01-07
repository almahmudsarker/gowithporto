import { connectDB } from "@/lib/mongodb";
import "@/models";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");

    let query = Product.find({ active: true });

    if (category) query = query.where("category").equals(category);
    if (sort === "name") query = query.sort({ title: 1 });

    const products = await query.populate("storeId", "name slug");

    return NextResponse.json(products);
  } catch (err) {
    console.error("PRODUCT API ERROR:", err);
    return NextResponse.json([], { status: 500 });
  }
}
