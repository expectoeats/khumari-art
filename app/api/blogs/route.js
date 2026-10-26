import { NextResponse }   from "next/server";
import { connectDB }       from "../../../lib/mongodb";
import { getAdminSession } from "../../../lib/auth";
import BlogPost            from "../../../models/BlogPost";

// GET /api/blogs — public (only published unless admin)
export async function GET(req) {
  try {
    await connectDB();
    const session = getAdminSession();
    const filter  = session ? {} : { published: true };
    const posts   = await BlogPost.find(filter).sort({ createdAt: -1 }).limit(30).lean();
    return NextResponse.json(
      { posts },
      {
        headers: session
          ? { "Cache-Control": "private, no-cache" }
          : { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      }
    );
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/blogs — admin only
export async function POST(req) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();
    const post = await BlogPost.create(body);
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
