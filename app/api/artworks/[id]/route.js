import { NextResponse }   from "next/server";
import mongoose           from "mongoose";
import { connectDB }       from "../../../../lib/mongodb";
import { getAdminSession } from "../../../../lib/auth";
import Artwork             from "../../../../models/Artwork";

// GET /api/artworks/:id — public
export async function GET(_, { params }) {
  try {
    await connectDB();
    let artwork = null;
    if (mongoose.Types.ObjectId.isValid(params.id)) {
      artwork = await Artwork.findById(params.id);
    }
    if (!artwork) {
      // Try finding by slug or numeric id match in title
      artwork = await Artwork.findOne({
        $or: [
          { slug: params.id },
          { _id: mongoose.Types.ObjectId.isValid(params.id) ? params.id : undefined },
        ].filter(Boolean)
      });
    }
    if (!artwork) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ artwork });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT /api/artworks/:id — admin only
export async function PUT(req, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body    = await req.json();
    const artwork = await Artwork.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!artwork) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ artwork });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

// DELETE /api/artworks/:id — admin only
export async function DELETE(_, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    await Artwork.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
