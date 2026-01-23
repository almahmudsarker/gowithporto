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

  const responses = await AIResponse.find({
    userEmail: session.user.email,
  }).sort({ createdAt: -1 });

  return NextResponse.json(responses);
}
