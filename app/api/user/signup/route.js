import { NextResponse }                  from "next/server";
import { connectDB }                      from "../../../../lib/mongodb";
import User                               from "../../../../models/User";
import { signUserToken, USER_TOKEN_NAME, USER_MAX_AGE } from "../../../../lib/userAuth";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });

    if (password.length < 6)
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const user  = await User.create({ name, email, password });
    const token = signUserToken({ id: user._id.toString(), email: user.email, name: user.name });

    const res = NextResponse.json({ user: user.toSafeObject() }, { status: 201 });
    res.cookies.set(USER_TOKEN_NAME, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   USER_MAX_AGE,
      path:     "/",
    });
    return res;
  } catch (err) {
    console.error("[USER SIGNUP]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
