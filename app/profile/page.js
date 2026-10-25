"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { allWorks } from "../../components/data";
import { FaArrowRight, FaHeart, FaRegHeart, FaSignOutAlt } from "react-icons/fa";
import { useArtModal } from "../../components/ArtModalContext";

export default function ProfilePage() {
  const [user,      setUser]      = useState(null);
  const [wishlist,  setWishlist]  = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState("wishlist");
  const [saving,    setSaving]    = useState(false);
  const [savedMsg,  setSavedMsg]  = useState("");

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

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSavedMsg("");
    try {
      const res = await fetch("/api/user/profile", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone:    document.getElementById("profile-phone")?.value || "",
          whatsapp: document.getElementById("profile-whatsapp")?.value || "",
          address:  document.getElementById("profile-address")?.value || "",
          city:     document.getElementById("profile-city")?.value || "",
          country:  document.getElementById("profile-country")?.value || "",
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setUser(data.user);
      setSavedMsg("Details saved successfully.");
    } catch {
      setSavedMsg("Could not save details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/user/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontStyle: "italic", color: "#8B7355", fontSize: "1.1rem" }}>
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
              <span style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "1.4rem", color: "#C9A96E", fontStyle: "italic" }}>
                {user.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>

            <div>
              <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.25rem" }}>
                Collector
              </p>
              <h1 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontWeight: 400, fontSize: "1.8rem", color: "#1C1C1C", lineHeight: 1.1 }}>
                {user.name}
              </h1>
              <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontStyle: "italic", fontSize: "0.9rem", color: "#8B7355", marginTop: "0.2rem" }}>
                {user.email}
              </p>
            </div>
          </div>

          {/* Stats + logout */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 400, fontSize: "2rem", color: "#1C1C1C", lineHeight: 1 }}>
                {wishlist.length}
              </p>
              <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#8B7355", marginTop: "0.25rem" }}>
                Saved
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2"
              style={{
                fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.65rem", letterSpacing: "0.18em",
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
                fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.65rem", letterSpacing: "0.2em",
                textTransform: "uppercase", color: tab === t ? "#1C1C1C" : "#8B7355",
                background: "none", border: "none", cursor: "pointer",
              }}
            >
              {t === "wishlist" ? `Wishlist (${wishlist.length})` : t === "inquiries" ? "Inquiries" : "Account Details"}
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
              <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontStyle: "italic", fontSize: "1.1rem", color: "#8B7355" }}>
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
            <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontStyle: "italic", fontSize: "1.1rem", color: "#8B7355" }}>
              Inquiry history coming soon.
            </p>
            <Link href="/info" className="btn-outline inline-flex items-center gap-2 px-8 py-3.5 mt-6">
              Contact studio <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
        )}

        {/* Account Details tab */}
        {tab === "account" && (
          <div className="space-y-6">
            <p className="section-title mb-8">Collector details</p>
            <p className="text-sm text-brand-muted font-sans mb-6">
              Fill these once and they auto-fill across every inquiry form on the site.
            </p>

            {savedMsg && (
              <p className="text-sm font-sans text-emerald-700 bg-emerald-50 px-4 py-3 rounded border border-emerald-100">
                {savedMsg}
              </p>
            )}

            <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-[0.68rem] tracking-wider uppercase text-brand-dark font-sans font-medium mb-1">Phone</label>
                <input
                  id="profile-phone"
                  type="tel"
                  defaultValue={user.phone || ""}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded border border-[#DFD6C8] bg-white focus:outline-none focus:border-brand-accent text-sm text-brand-dark font-sans disabled:bg-[#F2EEE6]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[0.68rem] tracking-wider uppercase text-brand-dark font-sans font-medium mb-1">WhatsApp</label>
                <input
                  id="profile-whatsapp"
                  type="tel"
                  defaultValue={user.whatsapp || ""}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded border border-[#DFD6C8] bg-white focus:outline-none focus:border-brand-accent text-sm text-brand-dark font-sans disabled:bg-[#F2EEE6]"
                />
              </div>
              <div className="md:col-span-3 space-y-2">
                <label className="block text-[0.68rem] tracking-wider uppercase text-brand-dark font-sans font-medium mb-1">Address</label>
                <input
                  id="profile-address"
                  type="text"
                  defaultValue={user.address || ""}
                  placeholder="Flat 4B, Rose Apartments, Connaught Place, New Delhi"
                  className="w-full px-3.5 py-2.5 rounded border border-[#DFD6C8] bg-white focus:outline-none focus:border-brand-accent text-sm text-brand-dark font-sans disabled:bg-[#F2EEE6]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[0.68rem] tracking-wider uppercase text-brand-dark font-sans font-medium mb-1">City</label>
                <input
                  id="profile-city"
                  type="text"
                  defaultValue={user.city || ""}
                  placeholder="New Delhi"
                  className="w-full px-3.5 py-2.5 rounded border border-[#DFD6C8] bg-white focus:outline-none focus:border-brand-accent text-sm text-brand-dark font-sans disabled:bg-[#F2EEE6]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[0.68rem] tracking-wider uppercase text-brand-dark font-sans font-medium mb-1">Country</label>
                <input
                  id="profile-country"
                  type="text"
                  defaultValue={user.country || ""}
                  placeholder="India"
                  className="w-full px-3.5 py-2.5 rounded border border-[#DFD6C8] bg-white focus:outline-none focus:border-brand-accent text-sm text-brand-dark font-sans disabled:bg-[#F2EEE6]"
                />
              </div>
              <div className="md:col-span-3 flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 px-6 bg-brand-dark hover:bg-brand-warm text-brand-cream rounded text-xs tracking-widest uppercase font-sans font-medium transition-all shadow hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving…" : "Save Details"}
                </button>
                <button
                  type="button"
                  onClick={() => setSavedMsg("")}
                  className="px-6 py-3 rounded border border-[#DFD6C8] bg-white text-brand-dark text-xs tracking-widest uppercase font-sans font-medium transition-colors hover:bg-[#F2EEE6]"
                >
                  Clear message
                </button>
              </div>
            </form>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

// ── Wishlist card — fetches artwork by ID from static data or database ──────
function WishlistCard({ artworkId, onRemove }) {
  const { openArtwork } = useArtModal();
  const idStr = typeof artworkId === "object" && artworkId !== null ? (artworkId._id || artworkId.id) : artworkId;

  const [artwork, setArtwork] = useState(() => {
    if (typeof artworkId === "object" && artworkId !== null && (artworkId.src || artworkId.title)) {
      return artworkId;
    }
    return allWorks.find(w => String(w.id) === String(idStr) || String(w._id) === String(idStr) || String(w.title) === String(idStr)) || null;
  });

  useEffect(() => {
    if (!artwork && idStr) {
      let active = true;
      fetch(`/api/artworks/${idStr}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (active && data?.artwork) {
            setArtwork(data.artwork);
          }
        })
        .catch(() => {});
      return () => { active = false; };
    }
  }, [idStr, artwork]);

  const handleRemove = async (e) => {
    e.stopPropagation();
    try {
      await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkId: idStr }),
      });
      onRemove();
    } catch {}
  };

  if (!artwork) {
    return (
      <div className="group hover-lift cursor-pointer flex flex-col">
        <div className="art-card-img relative aspect-[3/4] overflow-hidden mb-0 bg-brand-beige flex items-center justify-center p-4 text-center">
          <p style={{ fontStyle: "italic", fontSize: "0.8rem", color: "#8B7355" }}>
            Loading artwork…
          </p>
        </div>
        <div className="px-3 pt-3 pb-4 flex items-center justify-between">
          <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#8B7355" }}>
            Saved
          </p>
          <button
            onClick={handleRemove}
            className="text-[0.62rem] tracking-widest uppercase"
            style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', color: "#C9A96E", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  const imageSrc = artwork.src || (artwork.images && artwork.images[0]?.src) || "/art/823606039_18116134385070803_3865341406544213906_n.jpg";

  return (
    <div
      className="group hover-lift cursor-pointer flex flex-col"
      onClick={() => openArtwork(artwork)}
    >
      <div className="art-card-img relative aspect-[3/4] overflow-hidden mb-0 bg-brand-beige">
        <Image
          src={imageSrc}
          alt={artwork.title || "Artwork"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Remove button overlay */}
        <button
          onClick={handleRemove}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 hover:bg-red-50 shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          title="Remove from wishlist"
        >
          <FaHeart className="text-red-500 text-xs" />
        </button>
      </div>
      <div className="px-3 pt-3 pb-4">
        <h4 className="font-display text-sm text-brand-dark truncate leading-snug">
          {artwork.title}
        </h4>
        <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#8B7355", marginTop: "0.25rem" }}>
          {artwork.medium || "Original Artwork"} {artwork.size ? `· ${artwork.size}` : ""}
        </p>
      </div>
    </div>
  );
}
