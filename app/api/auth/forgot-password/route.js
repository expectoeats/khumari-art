import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Admin from "../../../../models/Admin";
import User from "../../../../models/User";
import Otp from "../../../../models/Otp";
import { sendOtpEmail, sendPasswordChangedConfirmation } from "../../../../lib/brevo";
import { getClientIp, checkRateLimit } from "../../../../lib/rateLimit";

const PRIMARY_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "sikrinancy@gmail.com").toLowerCase();

export async function POST(req) {
  try {
    const ip = getClientIp(req);

    // Rate Limit: Max 6 requests per 10 minutes per IP
    const rateLimit = checkRateLimit(`forgot-pwd:${ip}`, 6, 10 * 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many requests. Please wait ${Math.ceil(
            rateLimit.resetSeconds / 60
          )} minutes before trying again.`,
        },
        { status: 429 }
      );
    }

    await connectDB();
    const body = await req.json();
    const { action, email, otp, newPassword } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ── STEP 1: REQUEST OTP ──
    if (action === "request-otp" || !action) {
      let role = null;
      let targetName = "";

      // Check if Admin
      const isAdminEmail =
        normalizedEmail === PRIMARY_ADMIN_EMAIL ||
        normalizedEmail === "admin@kalasamputah.com";

      let admin = null;
      if (isAdminEmail) {
        admin = await Admin.findOne({
          $or: [
            { email: normalizedEmail },
            { email: PRIMARY_ADMIN_EMAIL },
            { email: "admin@kalasamputah.com" },
          ],
        });
        role = "admin";
        targetName = admin?.name || "Nancy Sikri";
      } else {
        // Check if regular Admin exists in DB
        admin = await Admin.findOne({ email: normalizedEmail });
        if (admin) {
          role = "admin";
          targetName = admin.name || "Nancy Sikri";
        }
      }

      // If not Admin, check User collection
      let user = null;
      if (!role) {
        user = await User.findOne({ email: normalizedEmail });
        if (user) {
          role = "user";
          targetName = user.name || "Collector";
        }
      }

      // If neither Admin nor User exists
      if (!role) {
        return NextResponse.json(
          { error: "No account found associated with this email address." },
          { status: 404 }
        );
      }

      // Generate secure 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Clear any prior pending reset OTP for this email
      await Otp.deleteMany({ email: normalizedEmail, purpose: "forgot-password" });

      // Save new OTP
      await Otp.create({
        email: normalizedEmail,
        otp: generatedOtp,
        purpose: "forgot-password",
        role,
        expiresAt,
      });

      // Send OTP via Brevo API
      await sendOtpEmail({
        toEmail: normalizedEmail,
        toName: targetName,
        otp: generatedOtp,
        purpose: "forgot-password",
      });

      return NextResponse.json({
        success: true,
        message: "A 6-digit verification code has been sent to your email.",
        role,
      });
    }

    // ── STEP 2: VERIFY OTP & RESET PASSWORD ──
    if (action === "reset-password") {
      if (!otp || !newPassword) {
        return NextResponse.json(
          { error: "Verification code and new password are required." },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters." },
          { status: 400 }
        );
      }

      // Find matching valid OTP
      const otpRecord = await Otp.findOne({
        email: normalizedEmail,
        otp: otp.trim(),
        purpose: "forgot-password",
        expiresAt: { $gt: new Date() },
      });

      if (!otpRecord) {
        return NextResponse.json(
          { error: "Invalid or expired verification code. Please request a new code." },
          { status: 400 }
        );
      }

      let targetName = "";

      if (otpRecord.role === "admin") {
        let admin = await Admin.findOne({
          $or: [
            { email: normalizedEmail },
            { email: PRIMARY_ADMIN_EMAIL },
            { email: "admin@kalasamputah.com" },
          ],
        });

        if (!admin) {
          admin = new Admin({
            email: PRIMARY_ADMIN_EMAIL,
            password: newPassword,
            name: "Nancy Sikri",
          });
        } else {
          admin.password = newPassword;
        }
        await admin.save();
        targetName = admin.name || "Nancy Sikri";
      } else {
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
          return NextResponse.json(
            { error: "User account could not be found." },
            { status: 404 }
          );
        }
        user.password = newPassword;
        await user.save();
        targetName = user.name || "Collector";
      }

      // Clean up used OTP
      await Otp.deleteMany({ email: normalizedEmail, purpose: "forgot-password" });

      // Send confirmation email
      try {
        await sendPasswordChangedConfirmation({
          toEmail: normalizedEmail,
          toName: targetName,
        });
      } catch (e) {
        console.error("[Password Reset Confirmation Error]:", e);
      }

      return NextResponse.json({
        success: true,
        message: "Your password has been successfully updated. You can now sign in.",
        role: otpRecord.role,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("[FORGOT PASSWORD]", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
