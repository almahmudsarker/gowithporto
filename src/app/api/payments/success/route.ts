import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items } = await req.json();

  await connectDB();

  const total = items.reduce(
    (sum: number, i: any) => sum + i.price * i.quantity,
    0
  );

  await Order.create({
    userEmail: session.user.email,
    items,
    total,
    status: "paid",
  });

  return NextResponse.json({ success: true });
}
