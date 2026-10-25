import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getUserSession } from "../../../../lib/userAuth";
import User from "../../../../models/User";
import Inquiry from "../../../../models/Inquiry";

export async function GET() {
  const session = getUserSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const user = await User.findById(session.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const emailRegex = new RegExp(`^${user.email.trim()}$`, "i");
    const inquiries = await Inquiry.find({
      $or: [{ email: emailRegex }, { userId: session.id }],
    }).sort({ createdAt: -1 });

    return NextResponse.json({ inquiries });
  } catch (err) {
    console.error("[GET /api/inquiries/mine]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
