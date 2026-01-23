import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "AI Travel Planner Credits",
          },
          unit_amount: 500, // €5 for example
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/ai/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/ai/cancel`,
    metadata: {
      type: "AI_CREDITS",
    },
  });

  return NextResponse.json({ url: session.url });
}
