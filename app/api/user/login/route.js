import { NextResponse }                  from "next/server";
import { connectDB }                      from "../../../../lib/mongodb";
import User                               from "../../../../models/User";
import { signUserToken, USER_TOKEN_NAME, USER_MAX_AGE } from "../../../../lib/userAuth";
import { getClientIp, checkRateLimit } from "../../../../lib/rateLimit";

export async function POST(req) {
  try {
    const ip = getClientIp(req);

    // Rate Limit: Maximum 8 user login attempts per 10 minutes per IP
    const rateLimit = checkRateLimit(`user-login:${ip}`, 8, 10 * 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Please wait ${Math.ceil(
            rateLimit.resetSeconds / 60
          )} minutes before trying again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetSeconds),
          },
        }
      );
    }

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
