import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { getAdminSession } from "../../../lib/auth";
import Order from "../../../models/Order";

// GET /api/orders — admin only with filters
export async function GET(req) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { customerEmail: { $regex: search, $options: "i" } },
        { orderNumber: { $regex: search, $options: "i" } },
        { artworkTitle: { $regex: search, $options: "i" } },
      ];
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("[GET /api/orders]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/orders — public (customer places order)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      artworkId,
      artworkTitle,
      artworkImage,
      quantity,
      price,
      paymentMethod,
      notes,
    } = body;

    if (!customerName || !customerEmail || !artworkTitle || !price) {
      return NextResponse.json(
        { error: "customerName, customerEmail, artworkTitle and price are required" },
        { status: 400 }
      );
    }

    const count = await Order.countDocuments();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const orderNumber = `KS-${dateStr}-${String(count + 1).padStart(3, "0")}`;

    const totalAmount = Number(price) * (Number(quantity) || 1);

    const order = await Order.create({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone: customerPhone || "",
      customerAddress: customerAddress || "",
      artworkId: artworkId || null,
      artworkTitle,
      artworkImage: artworkImage || "",
      quantity: Number(quantity) || 1,
      price: Number(price),
      totalAmount,
      paymentMethod: paymentMethod || "",
      notes: notes || "",
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}