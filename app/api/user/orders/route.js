import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getUserSession } from "../../../../lib/userAuth";
import User from "../../../../models/User";
import Order from "../../../../models/Order";
import Inquiry from "../../../../models/Inquiry";

export async function GET() {
  const session = getUserSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const user = await User.findById(session.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const emailRegex = new RegExp(`^${user.email.trim()}$`, "i");

    const [orders, inquiries] = await Promise.all([
      Order.find({
        $or: [{ customerEmail: emailRegex }, { userId: session.id }],
      }).sort({ createdAt: -1 }),
      Inquiry.find({
        $or: [{ email: emailRegex }, { userId: session.id }],
      }).sort({ createdAt: -1 }),
    ]);

    return NextResponse.json({ orders, inquiries });
  } catch (err) {
    console.error("[GET /api/user/orders]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
