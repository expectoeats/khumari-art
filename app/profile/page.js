"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { allWorks } from "../../components/data";
import { FaArrowRight, FaHeart, FaRegHeart, FaSignOutAlt, FaWhatsapp, FaClock, FaCheckCircle, FaInbox } from "react-icons/fa";
import { useArtModal } from "../../components/ArtModalContext";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("wishlist");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("919818817291");

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, wlRes, ordRes, cntRes] = await Promise.all([
          fetch("/api/user/me"),
          fetch("/api/user/wishlist"),
          fetch("/api/user/orders").catch(() => ({ ok: false })),
          fetch("/api/content").catch(() => ({ ok: false })),
        ]);

        if (!meRes.ok) {
          window.location.href = "/login";
          return;
        }

        const [me, wl] = await Promise.all([meRes.json(), wlRes.json()]);
        setUser(me.user);
        setWishlist(wl.wishlist || []);

        if (ordRes.ok) {
          const ordData = await ordRes.json();
          setOrders(ordData.orders || []);
          setInquiries(ordData.inquiries || []);
        }

        if (cntRes.ok) {
          const cntData = await cntRes.json();
          if (cntData.content?.contact?.whatsappNumber) {
            setWhatsappNumber(cntData.content.contact.whatsappNumber.replace(/[^0-9]/g, ""));
          }
        }
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
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: document.getElementById("profile-phone")?.value || "",
          whatsapp: document.getElementById("profile-whatsapp")?.value || "",
          address: document.getElementById("profile-address")?.value || "",
          city: document.getElementById("profile-city")?.value || "",
          country: document.getElementById("profile-country")?.value || "",
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
          <p
            style={{
              fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
              fontStyle: "italic",
              color: "#8B7355",
              fontSize: "1.1rem",
            }}
          >
            Loading Collector Profile…
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const totalHistoryCount = orders.length + inquiries.length;

  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      <Navbar />

      {/* ── Profile hero ── */}
      <section
        className="py-14 md:py-20 px-6 md:px-10 border-b"
        style={{ borderColor: "#E8E4DE" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="section-title mb-2">Private Collector Studio</p>
            <h1
              style={{
                fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif',
                fontWeight: 300,
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                color: "#1C1C1C",
                letterSpacing: "0.02em",
                lineHeight: 1.1,
              }}
            >
              {user.name}
            </h1>
            <p
              style={{
                fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: "0.95rem",
                color: "#8B7355",
                marginTop: "0.4rem",
              }}
            >
              {user.email}
              {user.city ? ` · ${user.city}` : ""}
            </p>
          </div>

          {/* Stats & signout */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p
                style={{
                  fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 400,
                  fontSize: "2rem",
                  color: "#1C1C1C",
                  lineHeight: 1,
                }}
              >
                {wishlist.length}
              </p>
              <p
                style={{
                  fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: "0.58rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#8B7355",
                  marginTop: "0.25rem",
                }}
              >
                Saved
              </p>
            </div>

            <div className="text-center">
              <p
                style={{
                  fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 400,
                  fontSize: "2rem",
                  color: "#1C1C1C",
                  lineHeight: 1,
                }}
              >
                {totalHistoryCount}
              </p>
              <p
                style={{
                  fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: "0.58rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#8B7355",
                  marginTop: "0.25rem",
                }}
              >
                Inquiries
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2"
              style={{
                fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8B7355",
                background: "none",
                border: "1px solid #E8DDD0",
                padding: "0.55rem 1rem",
                cursor: "pointer",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#1C1C1C";
                e.currentTarget.style.color = "#1C1C1C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E8DDD0";
                e.currentTarget.style.color = "#8B7355";
              }}
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
        style={{
          top: "64px",
          background: "rgba(253,250,245,0.95)",
          backdropFilter: "blur(8px)",
          borderColor: "#E8E4DE",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex gap-1 sm:gap-2">
          {[
            { id: "wishlist", label: `Wishlist (${wishlist.length})` },
            { id: "inquiries", label: `Inquiries & Orders (${totalHistoryCount})` },
            { id: "account", label: "Collector Details" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="relative py-4 px-3 sm:px-5 font-sans font-medium text-xs tracking-wider uppercase transition-colors"
              style={{
                color: tab === t.id ? "#1C1C1C" : "#8B7355",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {t.label}
              {tab === t.id && (
                <span
                  className="absolute bottom-0 left-3 right-3 sm:left-5 sm:right-5"
                  style={{ height: "2px", background: "#1C1C1C" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        {/* Wishlist tab */}
        {tab === "wishlist" &&
          (wishlist.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#E8DDD0] p-8 max-w-xl mx-auto">
              <FaRegHeart className="text-4xl text-[#C9A96E]/50 mx-auto mb-4" />
              <h3 className="font-display text-2xl text-brand-dark mb-2">
                No saved artworks yet
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted font-sans mb-6">
                Explore Nancy Sikri's original acrylic pieces and save works you feel drawn to.
              </p>
              <Link
                href="/collect"
                className="btn-dark inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-widest uppercase font-sans font-medium"
              >
                Browse collection <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
          ) : (
            <div>
              <p className="section-title mb-8">Saved artworks</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {wishlist.map((id) => (
                  <WishlistCard
                    key={typeof id === "object" ? id._id || id.id : id}
                    artworkId={id}
                    onRemove={() =>
                      setWishlist((w) =>
                        w.filter((x) => (typeof x === "object" ? x._id !== id : x !== id))
                      )
                    }
                  />
                ))}
              </div>
            </div>
          ))}

        {/* Orders & Inquiries tab */}
        {tab === "inquiries" && (
          <div>
            <div className="mb-8">
              <p className="section-title mb-1">Acquisition Archive</p>
              <h2 className="font-display text-2xl md:text-3xl text-brand-dark">
                Your Studio Inquiries & Orders
              </h2>
              <p className="text-xs text-brand-muted font-sans mt-1">
                Records of your acquisition requests, quote discussions, and completed artworks.
              </p>
            </div>

            {totalHistoryCount === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#E8DDD0] p-8 max-w-xl mx-auto">
                <FaInbox className="text-4xl text-[#C9A96E]/50 mx-auto mb-4" />
                <h3 className="font-display text-2xl text-brand-dark mb-2">
                  No inquiries placed yet
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted font-sans mb-6">
                  You haven't submitted any artwork inquiries or quotes. When you inquire on any artwork, you'll be able to track your conversations here.
                </p>
                <Link
                  href="/collect"
                  className="btn-dark inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-widest uppercase font-sans font-medium"
                >
                  Explore Studio Artworks <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Orders Section if any */}
                {orders.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-brand-dark font-sans font-semibold mb-3">
                      Confirmed Orders ({orders.length})
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {orders.map((ord) => (
                        <div
                          key={ord._id}
                          className="bg-white p-6 rounded-xl border border-[#EAE2D5] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-semibold text-brand-accent">
                                #{ord.orderNumber || ord._id.slice(-6).toUpperCase()}
                              </span>
                              <span
                                className={`text-[0.62rem] uppercase tracking-wider px-2 py-0.5 rounded font-sans font-semibold ${
                                  ord.paymentStatus === "paid"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {ord.paymentStatus || "pending"}
                              </span>
                              <span className="text-[0.62rem] uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-sans">
                                {ord.orderStatus || "processing"}
                              </span>
                            </div>
                            <h4 className="font-display text-lg text-brand-dark">
                              {ord.artworkTitle || "Custom Commission Artwork"}
                            </h4>
                            <p className="text-xs text-brand-muted font-sans mt-0.5">
                              Ordered on{" "}
                              {new Date(ord.createdAt).toLocaleDateString("en-US", {
                                dateStyle: "medium",
                              })}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            {ord.totalAmount && (
                              <div className="text-right">
                                <span className="text-xs uppercase tracking-wider text-brand-muted font-sans block">
                                  Amount
                                </span>
                                <span className="text-base font-semibold text-brand-dark font-sans">
                                  ₹{ord.totalAmount.toLocaleString()}
                                </span>
                              </div>
                            )}
                            <a
                              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                                `Hello Nancy, following up on Order #${ord.orderNumber || ord._id}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#25D366] text-white text-xs font-sans font-medium hover:bg-[#1EBE5D] transition-colors"
                            >
                              <FaWhatsapp className="text-sm" />
                              <span>Order Chat</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inquiries Section */}
                {inquiries.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-brand-dark font-sans font-semibold mb-3">
                      Studio Quote Inquiries ({inquiries.length})
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {inquiries.map((inq) => (
                        <div
                          key={inq._id}
                          className="bg-white p-5 sm:p-6 rounded-xl border border-[#EAE2D5] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[0.62rem] uppercase tracking-wider px-2 py-0.5 rounded font-sans font-semibold ${
                                  inq.status === "replied"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : inq.status === "read"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-[#F5EFE6] text-brand-dark"
                                }`}
                              >
                                {inq.status === "replied" ? "Replied by Studio" : inq.status === "read" ? "Reviewed" : "In Review"}
                              </span>
                              <span className="text-xs text-brand-muted font-sans">
                                {new Date(inq.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>

                            <h4 className="font-display text-base sm:text-lg text-brand-dark">
                              {inq.artworkTitle ? `Inquiry for "${inq.artworkTitle}"` : "General Studio Inquiry"}
                            </h4>
                            <p className="text-xs text-[#5C5247] font-sans line-clamp-2 max-w-xl">
                              "{inq.message || "Requested availability and quotation."}"
                            </p>
                          </div>

                          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                            <a
                              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                                `Hello Nancy, following up on my inquiry for: ${inq.artworkTitle || "Studio Artwork"}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#25D366] text-white text-xs font-sans font-medium hover:bg-[#1EBE5D] transition-colors shadow-sm"
                            >
                              <FaWhatsapp className="text-sm" />
                              <span>WhatsApp Studio</span>
                            </a>
                            {inq.artworkId && (
                              <Link
                                href={`/artwork/${inq.artworkId}`}
                                className="text-xs uppercase tracking-wider font-sans text-brand-accent hover:text-brand-dark underline"
                              >
                                View Artwork
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Account Details tab */}
        {tab === "account" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <p className="section-title mb-1">Collector Details</p>
              <h2 className="font-display text-2xl md:text-3xl text-brand-dark">
                Your Contact Information
              </h2>
              <p className="text-xs text-brand-muted font-sans mt-1">
                Fill these once and they will automatically pre-fill across all future quote inquiries and authentication forms.
              </p>
            </div>

            {savedMsg && (
              <p className="text-xs font-sans text-emerald-800 bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-200">
                {savedMsg}
              </p>
            )}

            <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 sm:p-8 rounded-xl border border-[#EAE2D5] shadow-sm">
              <div className="space-y-1.5">
                <label className="block text-[0.68rem] tracking-wider uppercase text-brand-dark font-sans font-semibold">
                  Phone Number
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  defaultValue={user.phone || ""}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFD6C8] bg-white focus:outline-none focus:border-brand-accent text-sm text-brand-dark font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[0.68rem] tracking-wider uppercase text-brand-dark font-sans font-semibold">
                  WhatsApp Number
                </label>
                <input
                  id="profile-whatsapp"
                  type="tel"
                  defaultValue={user.whatsapp || ""}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFD6C8] bg-white focus:outline-none focus:border-brand-accent text-sm text-brand-dark font-sans"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[0.68rem] tracking-wider uppercase text-brand-dark font-sans font-semibold">
                  Delivery Address / Studio Gallery
                </label>
                <input
                  id="profile-address"
                  type="text"
                  defaultValue={user.address || ""}
                  placeholder="Apartment, Street address, Landmark"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFD6C8] bg-white focus:outline-none focus:border-brand-accent text-sm text-brand-dark font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[0.68rem] tracking-wider uppercase text-brand-dark font-sans font-semibold">
                  City
                </label>
                <input
                  id="profile-city"
                  type="text"
                  defaultValue={user.city || ""}
                  placeholder="New Delhi"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFD6C8] bg-white focus:outline-none focus:border-brand-accent text-sm text-brand-dark font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[0.68rem] tracking-wider uppercase text-brand-dark font-sans font-semibold">
                  Country
                </label>
                <input
                  id="profile-country"
                  type="text"
                  defaultValue={user.country || ""}
                  placeholder="India"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFD6C8] bg-white focus:outline-none focus:border-brand-accent text-sm text-brand-dark font-sans"
                />
              </div>

              <div className="md:col-span-2 flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3.5 px-6 bg-brand-dark hover:bg-brand-warm text-brand-cream rounded-lg text-xs tracking-widest uppercase font-sans font-medium transition-all shadow disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Collector Profile"}
                </button>
                {savedMsg && (
                  <button
                    type="button"
                    onClick={() => setSavedMsg("")}
                    className="px-5 py-3 rounded-lg border border-[#DFD6C8] bg-white text-brand-dark text-xs tracking-wider uppercase font-sans font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

// ── Wishlist card ─────────────────────────────────────────────────────────────
function WishlistCard({ artworkId, onRemove }) {
  const { openArtwork } = useArtModal();
  const idStr =
    typeof artworkId === "object" && artworkId !== null
      ? artworkId._id || artworkId.id
      : artworkId;

  const [artwork, setArtwork] = useState(() => {
    if (typeof artworkId === "object" && artworkId !== null && (artworkId.src || artworkId.title)) {
      return artworkId;
    }
    return (
      allWorks.find(
        (w) =>
          String(w.id) === String(idStr) ||
          String(w._id) === String(idStr) ||
          String(w.title) === String(idStr)
      ) || null
    );
  });

  useEffect(() => {
    if (!artwork && idStr) {
      let active = true;
      fetch(`/api/artworks/${idStr}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (active && data?.artwork) {
            setArtwork({
              ...data.artwork,
              id: data.artwork._id,
              src: data.artwork.images?.[0] || data.artwork.image || "/art/placeholder.jpg",
            });
          }
        })
        .catch(() => {});
      return () => {
        active = false;
      };
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
    } catch {
      onRemove();
    }
  };

  if (!artwork) {
    return (
      <div className="aspect-[3/4] bg-brand-beige/50 rounded-lg flex items-center justify-center border border-[#E8DDD0]">
        <div className="w-5 h-5 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const imageSrc =
    artwork.src ||
    artwork.images?.[0] ||
    artwork.image ||
    "/art/813661180_18115305131070803_8784916059366770496_n.jpg";

  return (
    <div
      onClick={() => openArtwork(artwork)}
      className="group relative cursor-pointer flex flex-col bg-white p-3 rounded-xl border border-[#EAE2D5] shadow-sm hover:shadow-md transition-all"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#EEEBE5]">
        <Image
          src={imageSrc}
          alt={artwork.title || "Artwork"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-white shadow transition-transform active:scale-90"
          title="Remove from wishlist"
        >
          <FaHeart className="text-xs" />
        </button>
      </div>

      <div className="mt-3 text-center">
        <h4 className="font-display text-sm font-semibold text-brand-dark truncate">
          {artwork.title}
        </h4>
        <p className="text-[0.68rem] uppercase tracking-wider text-brand-muted font-sans mt-0.5">
          {artwork.medium || "Acrylic on Canvas"}
        </p>
      </div>
    </div>
  );
}
