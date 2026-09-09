import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

const HOLD_PERIOD_MS = 14 * 24 * 60 * 60 * 1000;
const FINAL_STATUSES = ["delivered", "picked_up", "resolved"];

// Runs once daily via Vercel Cron (see vercel.json), same auth pattern as
// check-stale-fulfillments. Per-item-fulfillment orders never get their
// top-level `status` updated once delivered/picked up (see
// src/app/store-owner/orders/page.tsx's orderFulfillmentBadge comment) — this
// finalizes it to "shipped" once every item has been in a final state for 14
// days (matching the EU withdrawal-right window), so Admin's Order Monitoring
// stops showing "paid" forever. Money/transfers are untouched here — the
// seller payout already happened at confirmation (src/lib/confirmFulfillment.ts);
// this only updates the record-keeping status. A legal refund can still be
// processed on an already-"shipped" order at any time.
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const cutoff = new Date(Date.now() - HOLD_PERIOD_MS);

  const orders = await Order.find({
    paymentIntentId: { $exists: true, $ne: null },
    status: "paid",
    "items.confirmedAt": { $lte: cutoff },
  });

  let finalized = 0;

  for (const order of orders) {
    const allFinal = order.items.every((i: any) =>
      FINAL_STATUSES.includes(i.fulfillmentStatus),
    );
    if (!allFinal) continue;

    const confirmedTimes = order.items.map(
      (i: any) => i.confirmedAt?.getTime() ?? 0,
    );
    const latestConfirmed = Math.max(...confirmedTimes);
    if (latestConfirmed === 0 || latestConfirmed > cutoff.getTime()) continue;

    order.status = "shipped";
    await order.save();
    finalized += 1;
  }

  return NextResponse.json({ checked: orders.length, finalized });
}
