import { connectDB } from "../lib/mongodb";
import Artwork from "../models/Artwork";

const BASE_URL = "https://kalasamputah.com";

// Static routes with their priorities and change frequency
const STATIC_ROUTES = [
  { path: "/",        priority: 1.0, changefreq: "daily"   },
  { path: "/collect", priority: 0.9, changefreq: "daily"   },
  { path: "/info",    priority: 0.7, changefreq: "monthly" },
  { path: "/blog",    priority: 0.7, changefreq: "weekly"  },
  { path: "/artists", priority: 0.6, changefreq: "monthly" },
  { path: "/journal", priority: 0.6, changefreq: "weekly"  },
  { path: "/edits",   priority: 0.6, changefreq: "weekly"  },
  { path: "/privacy-policy",   priority: 0.3, changefreq: "yearly" },
  { path: "/shipping-policy",  priority: 0.3, changefreq: "yearly" },
  { path: "/returns-policy",   priority: 0.3, changefreq: "yearly" },
  { path: "/terms-of-service", priority: 0.3, changefreq: "yearly" },
];

export default async function sitemap() {
  // Static pages
  const staticEntries = STATIC_ROUTES.map(({ path, priority, changefreq }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: changefreq,
    priority,
  }));

  // Dynamic artwork pages
  let artworkEntries = [];
  try {
    await connectDB();
    const artworks = await Artwork.find({ status: { $ne: "archived" } })
      .select("_id updatedAt")
      .lean();

    artworkEntries = artworks.map((art) => ({
      url: `${BASE_URL}/artwork/${art._id}`,
      lastModified: art.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (err) {
    console.error("[SITEMAP] artwork fetch failed:", err);
  }

  return [...staticEntries, ...artworkEntries];
}
