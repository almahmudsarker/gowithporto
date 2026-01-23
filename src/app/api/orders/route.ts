import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, address } = await req.json();

    await connectDB();

    const total = items.reduce(
      (sum: number, i: any) => sum + i.price * i.quantity,
      0
    );

    const order = await Order.create({
      userEmail: session.user.email,
      items,
      total,
      address,
      status: "paid",
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json([], { status: 200 });
  }

  await connectDB();

  const orders = await Order.find({
    userEmail: session.user.email,
  }).sort({ createdAt: -1 });

  return NextResponse.json(orders);
}
