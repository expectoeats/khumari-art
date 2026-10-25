import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getAdminSession } from "../../../../lib/auth";
import Order from "../../../../models/Order";

// GET /api/orders/:id — admin only
export async function GET(_, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const order = await Order.findById(params.id);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/orders/:id — admin only
export async function PATCH(req, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();
    const allowed = ["orderStatus", "paymentStatus", "paymentMethod", "notes", "customerAddress"];
    const update = {};
    for (const key of allowed) {
      if (key in body) update[key] = body[key];
    }
    const order = await Order.findByIdAndUpdate(params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

// DELETE /api/orders/:id — admin only
export async function DELETE(_, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    await Order.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}