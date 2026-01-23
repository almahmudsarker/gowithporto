import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "STORE_OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const products = await Product.find({
    storeId: session.user.storeId,
  }).sort({ createdAt: -1 });

  return NextResponse.json(products, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "STORE_OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  await connectDB();

  const product = await Product.create({
    ...body,
    storeId: session.user.storeId,
    active: true,
  });

  return NextResponse.json(product);
}
