import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import AIResponse from "@/models/AIResponse";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const history = await AIResponse.find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .limit(20); // Limit to last 20 for now

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching AI history:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI history" },
      { status: 500 }
    );
  }
}
