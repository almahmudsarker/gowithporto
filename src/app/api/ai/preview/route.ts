import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 🔐 LOCK RULE
  if (user.freeUsed && user.credits <= 0) {
    return NextResponse.json({
      locked: true,
      message: "Payment required",
    });
  }

  // 🎁 FREE OR CREDIT
  if (!user.freeUsed) {
    user.freeUsed = true;
  } else {
    user.credits -= 1;
  }

  await user.save();

  // MOCK AI RESPONSE (real AI later)
  const aiResponse = {
    summary: "3-day Porto itinerary",
    days: [
      { day: 1, title: "Historic Center" },
      { day: 2, title: "Douro Valley" },
      { day: 3, title: "Foz do Douro" },
    ],
  };

  return NextResponse.json({
    locked: false,
    response: aiResponse,
    remainingCredits: user.credits,
  });
}
