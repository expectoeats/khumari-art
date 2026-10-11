import { NextResponse }   from "next/server";
import { connectDB }       from "../../../../lib/mongodb";
import { getAdminSession } from "../../../../lib/auth";
import Inquiry             from "../../../../models/Inquiry";

// PATCH /api/inquiries/:id — update status (admin only)
export async function PATCH(req, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const { status } = await req.json();
    const inquiry = await Inquiry.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );
    if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ inquiry });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/inquiries/:id — admin only
export async function DELETE(_, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    await Inquiry.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
