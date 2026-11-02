import { NextResponse }   from "next/server";
import { connectDB }       from "../../../lib/mongodb";
import { getAdminSession } from "../../../lib/auth";
import Inquiry             from "../../../models/Inquiry";
import { getClientIp, checkRateLimit, isSpamContent } from "../../../lib/rateLimit";

// GET /api/inquiries — admin only
export async function GET() {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json({ inquiries });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/inquiries — public (contact form submission & artwork quotes)
export async function POST(req) {
  try {
    const ip = getClientIp(req);

    // 1. Rate Limit Protection: Maximum 5 inquiry submissions per 10 minutes per IP
    const rateLimit = checkRateLimit(`inquiry:${ip}`, 5, 10 * 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many submissions. Please wait ${rateLimit.resetSeconds} seconds before sending another message.`,
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
    const { name, email, phone, message, artworkId, artworkTitle, source } = body;

    // 2. Honeypot check (if bot filled hidden field)
    if (body.website_hp || body.company_address) {
      // Silently return success to fool spam bots without saving to DB
      return NextResponse.json({ success: true, message: "Inquiry received" }, { status: 200 });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
    }

    // 3. Automated Spam Content Filtering
    const spamCheck = isSpamContent({ name, email, message });
    if (spamCheck.isSpam) {
      return NextResponse.json(
        { error: `Message flagged as potential spam: ${spamCheck.reason}` },
        { status: 400 }
      );
    }

    await connectDB();

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      message: message.trim(),
      artworkId,
      artworkTitle,
      source: source || "website",
    });

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
