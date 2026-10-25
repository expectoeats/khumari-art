import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { getAdminSession } from "../../../lib/auth";
import SiteContent from "../../../models/SiteContent";
import { heroSlides } from "../../../components/data";

const DEFAULT_CONTENT = {
  hero: {
    slides: heroSlides,
  },
  artist: {
    name: "Nancy Sikri",
    title: "Abstract Painter · New Delhi, India",
    photo: "/art/811266960_18115098530070803_4087374646249167423_n.jpg",
    quote: "I don't paint what I see. I paint what I feel.",
    bio1: "Art chose Nancy long before she chose it. Growing up surrounded by creative energy, she found her voice in abstract expression — a language beyond words.",
    bio2: "Every canvas she creates is an invitation: to pause, feel, and discover something honest within yourself. Her work lives in the space between emotion and instinct.",
    stats: [
      { value: "256", label: "Original Works" },
      { value: "6.9k", label: "Followers" },
      { value: "7+", label: "Years Creating" },
    ],
    instagram: "https://www.instagram.com/kala_samputah",
  },
  announcement: {
    text: "New collection available — Inquire for pricing",
    whatsappNumber: "919818817291",
    studioEmail: "contact@kalasamputah.com",
    isVisible: true,
  },
  story: {
    title: "The Art of Raw Emotion",
    subtitle: "Story of the day",
    quote: "Every painting is a quiet conversation between the canvas and whatever cannot be put into words.",
    artworkTitle: "Embracing the Void Within",
    src: "/art/823606039_18116134385070803_3865341406544213906_n.jpg",
  },
};

// GET — public
export async function GET() {
  try {
    await connectDB();
    const docs = await SiteContent.find();
    const content = { ...DEFAULT_CONTENT };

    docs.forEach(doc => {
      content[doc.key] = doc.value;
    });

    return NextResponse.json({ content });
  } catch {
    // If DB unavailable, return defaults safely
    return NextResponse.json({ content: DEFAULT_CONTENT });
  }
}

// POST — admin only (update a section: { key, value })
export async function POST(req) {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { key, value } = await req.json();

    if (!key || value === undefined) {
      return NextResponse.json({ error: "key and value are required" }, { status: 400 });
    }

    const doc = await SiteContent.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, doc });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
