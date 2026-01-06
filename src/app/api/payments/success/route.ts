import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { addCredits } from "@/lib/creditStore";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Grant 10 credits
  addCredits(session.user.email, 10);

  return NextResponse.json({ success: true });
}
