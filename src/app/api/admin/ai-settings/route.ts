import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import GlobalConfig from "@/models/GlobalConfig";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const AI_CONFIG_KEY = "AI_SETTINGS";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let config = await GlobalConfig.findOne({ key: AI_CONFIG_KEY });

    // Default settings if not found
    if (!config) {
      config = await GlobalConfig.create({
        key: AI_CONFIG_KEY,
        value: {
          enabled: true,
          model: "gpt-4-turbo",
          temperature: 0.7,
          maxTokens: 2000,
          systemPrompt: "You are a helpful assistant for the GowithPorto platform.",
        },
      });
    }

    return NextResponse.json(config.value);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await connectDB();

    const config = await GlobalConfig.findOneAndUpdate(
      { key: AI_CONFIG_KEY },
      { value: body },
      { new: true, upsert: true }
    );

    return NextResponse.json(config.value);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
