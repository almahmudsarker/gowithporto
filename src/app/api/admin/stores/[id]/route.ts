import { connectDB } from "@/lib/mongodb";
import Store from "@/models/Store";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, location, storeCode, password, deliveryFee, pickupEnabled, active } = body;

    await connectDB();

    const store = await Store.findById(id);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Update fields
    if (name) store.name = name;
    if (location) store.location = location;
    if (storeCode) {
        // Check uniqueness if changed
        if (storeCode !== store.storeCode) {
            const exists = await Store.findOne({ storeCode });
            if (exists) return NextResponse.json({ error: "Store Code taken" }, { status: 400 });
            store.storeCode = storeCode;
        }
    }
    if (password) {
        store.passwordHash = await bcrypt.hash(password, 10);
    }
    if (deliveryFee !== undefined) store.deliveryFee = deliveryFee;
    if (pickupEnabled !== undefined) store.pickupEnabled = pickupEnabled;
    if (active !== undefined) store.active = active;

    await store.save();

    return NextResponse.json(store);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    // Soft delete implementation via DELETE verb? 
    // Or hard delete? Requirement says "Disable store (soft delete)".
    // Usually DELETE verb can remove it or set active=false.
    // I will use DELETE to set active=false (Soft Delete).
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const store = await Store.findById(id);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    store.active = false;
    await store.save();

    return NextResponse.json({ message: "Store deactivated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
