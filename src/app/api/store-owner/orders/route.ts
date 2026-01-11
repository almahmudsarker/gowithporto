import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STORE_OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const storeObjectId = new mongoose.Types.ObjectId(
    session.user.storeId
  );

  // 1. Get product IDs owned by this store
  const storeProducts = await Product.find(
    { storeId: storeObjectId },
    { _id: 1 }
  );

  const productIds = storeProducts.map((p) => p._id);

  if (productIds.length === 0) {
    return NextResponse.json([]);
  }

  // 2. Find orders containing those products
  const orders = await Order.find({
    "items.productId": { $in: productIds },
  })
    .sort({ createdAt: -1 })
    .lean();

  // 3. Filter order items per store
  const filteredOrders = orders.map((order) => {
    const storeItems = order.items.filter((item: any) =>
      productIds.some(
        (pid) => pid.toString() === item.productId.toString()
      )
    );

    return {
      _id: order._id,
      userEmail: order.userEmail,
      status: order.status,
      address: order.address,
      createdAt: order.createdAt,
      items: storeItems,
    };
  });

  return NextResponse.json(filteredOrders, {
    headers: { "Cache-Control": "no-store" },
  });
}
