import { NextResponse }   from "next/server";
import { connectDB }       from "../../../lib/mongodb";
import { getAdminSession } from "../../../lib/auth";
import Artwork             from "../../../models/Artwork";
import BlogPost            from "../../../models/BlogPost";
import Inquiry             from "../../../models/Inquiry";
import User                from "../../../models/User";
import Order               from "../../../models/Order";

export async function GET() {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();

    const [
      totalArtworks,
      featuredArtworks,
      totalBlogs,
      publishedBlogs,
      totalInquiries,
      newInquiries,
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
    ] = await Promise.all([
      Artwork.countDocuments(),
      Artwork.countDocuments({ featured: true }),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ published: true }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: "new" }),
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.countDocuments({ orderStatus: "pending" }),
    ]);

    return NextResponse.json({
      artworks:  { total: totalArtworks,  featured: featuredArtworks },
      blogs:     { total: totalBlogs,     published: publishedBlogs  },
      inquiries: { total: totalInquiries, new: newInquiries          },
      users:     { total: totalUsers                                  },
      orders:    {
        total:    totalOrders,
        revenue:  totalRevenue[0]?.total || 0,
        pending:  pendingOrders,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
