import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { PLATFORM_LAUNCH_DATE } from "@/lib/platformLaunch";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");

    await connectDB();

    // Pre-launch test orders (placed before go-live) are excluded platform-wide
    // from admin views — see src/lib/platformLaunch.ts.
    const query: any = { createdAt: { $gte: PLATFORM_LAUNCH_DATE } };
    if (status && status !== "ALL") {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("storeId", "name"); // Assuming 'storeId' ref is setup in Order model

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
