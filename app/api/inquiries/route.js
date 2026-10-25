import { NextResponse }   from "next/server";
import { connectDB }       from "../../../lib/mongodb";
import { getAdminSession } from "../../../lib/auth";
import Inquiry             from "../../../models/Inquiry";

// GET /api/inquiries — admin only
export async function GET() {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json({ inquiries });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/inquiries — public (contact form submission)
export async function POST(req) {
  try {
    await connectDB();
    const body    = await req.json();
    const { name, email, phone, message, artworkId, artworkTitle, source } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "name, email and message are required" }, { status: 400 });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone: phone || "",
      message,
      artworkId,
      artworkTitle,
      source,
    });
    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
