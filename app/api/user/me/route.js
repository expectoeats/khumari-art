import { NextResponse }     from "next/server";
import { connectDB }         from "../../../../lib/mongodb";
import { getUserSession }    from "../../../../lib/userAuth";
import User                  from "../../../../models/User";

export async function GET() {
  const session = getUserSession();
  if (!session) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  try {
    await connectDB();
    const user = await User.findById(session.id).select("-password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
