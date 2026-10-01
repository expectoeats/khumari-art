"use client";

import { useState } from "react";

const colors = [
  { name: "Teal",    gradient: "linear-gradient(to bottom, #3aafa9, #1a6b67)" },
  { name: "Blue",    gradient: "linear-gradient(to bottom, #2d9de5, #1565a8)" },
  { name: "Lavender",gradient: "linear-gradient(to bottom, #b39ddb, #7851a9)" },
  { name: "Rose",    gradient: "linear-gradient(to bottom, #f06292, #c2185b)" },
  { name: "Crimson", gradient: "linear-gradient(to bottom, #e53935, #8b0000)" },
  { name: "Amber",   gradient: "linear-gradient(to bottom, #ef8c38, #b84f00)" },
  { name: "Yellow",  gradient: "linear-gradient(to bottom, #fdd835, #c6a800)" },
  { name: "Emerald", gradient: "linear-gradient(to bottom, #43a047, #1b5e20)" },
];

export default function ColorPicker() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="py-16 md:py-24 bg-brand-cream">
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
      <div className="text-center mb-10 md:mb-14">
        <p
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: "italic",
            fontSize: "0.95rem",
            color: "#6B5F55",
            letterSpacing: "0.04em",
          }}
        >
          Discover artworks by the mood of their palette
        </p>
      </div>

      {/* Swatches */}
      <div className="grid grid-cols-4 gap-3 px-6 md:flex md:justify-center md:gap-3 md:px-4">
        {colors.map((color, i) => (
          <button
            key={i}
            aria-label={color.name}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setHovered(i === hovered ? null : i)}
            className="relative focus:outline-none md:flex-1"
            style={{
              maxWidth: "130px",
              height: "clamp(120px, 22vw, 320px)",
              borderRadius: "12px",
              background: color.gradient,
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              transform: hovered === i ? "scaleY(1.04) scaleX(1.02)" : "scaleY(1) scaleX(1)",
              boxShadow:
                hovered === i
                  ? "0 16px 40px rgba(28,28,28,0.22)"
                  : "0 4px 16px rgba(28,28,28,0.10)",
              cursor: "pointer",
              border: "none",
              padding: 0,
              width: "100%",
            }}
          >
            {/* Color name on hover */}
            <span
              style={{
                position: "absolute",
                bottom: "0.75rem",
                left: "0.75rem",
                fontFamily: "'DM Serif Display', serif",
                fontSize: "0.82rem",
                fontWeight: 500,
                color: "#fff",
                letterSpacing: "0.04em",
                opacity: hovered === i ? 1 : 0,
                transition: "opacity 0.2s ease",
                textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              {color.name}
            </span>
          </button>
        ))}
      </div>

      {/* Active color name below on mobile */}
      <div
        className="text-center mt-6"
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1rem",
          fontStyle: "italic",
          color: "#8B7355",
          minHeight: "1.4rem",
          letterSpacing: "0.04em",
          transition: "opacity 0.2s ease",
          opacity: hovered !== null ? 1 : 0,
        }}
      >
        {hovered !== null ? colors[hovered].name : "—"}
      </div>
    </section>
  );
}
