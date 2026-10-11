"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaArrowRight, FaHeart, FaRegHeart, FaSignOutAlt } from "react-icons/fa";

export default function ProfilePage() {
  const [user,      setUser]      = useState(null);
  const [wishlist,  setWishlist]  = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState("wishlist");

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, wlRes, inqRes] = await Promise.all([
          fetch("/api/user/me"),
          fetch("/api/user/wishlist"),
          fetch("/api/inquiries/mine").catch(() => ({ json: () => ({ inquiries: [] }) })),
        ]);

        if (!meRes.ok) { window.location.href = "/login"; return; }

        const [me, wl] = await Promise.all([meRes.json(), wlRes.json()]);
        setUser(me.user);
        setWishlist(wl.wishlist || []);
      } catch {
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/user/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", color: "#8B7355", fontSize: "1.1rem" }}>
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      <Navbar />

      {/* ── Profile hero ── */}
      <section
        className="py-14 md:py-20 px-6 md:px-10 border-b"
        style={{ borderColor: "#E8E4DE" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            {/* Avatar initials */}
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: "64px", height: "64px", borderRadius: "50%",
                background: "#1C1C1C", border: "2px solid #C9A96E",
              }}
            >
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", color: "#C9A96E", fontStyle: "italic" }}>
                {user.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>

            <div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.25rem" }}>
                Collector
              </p>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "1.8rem", color: "#1C1C1C", lineHeight: 1.1 }}>
                {user.name}
              </h1>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "0.9rem", color: "#8B7355", marginTop: "0.2rem" }}>
                {user.email}
              </p>
            </div>
          </div>

          {/* Stats + logout */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "2rem", color: "#1C1C1C", lineHeight: 1 }}>
                {wishlist.length}
              </p>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#8B7355", marginTop: "0.25rem" }}>
                Saved
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2"
              style={{
                fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em",
                textTransform: "uppercase", color: "#8B7355", background: "none", border: "1px solid #E8DDD0",
                padding: "0.55rem 1rem", cursor: "pointer", transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#1C1C1C"; e.currentTarget.style.color = "#1C1C1C"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8DDD0"; e.currentTarget.style.color = "#8B7355"; }}
            >
              <FaSignOutAlt className="text-xs" />
              Sign out
            </button>
          </div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <div
        className="sticky z-30 border-b"
        style={{ top: "64px", background: "rgba(253,250,245,0.95)", backdropFilter: "blur(8px)", borderColor: "#E8E4DE" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex gap-0">
          {["wishlist", "inquiries"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative py-4 px-5"
              style={{
                fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em",
                textTransform: "uppercase", color: tab === t ? "#1C1C1C" : "#8B7355",
                background: "none", border: "none", cursor: "pointer",
              }}
            >
              {t === "wishlist" ? `Wishlist (${wishlist.length})` : "Inquiries"}
              {tab === t && (
                <span className="absolute bottom-0 left-5 right-5" style={{ height: "2px", background: "#1C1C1C" }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">

        {/* Wishlist tab */}
        {tab === "wishlist" && (
          wishlist.length === 0 ? (
            <div className="text-center py-20">
              <FaRegHeart style={{ fontSize: "2rem", color: "#E8DDD0", marginBottom: "1rem", display: "block", margin: "0 auto 1rem" }} />
              <p style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "1.1rem", color: "#8B7355" }}>
                No saved artworks yet.
              </p>
              <Link
                href="/collect"
                className="btn-dark inline-flex items-center gap-2 px-8 py-3.5 mt-6"
              >
                Browse collection <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
          ) : (
            <div>
              <p className="section-title mb-8">Saved artworks</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {wishlist.map((id, i) => (
                  <WishlistCard key={id} artworkId={id} onRemove={() => setWishlist(w => w.filter(x => x !== id))} />
                ))}
              </div>
            </div>
          )
        )}

        {/* Inquiries tab */}
        {tab === "inquiries" && (
          <div className="text-center py-20">
            <p style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "1.1rem", color: "#8B7355" }}>
              Inquiry history coming soon.
            </p>
            <Link href="/info" className="btn-outline inline-flex items-center gap-2 px-8 py-3.5 mt-6">
              Contact studio <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

// ── Wishlist card — fetches artwork by ID from static data ──────────────────
function WishlistCard({ artworkId, onRemove }) {
  // For now use static data since artworks aren't seeded to MongoDB yet
  // This will auto-work once seed is done
  return (
    <div className="group hover-lift cursor-pointer flex flex-col">
      <div className="art-card-img relative aspect-[3/4] overflow-hidden mb-0 bg-brand-beige">
        <div className="absolute inset-0 flex items-center justify-center">
          <p style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "0.8rem", color: "#8B7355" }}>
            Artwork
          </p>
        </div>
      </div>
      <div className="px-3 pt-3 pb-4">
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#8B7355" }}>
          Saved artwork
        </p>
        <button
          onClick={onRemove}
          className="mt-2 text-[0.62rem] tracking-widest uppercase border-b border-brand-accent/40 pb-0.5"
          style={{ fontFamily: "'Jost', sans-serif", color: "#C9A96E", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
