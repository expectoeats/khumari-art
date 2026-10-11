import { NextResponse } from "next/server";
import { connectDB }    from "../../../../lib/mongodb";
import Admin            from "../../../../models/Admin";
import { signToken, TOKEN_NAME, MAX_AGE } from "../../../../lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    await connectDB();

    // Check if any admin exists — if not, seed the first one from env
    let admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      // Auto-create admin from env on first run
      const envEmail    = process.env.ADMIN_EMAIL;
      const envPassword = process.env.ADMIN_PASSWORD;

      if (
        email.toLowerCase() === envEmail?.toLowerCase() &&
        password === envPassword
      ) {
        admin = new Admin({ email: envEmail.toLowerCase(), password: envPassword, name: "Admin" });
        await admin.save();
      } else {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    }

    const valid = await admin.comparePassword(password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: admin._id.toString(), email: admin.email });

    const res = NextResponse.json({ success: true, admin: { email: admin.email, name: admin.name } });
    res.cookies.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   MAX_AGE,
      path:     "/",
    });
    return res;
  } catch (err) {
    console.error("[AUTH LOGIN]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
