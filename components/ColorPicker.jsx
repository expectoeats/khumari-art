"use client";

import { useState } from "react";

// Chrome-shiny palette — no text, sirf glossy pill
export const paletteColors = [
  {
    name: "Rose",
    hex: "#e8607a",
    shine: "linear-gradient(145deg, #f9a8b8 0%, #e8607a 40%, #c2185b 100%)",
    glow: "rgba(232,96,122,0.45)",
  },
  {
    name: "Crimson",
    hex: "#d32f2f",
    shine: "linear-gradient(145deg, #ef9a9a 0%, #d32f2f 40%, #7f0000 100%)",
    glow: "rgba(211,47,47,0.45)",
  },
  {
    name: "Amber",
    hex: "#ef8c38",
    shine: "linear-gradient(145deg, #ffe0b2 0%, #ef8c38 40%, #b84f00 100%)",
    glow: "rgba(239,140,56,0.45)",
  },
  {
    name: "Yellow",
    hex: "#f9c700",
    shine: "linear-gradient(145deg, #fff9c4 0%, #f9c700 40%, #c6a800 100%)",
    glow: "rgba(249,199,0,0.45)",
  },
  {
    name: "Teal",
    hex: "#26a69a",
    shine: "linear-gradient(145deg, #b2dfdb 0%, #26a69a 40%, #004d40 100%)",
    glow: "rgba(38,166,154,0.45)",
  },
  {
    name: "Blue",
    hex: "#1e88e5",
    shine: "linear-gradient(145deg, #bbdefb 0%, #1e88e5 40%, #0d47a1 100%)",
    glow: "rgba(30,136,229,0.45)",
  },
  {
    name: "Lavender",
    hex: "#9c6fcc",
    shine: "linear-gradient(145deg, #e1bee7 0%, #9c6fcc 40%, #4a148c 100%)",
    glow: "rgba(156,111,204,0.45)",
  },
  {
    name: "Emerald",
    hex: "#2e7d32",
    shine: "linear-gradient(145deg, #c8e6c9 0%, #43a047 40%, #1b5e20 100%)",
    glow: "rgba(46,125,50,0.45)",
  },
];

export default function ColorPicker() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  return (
    <section className="py-16 md:py-24 bg-brand-cream border-t border-brand-sand/40">

      {/* Title */}
      <div className="text-center mb-10 md:mb-14">
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
        <p
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: "italic",
            fontSize: "0.9rem",
            color: "#6B5F55",
            marginTop: "0.5rem",
            letterSpacing: "0.04em",
          }}
        >
          Discover artworks by the mood of their palette
        </p>
      </div>

      {/* Pill row */}
      <div className="flex items-center justify-center flex-wrap gap-3 px-6 md:px-10">
        {paletteColors.map((color) => {
          const isActive  = selected === color.name;
          const isHov     = hovered === color.name;

          return (
            <button
              key={color.name}
              aria-label={color.name}
              onMouseEnter={() => setHovered(color.name)}
              onMouseLeave={() => setHovered(null)}
              onClick={() =>
                setSelected(prev => (prev === color.name ? null : color.name))
              }
              style={{
                /* Size */
                width:  "3rem",
                height: "3rem",
                borderRadius: "50%",
                padding: 0,
                border: "none",
                cursor: "pointer",
                flexShrink: 0,

                /* Chrome shine */
                background: color.shine,

                /* Gloss highlight — pseudo via outline trick */
                outline: isActive
                  ? `3px solid ${color.hex}`
                  : "3px solid transparent",
                outlineOffset: "3px",

                /* Depth */
                boxShadow: isActive
                  ? `0 0 0 1px rgba(255,255,255,0.18) inset,
                     0 8px 24px ${color.glow},
                     0 2px 4px rgba(0,0,0,0.25)`
                  : isHov
                  ? `0 0 0 1px rgba(255,255,255,0.18) inset,
                     0 6px 18px ${color.glow},
                     0 2px 4px rgba(0,0,0,0.2)`
                  : `0 0 0 1px rgba(255,255,255,0.14) inset,
                     0 3px 8px rgba(0,0,0,0.18)`,

                /* Scale on hover/active */
                transform: isActive
                  ? "scale(1.18) translateY(-2px)"
                  : isHov
                  ? "scale(1.1)"
                  : "scale(1)",

                transition:
                  "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), " +
                  "box-shadow 0.22s ease, " +
                  "outline-color 0.15s ease",

                /* Position for inner gloss highlight */
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Inner gloss highlight — top half white shine */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: "10%",
                  right: "10%",
                  height: "45%",
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%)",
                  borderRadius: "0 0 50% 50%",
                  pointerEvents: "none",
                }}
              />

              {/* Active tick */}
              {isActive && (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active color name — below pills */}
      <div
        className="text-center mt-5"
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontStyle: "italic",
          fontSize: "0.9rem",
          color: selected
            ? paletteColors.find(c => c.name === selected)?.hex ?? "#8B7355"
            : "transparent",
          letterSpacing: "0.06em",
          transition: "color 0.3s ease",
          minHeight: "1.4rem",
        }}
      >
        {selected ?? "—"}
      </div>
    </section>
  );
}
