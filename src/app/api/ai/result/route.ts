import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import AIResponse from "@/models/AIResponse";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const response = await AIResponse.findById(id);

    if (!response) {
      return NextResponse.json({ error: "Response not found" }, { status: 404 });
    }

    // Security check: ensure own entry
    if (response.userEmail !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Fetch AI Result Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
