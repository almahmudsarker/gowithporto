import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Store from "@/models/Store";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // 1. Total Revenue
    const totalRevenueAgg = await Order.aggregate([
      { $match: { status: { $in: ["DELIVERED", "COMPLETED", "PAID"] } } }, // Adjust statuses as per Order model
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // 2. Revenue by Store
    // We need to lookup store details if Order only has storeId
    const revenueByStore = await Order.aggregate([
      { $match: { status: { $in: ["DELIVERED", "COMPLETED", "PAID"] } } },
      {
        $group: {
          _id: "$storeId",
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    // Populate store names manually or via another lookup if needed, 
    // but for now let's try to fetch store details for these IDs
    const storeIds = revenueByStore.map((item) => item._id);
    const stores = await Store.find({ _id: { $in: storeIds } });
    
    const revenueByStoreWithDetails = revenueByStore.map((item) => {
        const store = stores.find(s => s._id.toString() === item._id?.toString());
        return {
            storeId: item._id,
            storeName: store?.name || "Unknown Store",
            total: item.total,
            orders: item.count
        };
    });

    // 3. Daily Revenue (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          status: { $in: ["DELIVERED", "COMPLETED", "PAID"] },
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            total: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json({
      totalRevenue,
      revenueByStore: revenueByStoreWithDetails,
      dailyRevenue,
    });
  } catch (error) {
    console.error("Revenue API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}
