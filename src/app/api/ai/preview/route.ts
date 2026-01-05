import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { days, budget, people } = body;

  // TEMP USER STATE (later from DB)
  let userCredits = 0; // change manually for testing
  let isFirstTime = true; // simulate first request

  // Business rules
  if (!isFirstTime && userCredits <= 0) {
    return NextResponse.json({
      locked: true,
      message: "Payment required to unlock AI responses",
    });
  }

  // MOCK AI RESPONSE (replace later with Gemini/GPT)
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
  });
}
