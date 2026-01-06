import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { consumeCredit, getUserCredits, markFreeUsed } from "@/lib/creditStore";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;
  const user = getUserCredits(email);

  // 🔐 LOCK RULE
  if (user.usedFree && user.credits <= 0) {
    return NextResponse.json({
      locked: true,
      message: "Payment required",
    });
  }

  // 🎁 FREE OR CREDIT
  if (!user.usedFree) {
    markFreeUsed(email);
  } else {
    consumeCredit(email);
  }

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
