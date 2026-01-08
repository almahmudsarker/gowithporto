import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  await connectDB();

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return NextResponse.json(
      { error: "Payment not completed" },
      { status: 400 }
    );
  }

  const items = JSON.parse(session.metadata?.items || "[]");
  const address = JSON.parse(session.metadata?.address || "{}");

  const total = items.reduce(
    (sum: number, i: any) => sum + i.price * i.quantity,
    0
  );

  await Order.create({
    userEmail: session.metadata?.userEmail,
    items,
    address,
    total,
    status: "paid",
    stripeSessionId: session.id,
  });

  return NextResponse.json({ success: true });
}
