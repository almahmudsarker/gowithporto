import { seedProducts } from "@/lib/seedProducts";
import { NextResponse } from "next/server";

export async function GET() {
  await seedProducts();
  return NextResponse.json({ ok: true });
}
