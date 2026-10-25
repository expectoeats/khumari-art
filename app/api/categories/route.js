import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { getAdminSession } from "../../../lib/auth";
import Category from "../../../models/Category";

// GET /api/categories — public (for dropdowns)
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const onlyActive = searchParams.get("active") === "true";
    const filter = onlyActive ? { isActive: true } : {};
    const categories = await Category.find(filter).sort({ name: 1 });
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/categories — admin only
export async function POST(req) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    const slug =
      body.slug ||
      body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const category = await Category.create({ ...body, slug });
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}