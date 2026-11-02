import { NextResponse }                  from "next/server";
import { connectDB }                      from "../../../../lib/mongodb";
import User                               from "../../../../models/User";
import { signUserToken, USER_TOKEN_NAME, USER_MAX_AGE } from "../../../../lib/userAuth";
import { getClientIp, checkRateLimit } from "../../../../lib/rateLimit";

export async function POST(req) {
  try {
    const ip = getClientIp(req);

    // Rate Limit: Maximum 5 account creations per 1 hour per IP (anti-bot account creation)
    const rateLimit = checkRateLimit(`user-signup:${ip}`, 5, 60 * 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many signups from this IP. Please try again in ${Math.ceil(
            rateLimit.resetSeconds / 60
          )} minutes.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetSeconds),
          },
        }
      );
    }

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
