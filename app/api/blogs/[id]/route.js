import { NextResponse }   from "next/server";
import mongoose           from "mongoose";
import { connectDB }       from "../../../../lib/mongodb";
import { getAdminSession } from "../../../../lib/auth";
import BlogPost            from "../../../../models/BlogPost";

export async function GET(_, { params }) {
  try {
    await connectDB();
    let post = null;
    if (mongoose.Types.ObjectId.isValid(params.id)) {
      post = await BlogPost.findById(params.id);
    }
    if (!post) {
      post = await BlogPost.findOne({ slug: params.id });
    }
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();
    const post = await BlogPost.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    await BlogPost.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
