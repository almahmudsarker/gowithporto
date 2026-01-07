import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  await User.findOneAndUpdate(
    { email: session.user.email },
    { $inc: { credits: 10 } }
  );

  await Transaction.create({
    userEmail: session.user.email,
    stripeSessionId: "manual-success", // temp (webhook later)
    amount: 5,
    currency: "eur",
    creditsAdded: 10,
  });

  return NextResponse.json({ success: true });
}
