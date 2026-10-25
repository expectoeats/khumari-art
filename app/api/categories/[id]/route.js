import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getAdminSession } from "../../../../lib/auth";
import Category from "../../../../models/Category";

// GET /api/categories/:id — public
export async function GET(_, { params }) {
  try {
    await connectDB();
    const category = await Category.findById(params.id);
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/categories/:id — admin only
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
    const category = await Category.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ category });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

// DELETE /api/categories/:id — admin only
export async function DELETE(_, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    await Category.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}