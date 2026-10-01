"use client";

import { useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaTimes, FaPalette } from "react-icons/fa";
import ArtCard from "./ArtCard";
import { allWorks } from "./data";

export const paletteColors = [
  { name: "Rose",     hex: "#f06292", gradient: "linear-gradient(to bottom, #f06292, #c2185b)", mood: "Visceral & Intimate" },
  { name: "Crimson",  hex: "#e53935", gradient: "linear-gradient(to bottom, #e53935, #8b0000)", mood: "Passionate & Raw" },
  { name: "Amber",    hex: "#ef8c38", gradient: "linear-gradient(to bottom, #ef8c38, #b84f00)", mood: "Earthy & Grounded" },
  { name: "Yellow",   hex: "#fdd835", gradient: "linear-gradient(to bottom, #fdd835, #c6a800)", mood: "Radiant & Ochre" },
  { name: "Teal",     hex: "#3aafa9", gradient: "linear-gradient(to bottom, #3aafa9, #1a6b67)", mood: "Quiet & Serene" },
  { name: "Blue",     hex: "#2d9de5", gradient: "linear-gradient(to bottom, #2d9de5, #1565a8)", mood: "Deep & Contemplative" },
  { name: "Lavender", hex: "#b39ddb", gradient: "linear-gradient(to bottom, #b39ddb, #7851a9)", mood: "Ethereal & Poetic" },
  { name: "Emerald",  hex: "#43a047", gradient: "linear-gradient(to bottom, #43a047, #1b5e20)", mood: "Organic & Vital" },
];

export default function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState("Rose");
  const [hovered, setHovered] = useState(null);

  const activeColorObj = paletteColors.find((c) => c.name === selectedColor) || paletteColors[0];

  // Matching artworks
  const matchingWorks = allWorks.filter((w) => {
    if (!selectedColor) return true;
    if (w.color === selectedColor) return true;
    if (selectedColor === "Amber" && w.color === "Yellow") return true;
    if (selectedColor === "Yellow" && w.color === "Amber") return true;
    if (selectedColor === "Blue" && (w.color === "Teal" || w.color === "Lavender")) return true;
    if (selectedColor === "Rose" && w.color === "Crimson") return true;
    return false;
  }).slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-brand-cream border-t border-brand-sand/40">
      {/* Title */}
      <div className="text-center mb-3">
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 400,
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            color: "#1C1C1C",
            letterSpacing: "0.01em",
          }}
        >
          What's your favorite color?
        </h2>
      </div>
      <div className="text-center mb-8 md:mb-12">
        <p
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: "italic",
            fontSize: "0.95rem",
            color: "#6B5F55",
            letterSpacing: "0.04em",
          }}
        >
          Discover artworks by the mood of their palette — click any shade below
        </p>
      </div>

      {/* Swatches Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-4 sm:grid-cols-8 gap-2.5 md:gap-3 px-6 md:px-4 mb-6">
        {paletteColors.map((color, i) => {
          const isSelected = selectedColor === color.name;
          const isHov = hovered === i;

          return (
            <button
              key={color.name}
              aria-label={color.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelectedColor(color.name)}
              className="relative focus:outline-none flex flex-col items-center group"
              style={{
                cursor: "pointer",
                border: "none",
                background: "transparent",
                padding: 0,
              }}
            >
              {/* Swatch Pill Bar */}
              <div
                className="w-full relative overflow-hidden transition-all duration-300"
                style={{
                  height: "clamp(100px, 16vw, 190px)",
                  borderRadius: "12px",
                  background: color.gradient,
                  transform: isSelected
                    ? "scale(1.05) translateY(-4px)"
                    : isHov
                    ? "scale(1.02) translateY(-2px)"
                    : "scale(1)",
                  boxShadow: isSelected
                    ? `0 12px 28px ${color.hex}55, 0 0 0 2px #1C1C1C`
                    : isHov
                    ? "0 8px 20px rgba(28,28,28,0.18)"
                    : "0 2px 10px rgba(28,28,28,0.08)",
                }}
              >
                {/* Active check ring */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-white text-black flex items-center justify-center text-[8px] font-bold shadow">
                    ✓
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-[0.72rem] tracking-wider uppercase font-sans transition-colors ${
                  isSelected ? "font-semibold text-brand-dark" : "text-brand-muted group-hover:text-brand-dark"
                }`}
              >
                {color.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Mood Headline */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-6 pt-6 border-t border-[#EAE2D5]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[0.65rem] tracking-[0.25em] uppercase text-brand-accent font-sans font-semibold block mb-1">
              Curated Palette Selection
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-brand-dark flex items-center gap-3">
              <span>{activeColorObj.name} Paintings</span>
              <span className="text-sm font-sans font-light italic text-brand-muted">
                — {activeColorObj.mood}
              </span>
            </h3>
          </div>

          <Link
            href={`/collect?color=${activeColorObj.name}`}
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-sans font-medium text-brand-accent hover:text-brand-dark transition-colors border-b border-brand-accent pb-0.5"
          >
            <span>View all in collection</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {/* Dynamic Artworks Matching Selected Color */}
        {matchingWorks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {matchingWorks.map((work) => (
              <ArtCard key={work.id} {...work} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-[#EAE2D5]">
            <p className="font-display text-lg text-brand-dark">
              No works found in this exact palette
            </p>
            <p className="text-xs text-brand-muted font-sans mt-1">
              Inquire with the studio for custom commissions in {activeColorObj.name}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
