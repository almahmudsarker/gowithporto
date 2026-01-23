import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import GlobalConfig from "@/models/GlobalConfig";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let config = await GlobalConfig.findOne();
    if (!config) {
      config = await GlobalConfig.create({});
    }

    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { defaultSystemPrompt, defaultModel, creditPrice, freeCredits } = await req.json();

    await connectDB();

    let config = await GlobalConfig.findOne();
    if (!config) {
        config = await GlobalConfig.create({
            defaultSystemPrompt,
            defaultModel,
            creditPrice,
            freeCredits
        });
    } else {
        if (defaultSystemPrompt !== undefined) config.defaultSystemPrompt = defaultSystemPrompt;
        if (defaultModel !== undefined) config.defaultModel = defaultModel;
        if (creditPrice !== undefined) config.creditPrice = creditPrice;
        if (freeCredits !== undefined) config.freeCredits = freeCredits;
        await config.save();
    }

    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
