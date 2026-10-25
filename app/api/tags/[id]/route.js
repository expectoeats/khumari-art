import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getAdminSession } from "../../../../lib/auth";
import Tag from "../../../../models/Tag";

// GET /api/tags/:id — public
export async function GET(_, { params }) {
  try {
    await connectDB();
    const tag = await Tag.findById(params.id);
    if (!tag) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ tag });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/tags/:id — admin only
export async function PATCH(req, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();
    if (body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }
    const tag = await Tag.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!tag) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ tag });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

// DELETE /api/tags/:id — admin only
export async function DELETE(_, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    await Tag.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}