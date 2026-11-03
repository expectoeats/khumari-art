import { NextResponse } from "next/server";
import { connectDB }    from "../../../../lib/mongodb";
import Admin            from "../../../../models/Admin";
import { signToken, TOKEN_NAME, MAX_AGE } from "../../../../lib/auth";
import { getClientIp, checkRateLimit } from "../../../../lib/rateLimit";

const PRIMARY_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "sikrinancy@gmail.com").toLowerCase();

export async function POST(req) {
  try {
    const ip = getClientIp(req);

    // Rate Limit: Maximum 5 login attempts per 15 minutes per IP
    const rateLimit = checkRateLimit(`admin-login:${ip}`, 5, 15 * 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed attempts. Admin portal is locked for this IP for ${Math.ceil(
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

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();

    // Check if admin exists by provided email or primary Nancy email
    let admin = await Admin.findOne({
      $or: [
        { email: normalizedEmail },
        { email: PRIMARY_ADMIN_EMAIL },
        { email: "admin@kalasamputah.com" },
      ],
    });

    const envPassword = process.env.ADMIN_PASSWORD || "KalaSamputah@2026";

    if (!admin) {
      // Auto-create Nancy Sikri admin
      if (
        (normalizedEmail === PRIMARY_ADMIN_EMAIL || normalizedEmail === "admin@kalasamputah.com") &&
        password === envPassword
      ) {
        admin = new Admin({
          email: PRIMARY_ADMIN_EMAIL,
          password: envPassword,
          name: "Nancy Sikri",
        });
        await admin.save();
      } else {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    } else if (admin.email !== PRIMARY_ADMIN_EMAIL && normalizedEmail === PRIMARY_ADMIN_EMAIL) {
      // Migrate admin document to primary Nancy Sikri email
      admin.email = PRIMARY_ADMIN_EMAIL;
      admin.name = "Nancy Sikri";
      await admin.save();
    }

    const valid = await admin.comparePassword(password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: admin._id.toString(), email: admin.email });

    const res = NextResponse.json({
      success: true,
      admin: { email: admin.email, name: admin.name || "Nancy Sikri" },
    });
    res.cookies.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   MAX_AGE,
      path:     "/",
    });
    return res;
  } catch (err) {
    console.error("[ADMIN LOGIN]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
