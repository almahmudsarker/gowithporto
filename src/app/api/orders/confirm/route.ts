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

  // 1️⃣ Retrieve Stripe session
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (session.payment_status !== "paid") {
    return NextResponse.json(
      { error: "Payment not completed" },
      { status: 400 }
    );
  }

  // 🔹 Extract address from metadata (OUR app, not Stripe)
  const address = session.metadata?.address
    ? JSON.parse(session.metadata.address)
    : null;

  const productIds = session.metadata?.productIds?.split(",") || [];

  // 2️⃣ Build order items from Stripe line items
  const items =
    session.line_items?.data
      .filter((li) => li.description !== "Delivery Fee")
      .map((li, index) => ({
        productId: productIds[index] || "",
        title: li.description,
        price: li.price?.unit_amount ? li.price.unit_amount / 100 : 0,
        quantity: li.quantity || 1,
      })) || [];

  // 3️⃣ Calculate total
  const total = session.amount_total != null ? session.amount_total / 100 : 0;

  // 4️⃣ Create order
  const order = await Order.create({
    userEmail: session.customer_details?.email,
    items,
    total,
    status: "paid",
    deliveryType: session.metadata?.deliveryType,
    deliveryFee: Number(session.metadata?.deliveryFee || 0),
    address: address || undefined,
  });

  return NextResponse.json({ success: true, orderId: order._id });
}
