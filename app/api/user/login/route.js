import { NextResponse }                  from "next/server";
import { connectDB }                      from "../../../../lib/mongodb";
import User                               from "../../../../models/User";
import { signUserToken, USER_TOKEN_NAME, USER_MAX_AGE } from "../../../../lib/userAuth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const valid = await user.comparePassword(password);
    if (!valid)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const token = signUserToken({ id: user._id.toString(), email: user.email, name: user.name });

    const res = NextResponse.json({ user: user.toSafeObject() });
    res.cookies.set(USER_TOKEN_NAME, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   USER_MAX_AGE,
      path:     "/",
    });
    return res;
  } catch (err) {
    console.error("[USER LOGIN]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
