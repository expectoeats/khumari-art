import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { getAdminSession } from "../../../lib/auth";
import Order from "../../../models/Order";
import Inquiry from "../../../models/Inquiry";
import User from "../../../models/User";
import Artwork from "../../../models/Artwork";

export async function GET(req) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    const hasDateFilter = Object.keys(dateFilter).length > 0;

    const orderFilter = hasDateFilter ? { createdAt: dateFilter } : {};
    const inquiryFilter = hasDateFilter ? { createdAt: dateFilter } : {};
    const userFilter = hasDateFilter ? { createdAt: dateFilter } : {};

    const [
      totalOrders,
      totalRevenueResult,
      pendingOrders,
      totalInquiries,
      totalUsers,
    ] = await Promise.all([
      Order.countDocuments(orderFilter),
      Order.aggregate([
        { $match: { ...orderFilter, paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.countDocuments({ ...orderFilter, orderStatus: "pending" }),
      Inquiry.countDocuments(inquiryFilter),
      User.countDocuments(userFilter),
    ]);

    const totalRevenue = totalRevenueResult[0]?.total || 0;

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalInquiries,
      totalUsers,
      conversionRate:
        totalInquiries > 0
          ? ((totalOrders / totalInquiries) * 100).toFixed(2)
          : 0,
    });
  } catch (err) {
    console.error("[GET /api/analytics]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}