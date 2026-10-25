"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { allWorks } from "../../components/data";
import { FaSearchPlus, FaTimes, FaArrowRight, FaPalette } from "react-icons/fa";
import { useArtModal } from "../../components/ArtModalContext";

const categories = ["All", "Paintings", "Prints", "Photography"];
const paletteColors = [
  {
    name: "All",
    hex: "#1C1C1C",
    bg: "conic-gradient(from 200deg at 50% 50%, #d32f2f, #f57c00, #fbc02d, #388e3c, #00acc1, #1976d2, #7b1fa2, #c2185b, #d32f2f)",
    sheen: "linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.08) 48%, rgba(255,255,255,0) 100%)",
    border: "rgba(28,28,28,0.15)",
    ring: "#1C1C1C",
  },
  {
    name: "Rose",
    hex: "#D16282",
    bg: "linear-gradient(180deg, #E387A0 0%, #D16282 52%, #B94769 100%)",
    sheen: "linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)",
    border: "rgba(185,71,105,0.25)",
    ring: "#B94769",
  },
  {
    name: "Crimson",
    hex: "#C24141",
    bg: "linear-gradient(180deg, #D86262 0%, #C24141 52%, #A52828 100%)",
    sheen: "linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)",
    border: "rgba(165,40,40,0.25)",
    ring: "#A52828",
  },
  {
    name: "Amber",
    hex: "#DD8447",
    bg: "linear-gradient(180deg, #EDA470 0%, #DD8447 52%, #C56726 100%)",
    sheen: "linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)",
    border: "rgba(197,103,38,0.25)",
    ring: "#C56726",
  },
  {
    name: "Yellow",
    hex: "#E5B52C",
    bg: "linear-gradient(180deg, #F2CD57 0%, #E5B52C 52%, #CD9A12 100%)",
    sheen: "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)",
    border: "rgba(205,154,18,0.28)",
    ring: "#CD9A12",
  },
  {
    name: "Teal",
    hex: "#3A9A8D",
    bg: "linear-gradient(180deg, #5CB8AB 0%, #3A9A8D 52%, #257C70 100%)",
    sheen: "linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)",
    border: "rgba(37,124,112,0.25)",
    ring: "#257C70",
  },
  {
    name: "Blue",
    hex: "#2E7BC6",
    bg: "linear-gradient(180deg, #579ADB 0%, #2E7BC6 52%, #185FA6 100%)",
    sheen: "linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)",
    border: "rgba(24,95,166,0.25)",
    ring: "#185FA6",
  },
  {
    name: "Lavender",
    hex: "#8F67B8",
    bg: "linear-gradient(180deg, #AD88D0 0%, #8F67B8 52%, #724999 100%)",
    sheen: "linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)",
    border: "rgba(114,73,153,0.25)",
    ring: "#724999",
  },
  {
    name: "Emerald",
    hex: "#3E8C49",
    bg: "linear-gradient(180deg, #62AF6B 0%, #3E8C49 52%, #287032 100%)",
    sheen: "linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)",
    border: "rgba(40,112,50,0.25)",
    ring: "#287032",
  },
];

function CollectContent() {
  const searchParams = useSearchParams();
  const initialColor = searchParams.get("color") || "All";
  const initialCategory = searchParams.get("category") || "All";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeColor, setActiveColor] = useState(initialColor);
  const [hovered, setHovered] = useState(null);
  const [colorHovered, setColorHovered] = useState(null);
  const [works, setWorks] = useState(allWorks);

  // ── Wishlist state ──
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [animatingHeart, setAnimatingHeart] = useState(null);

  const { openArtwork, openInquiry } = useArtModal();

  // Fetch live artworks from MongoDB
  useEffect(() => {
    let mounted = true;
    fetch("/api/artworks")
      .then((r) => r.json())
      .then((data) => {
        if (data.artworks && data.artworks.length > 0 && mounted) {
          const formatted = data.artworks.map((a) => ({
            id: a._id,
            _id: a._id,
            title: a.title,
            artist: a.artist || "Nancy Sikri",
            medium: a.medium || "Mixed Media on Canvas",
            size: a.dimensions || a.size || "",
            year: a.year || new Date().getFullYear(),
            color: a.color || "Neutral",
            category: a.category?.name || a.category || "Paintings",
            src: a.images?.[0] || a.image || "/art/placeholder.jpg",
            featured: a.featured,
          }));

          // Merge DB items with fallback static items avoiding duplicates
          const combined = [...formatted];
          allWorks.forEach((w) => {
            if (!combined.some((c) => c.title?.toLowerCase() === w.title?.toLowerCase())) {
              combined.push(w);
            }
          });
          setWorks(combined);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const col = searchParams.get("color");
    if (col) setActiveColor(col);
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  // Fetch wishlist on mount
  useEffect(() => {
    let mounted = true;
    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/user/wishlist");
        const data = await res.json();
        if (mounted && data.wishlist) setWishlist(data.wishlist);
      } catch { /* ignore */ }
    };
    fetchWishlist();
    return () => { mounted = false; };
  }, []);

  // Combined filter
  const visible = works.filter((work) => {
    const matchCategory = activeCategory === "All" || work.category === activeCategory;
    const matchColor = activeColor === "All" || work.color === activeColor;
    return matchCategory && matchColor;
  });

  const toggleWishlist = async (artworkId, e) => {
    if (e) e.stopPropagation();
    setWishlistLoading(true);
    const isCurrentlyAdded = wishlist.includes(artworkId);

    // Optimistic update + trigger animation
    setWishlist(prev => (isCurrentlyAdded ? prev.filter(id => id !== artworkId) : [...prev, artworkId]));
    setAnimatingHeart(artworkId);

    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkId }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Revert on failure
        setWishlist(prev => (isCurrentlyAdded ? [...prev, artworkId] : prev.filter(id => id !== artworkId)));
      } else {
        setWishlist(data.wishlist || wishlist);
      }
    } catch {
      setWishlist(prev => (isCurrentlyAdded ? [...prev, artworkId] : prev.filter(id => id !== artworkId)));
    } finally {
      setWishlistLoading(false);
      setTimeout(() => setAnimatingHeart(null), 600);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "340px", height: "38vh" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://www.artisera.com/cdn/shop/files/Colletibles_-_Landing_Page_Banner.png?v=1778651103')`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(10, 8, 6, 0.62)" }}
        />
        <div className="absolute bottom-8 left-6 md:left-12 z-10">
          <p className="text-[0.62rem] uppercase tracking-[0.3em] text-brand-accent font-sans mb-1">
            Studio Catalogue
          </p>
          <h1
            style={{
              fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif',
              fontWeight: 400,
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "#F5F0E8",
              letterSpacing: "0.02em",
              lineHeight: 1.1,
            }}
          >
            Collect
          </h1>
        </div>
      </section>

      {/* ── CATEGORY & COLOR FILTER BARS ── */}
      <div className="border-b bg-[#FAFAF8]" style={{ borderColor: "#E8E4DE" }}>
        
        {/* Category Tabs */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center gap-0 overflow-x-auto border-b border-[#EAE3D9]">
          {categories.map((f) => (
            <button
              key={f}
              onClick={() => setActiveCategory(f)}
              style={{
                fontFamily: "'DM Sans', 'Jost', sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: activeCategory === f ? "#1C1C1C" : "#9E8F80",
                background: "none",
                border: "none",
                borderBottom: activeCategory === f ? "2px solid #1C1C1C" : "2px solid transparent",
                padding: "1rem 1.4rem",
                cursor: "pointer",
                transition: "color 0.2s ease, border-color 0.2s ease",
                flexShrink: 0,
              }}
            >
              {f}
            </button>
          ))}

          {/* Work count */}
          <span
            className="ml-auto flex-shrink-0 pr-2 text-xs font-sans text-brand-muted tracking-wider"
          >
            {visible.length} {visible.length === 1 ? "work" : "works"}
          </span>
        </div>

        {/* Color Palette Filter Strip */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex items-center justify-between gap-4 flex-wrap bg-transparent">
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <span className="text-[0.68rem] uppercase tracking-wider text-brand-dark font-sans font-semibold mr-1 flex items-center gap-1.5 flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-brand-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="13.5" cy="6.5" r=".7" fill="currentColor"/>
                <circle cx="17.5" cy="10.5" r=".7" fill="currentColor"/>
                <circle cx="8.5" cy="7.5" r=".7" fill="currentColor"/>
                <circle cx="6.5" cy="12.5" r=".7" fill="currentColor"/>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/>
              </svg>
              Palette:
            </span>
            {paletteColors.map((col) => {
              const isSelected = activeColor === col.name;
              const isColorHovered = colorHovered === col.name;
              return (
                <button
                  key={col.name}
                  aria-label={col.name}
                  title={col.name}
                  onMouseEnter={() => setColorHovered(col.name)}
                  onMouseLeave={() => setColorHovered(null)}
                  onClick={() => setActiveColor(col.name)}
                  style={{
                    width: "3rem",
                    height: "1.85rem",
                    borderRadius: "999px",
                    padding: 0,
                    border: isSelected
                      ? `1.5px solid #FFFFFF`
                      : `1px solid ${col.border}`,
                    cursor: "pointer",
                    flexShrink: 0,
                    background: col.bg,
                    position: "relative",
                    overflow: "hidden",
                    isolation: "isolate",
                    boxShadow: isSelected
                      ? `0 0 0 1px ${col.ring} inset, 0 0 10px ${col.ring}66, 0 3px 7px rgba(0,0,0,0.16)`
                      : isColorHovered
                      ? `0 1px 4px rgba(0,0,0,0.14), 0 0 0 1px rgba(255,255,255,0.25) inset`
                      : `0 1px 2px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2) inset`,
                    transform: isSelected
                      ? "translateY(-1px)"
                      : isColorHovered
                      ? "translateY(-0.5px)"
                      : "translateY(0)",
                    transition:
                      "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                  }}
                  className="flex items-center justify-center"
                >
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "999px",
                      background: col.sheen,
                      mixBlendMode: "screen",
                      pointerEvents: "none",
                    }}
                  />
                  {isSelected && (
                    <span
                      aria-hidden
                      style={{
                        position: "relative",
                        zIndex: 2,
                        color: "#FFFFFF",
                        fontSize: "0.62rem",
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {(activeColor !== "All" || activeCategory !== "All") && (
            <button
              onClick={() => {
                setActiveColor("All");
                setActiveCategory("All");
              }}
              className="text-[0.68rem] tracking-wider uppercase font-sans text-brand-warm hover:text-brand-dark flex items-center gap-1 underline flex-shrink-0"
            >
              <FaTimes className="text-[9px]" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ── GRID — 3 col on desktop, 2 col on mobile ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        {visible.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 md:gap-x-8 md:gap-y-14">
            {visible.map((work) => {
              const isHov = hovered === work.id;
              return (
                <div
                  key={work.id}
                  className="flex flex-col group cursor-pointer"
                  onMouseEnter={() => setHovered(work.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => openArtwork(work)}
                >
                  {/* Image box with Zoom & Inquire Overlays */}
                  <div
                    className="relative overflow-hidden w-full rounded-sm bg-[#EEEBE5]"
                    style={{ aspectRatio: "3 / 4" }}
                  >
                    <Image
                      src={work.src}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Heart — restrained, editorial */}
                    <button
                      onClick={(e) => toggleWishlist(work.id, e)}
                      aria-label={wishlist.includes(work.id) ? "Remove from wishlist" : "Save to wishlist"}
                      style={{
                        position: "absolute",
                        top: "0.6rem",
                        right: "0.6rem",
                        zIndex: 20,
                        width: "2rem",
                        height: "2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: wishlist.includes(work.id)
                          ? "rgba(28,28,28,0.85)"
                          : "rgba(253,250,245,0.82)",
                        backdropFilter: "blur(6px)",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "2px",
                        transition: "background 0.3s ease, transform 0.18s ease",
                        transform: animatingHeart === work.id ? "scale(0.88)" : "scale(1)",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={wishlist.includes(work.id) ? "#C9A96E" : "none"}
                        stroke={wishlist.includes(work.id) ? "#C9A96E" : "#1C1C1C"}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ transition: "fill 0.3s ease, stroke 0.3s ease" }}
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2.5 p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-brand-dark text-[0.68rem] tracking-wider uppercase font-sans font-medium shadow backdrop-blur-sm">
                        <FaSearchPlus className="text-brand-accent text-xs" />
                        Inspect with Lens
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openInquiry(work);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-brand-accent hover:bg-white text-brand-dark text-[0.65rem] tracking-widest uppercase font-sans font-semibold shadow transition-colors"
                      >
                        Inquire for Quote
                      </button>
                    </div>
                  </div>

                  {/* Label block */}
                  <div className="mt-3.5 text-center flex flex-col justify-between flex-1">
                    <div>
                      <p className="font-display font-medium text-sm md:text-base text-brand-dark group-hover:text-brand-accent transition-colors line-clamp-1 uppercase tracking-wide">
                        {work.title}
                      </p>
                      <p className="text-xs text-[#8B7E72] font-sans mt-0.5 uppercase tracking-wider">
                        {work.medium} · {work.year}
                      </p>
                      {work.size && (
                        <p className="text-[0.7rem] text-brand-warm font-sans mt-0.5">
                          {work.size}
                        </p>
                      )}
                    </div>

                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openInquiry(work);
                        }}
                        className="text-[0.68rem] tracking-widest uppercase text-brand-accent hover:text-brand-dark border-b border-brand-accent/40 hover:border-brand-dark pb-0.5 font-sans font-medium transition-colors"
                      >
                        Inquire for Quote →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 px-6 text-center max-w-lg mx-auto bg-white rounded-2xl border border-[#EAE2D5] shadow-sm">
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4 bg-[#F5EFE6] border border-[#E2D8C9]">
              <FaPalette className="text-xl text-brand-accent" />
            </div>
            <p className="font-display text-2xl md:text-3xl text-brand-dark mb-2">
              No works in this selection
            </p>
            <p className="text-xs sm:text-sm text-brand-muted font-sans mb-6 leading-relaxed">
              We couldn't find any studio artworks matching{" "}
              {activeCategory !== "All" && <span className="font-semibold text-brand-dark">"{activeCategory}"</span>}
              {activeCategory !== "All" && activeColor !== "All" && " and "}
              {activeColor !== "All" && (
                <span>
                  palette <span className="font-semibold text-brand-dark">"{activeColor}"</span>
                </span>
              )}
              . Try picking another palette or category.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {activeCategory !== "All" && (
                <button
                  onClick={() => setActiveCategory("All")}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#F5EFE6] hover:bg-brand-accent hover:text-white border border-[#E2D8C9] text-brand-dark font-sans transition-colors"
                >
                  All Categories
                </button>
              )}
              {activeColor !== "All" && (
                <button
                  onClick={() => setActiveColor("All")}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#F5EFE6] hover:bg-brand-accent hover:text-white border border-[#E2D8C9] text-brand-dark font-sans transition-colors"
                >
                  All Palettes
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setActiveColor("All");
                setActiveCategory("All");
              }}
              className="btn-dark px-8 py-3.5 text-xs tracking-widest uppercase font-sans font-medium"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* ── INQUIRE BAND ── */}
      <section
        className="border-t py-14 md:py-16 px-6 md:px-10"
        style={{ borderColor: "#E8E4DE", background: "#F5F0E8" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <p
              style={{
                fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                fontStyle: "italic",
                fontSize: "0.95rem",
                color: "#8B7355",
                marginBottom: "0.5rem",
              }}
            >
              Can't find what you're looking for?
            </p>
            <h3
              style={{
                fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif',
                fontWeight: 400,
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                color: "#1C1C1C",
                lineHeight: 1.2,
              }}
            >
              Commission a piece made{" "}
              <em style={{ color: "#C9A96E" }}>only for your space.</em>
            </h3>
          </div>
          <button
            onClick={() =>
              openInquiry({
                title: "Custom Bespoke Commission",
                src: "/art/822454183_18116058677070803_7997214052897677537_n.jpg",
                artist: "Nancy Sikri",
                medium: "Custom Scale & Palette",
                size: "Bespoke Dimensions",
                year: 2024,
              })
            }
            className="btn-dark w-full md:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 flex-shrink-0"
          >
            Start a Commission Conversation
            <FaArrowRight className="text-[10px]" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function CollectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF8]" />}>
      <CollectContent />
    </Suspense>
  );
}
