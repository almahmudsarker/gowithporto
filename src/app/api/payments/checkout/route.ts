import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "GoWithPorto AI Credits",
            description: "10 AI travel plan generations",
          },
          unit_amount: 500, // €5
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/ai/success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/ai/cancel`,
    metadata: {
      userEmail: session.user?.email || "",
      credits: "10",
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
