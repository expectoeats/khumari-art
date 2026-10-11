import { NextResponse }    from "next/server";
import { connectDB }        from "../../../lib/mongodb";
import { getAdminSession }  from "../../../lib/auth";
import Artwork              from "../../../models/Artwork";

// GET /api/artworks — public
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const filter = {};
    if (category) filter.category = category;
    if (featured)  filter.featured = featured === "true";

    const artworks = await Artwork.find(filter).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ artworks });
  } catch (err) {
    console.error("[GET /api/artworks]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/artworks — admin only
export async function POST(req) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body    = await req.json();
    const artwork = await Artwork.create(body);
    return NextResponse.json({ artwork }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/artworks]", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
