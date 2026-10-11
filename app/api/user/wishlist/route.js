import { NextResponse }   from "next/server";
import { connectDB }       from "../../../../lib/mongodb";
import { getUserSession }  from "../../../../lib/userAuth";
import User                from "../../../../models/User";

// GET — return user's wishlist artwork IDs
export async function GET() {
  const session = getUserSession();
  if (!session) return NextResponse.json({ wishlist: [] });

  try {
    await connectDB();
    const user = await User.findById(session.id).select("wishlist");
    return NextResponse.json({ wishlist: user?.wishlist || [] });
  } catch {
    return NextResponse.json({ wishlist: [] });
  }
}

// POST — toggle an artwork in wishlist { artworkId }
export async function POST(req) {
  const session = getUserSession();
  if (!session) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  try {
    const { artworkId } = await req.json();
    if (!artworkId) return NextResponse.json({ error: "artworkId required" }, { status: 400 });

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const idx = user.wishlist.indexOf(artworkId);
    if (idx === -1) {
      user.wishlist.push(artworkId);
    } else {
      user.wishlist.splice(idx, 1);
    }
    await user.save();

    return NextResponse.json({ wishlist: user.wishlist, added: idx === -1 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
