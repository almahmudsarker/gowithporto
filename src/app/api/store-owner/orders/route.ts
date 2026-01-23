import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "STORE_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const storeObjectId = new mongoose.Types.ObjectId(session.user.storeId);

    // 1. Get product IDs owned by this store
    const storeProducts = await Product.find(
      { storeId: storeObjectId },
      { _id: 1 }
    );

    const productObjectIds = storeProducts.map((p) => p._id);
    const productStringIds = storeProducts.map((p) => p._id.toString());

    if (productObjectIds.length === 0) {
      return NextResponse.json([]);
    }

    // 2. Find orders containing those products
    const orders = await Order.find({
      "items.productId": { $in: productObjectIds },
    })
      .sort({ createdAt: -1 })
      .lean();

    console.log("Store products:", productObjectIds.length);
    console.log("Found orders:", orders.length);

    // 3. Filter order items per store
    const filteredOrders = orders
      .map((order) => {
        const items = order.items.filter((item: any) =>
          productStringIds.includes(item.productId?.toString())
        );

        if (items.length === 0) return null;

        return {
          ...order,
          items,
        };
      })
      .filter(Boolean);

    console.log("Filtered orders:", filteredOrders.length);

    return NextResponse.json(filteredOrders, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Error fetching store orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
