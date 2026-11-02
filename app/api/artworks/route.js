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
    const light    = searchParams.get("light") === "1";
    const limit = Math.min(parseInt(searchParams.get("limit") || "60", 10), 100);

    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (featured) filter.featured = featured === "true";

    // light=1 → only fields catalogue cards need (smaller payload for public pages).
    // Without it, full documents are returned so the admin edit form stays complete.
    const projection = light
      ? "title artist medium category year size color desc src featured images order"
      : "";

    const artworks = await Artwork.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .select(projection)
      .lean();

    return NextResponse.json(
      { artworks },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
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
