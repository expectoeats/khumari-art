import { NextResponse } from "next/server";
import mongoose           from "mongoose";
import { connectDB }       from "../../../../lib/mongodb";
import Artwork             from "../../../../models/Artwork";

// Always render on demand — this route reads request.url and queries the DB.
export const dynamic = "force-dynamic";

// GET /api/artworks/batch?ids=1,2,3 — public, card fields only.
// Lets wishlist grids resolve many artworks in a single request.
// (Static segment "batch" takes precedence over dynamic [id] in App Router.)
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const ids = (searchParams.get("ids") || "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => mongoose.Types.ObjectId.isValid(s))
      .slice(0, 50);

    if (!ids.length) return NextResponse.json({ artworks: [] });

    const artworks = await Artwork.find({ _id: { $in: ids } })
      .select("title artist medium category year size color desc src featured images order")
      .lean();

    return NextResponse.json({ artworks });
  } catch (err) {
    console.error("[GET /api/artworks/batch]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
