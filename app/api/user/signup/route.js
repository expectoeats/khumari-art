import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/User";
import Otp from "../../../../models/Otp";
import { signUserToken, USER_TOKEN_NAME, USER_MAX_AGE } from "../../../../lib/userAuth";
import { sendOtpEmail } from "../../../../lib/brevo";
import { getClientIp, checkRateLimit } from "../../../../lib/rateLimit";

export async function POST(req) {
  try {
    const ip = getClientIp(req);

    // Rate Limit: Maximum 10 signup requests per 15 minutes per IP
    const rateLimit = checkRateLimit(`user-signup:${ip}`, 10, 15 * 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many attempts from this IP. Please wait ${Math.ceil(
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

    const body = await req.json();
    const { action, name, email, password, otp } = body;

    await connectDB();

    // ── STEP 1: REQUEST SIGNUP OTP ──
    if (action === "request-otp" || (!action && !otp)) {
      if (!name || !email || !password) {
        return NextResponse.json(
          { error: "Name, email and password are required" },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check if user already exists
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email is already registered. Please sign in." },
          { status: 409 }
        );
      }

      // Generate 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Clear any prior pending signup OTP for this email
      await Otp.deleteMany({ email: normalizedEmail, purpose: "signup" });

      // Save pending signup data with OTP
      await Otp.create({
        email: normalizedEmail,
        otp: generatedOtp,
        purpose: "signup",
        role: "user",
        userData: {
          name: name.trim(),
          password,
        },
        expiresAt,
      });

      // Send OTP via Brevo API
      await sendOtpEmail({
        toEmail: normalizedEmail,
        toName: name.trim(),
        otp: generatedOtp,
        purpose: "signup",
      });

      return NextResponse.json({
        success: true,
        requireOtp: true,
        message: "A 6-digit verification code has been sent to your email.",
      });
    }

    // ── STEP 2: VERIFY OTP AND CREATE USER ──
    if (action === "verify-otp" || otp) {
      if (!email || !otp) {
        return NextResponse.json(
          { error: "Email and verification code are required" },
          { status: 400 }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();

      const otpRecord = await Otp.findOne({
        email: normalizedEmail,
        otp: otp.trim(),
        purpose: "signup",
        expiresAt: { $gt: new Date() },
      });

      if (!otpRecord || !otpRecord.userData) {
        return NextResponse.json(
          { error: "Invalid or expired verification code. Please request a new code." },
          { status: 400 }
        );
      }

      // Check once more in case created in race condition
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        await Otp.deleteMany({ email: normalizedEmail, purpose: "signup" });
        return NextResponse.json(
          { error: "An account with this email is already registered." },
          { status: 409 }
        );
      }

      // Create user with verified details
      const user = await User.create({
        name: otpRecord.userData.name,
        email: normalizedEmail,
        password: otpRecord.userData.password,
      });

      // Remove OTP record
      await Otp.deleteMany({ email: normalizedEmail, purpose: "signup" });

      // Sign session JWT
      const token = signUserToken({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      });

      const res = NextResponse.json({ success: true, user: user.toSafeObject() }, { status: 201 });
      res.cookies.set(USER_TOKEN_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: USER_MAX_AGE,
        path: "/",
      });

      return res;
    }

    return NextResponse.json({ error: "Invalid signup action" }, { status: 400 });
  } catch (err) {
    console.error("[USER SIGNUP]", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
