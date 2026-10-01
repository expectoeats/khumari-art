"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { allWorks } from "../../components/data";
import { FaSearchPlus, FaTimes, FaPalette, FaArrowRight } from "react-icons/fa";
import { useArtModal } from "../../components/ArtModalContext";

const categories = ["All", "Paintings", "Prints", "Photography"];
const paletteColors = ["All", "Rose", "Crimson", "Amber", "Yellow", "Teal", "Blue", "Lavender", "Emerald"];

function CollectContent() {
  const searchParams = useSearchParams();
  const initialColor = searchParams.get("color") || "All";
  const initialCategory = searchParams.get("category") || "All";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeColor, setActiveColor] = useState(initialColor);
  const [hovered, setHovered] = useState(null);

  const { openArtwork, openInquiry } = useArtModal();

  useEffect(() => {
    const col = searchParams.get("color");
    if (col) setActiveColor(col);
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  // Combined filter
  const visible = allWorks.filter((work) => {
    const matchCategory = activeCategory === "All" || work.category === activeCategory;
    const matchColor = activeColor === "All" || work.color === activeColor;
    return matchCategory && matchColor;
  });

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
              fontFamily: "'DM Serif Display', serif",
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
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex items-center justify-between gap-4 flex-wrap bg-[#F5EFE6]/50">
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <span className="text-[0.65rem] uppercase tracking-wider text-brand-muted font-sans mr-1 flex items-center gap-1 flex-shrink-0">
              <FaPalette className="text-brand-accent text-xs" />
              Palette:
            </span>
            {paletteColors.map((col) => {
              const isSelected = activeColor === col;
              return (
                <button
                  key={col}
                  onClick={() => setActiveColor(col)}
                  className={`px-3 py-1 rounded-full text-xs font-sans tracking-wide transition-all flex-shrink-0 ${
                    isSelected
                      ? "bg-brand-dark text-white font-medium shadow-sm"
                      : "bg-white/80 hover:bg-white text-brand-muted border border-[#E2D8CB]"
                  }`}
                >
                  {col}
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
          <div className="text-center py-20 bg-white rounded-xl border border-[#EAE2D5]">
            <p className="font-display text-2xl text-brand-dark mb-2">
              No works found matching your filter
            </p>
            <p className="text-sm text-brand-muted font-sans mb-6">
              Try choosing another color palette or category.
            </p>
            <button
              onClick={() => {
                setActiveColor("All");
                setActiveCategory("All");
              }}
              className="btn-dark px-6 py-3"
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
                fontFamily: "'DM Serif Display', serif",
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
                fontFamily: "'DM Serif Display', serif",
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
