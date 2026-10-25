import { NextResponse }   from "next/server";
import { connectDB }      from "../../../../lib/mongodb";
import { getUserSession } from "../../../../lib/userAuth";
import User               from "../../../../models/User";

// PATCH /api/user/profile — update logged-in user's profile fields
export async function PATCH(req) {
  const session = getUserSession();
  if (!session) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  try {
    const body = await req.json();
    const { phone, whatsapp, address, city, country } = body;

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (phone !== undefined)  user.phone  = phone;
    if (whatsapp !== undefined) user.whatsapp = whatsapp;
    if (address !== undefined) user.address = address;
    if (city !== undefined)    user.city    = city;
    if (country !== undefined) user.country = country;

    await user.save();
    return NextResponse.json({ user: user.toSafeObject() }, { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/user/profile]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
