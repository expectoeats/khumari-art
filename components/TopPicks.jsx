"use client";

import { useState } from "react";
import Image from "next/image";
import { FaSearchPlus, FaArrowRight } from "react-icons/fa";
import { useArtModal } from "./ArtModalContext";

const picks = [
  {
    id: 5,
    src: "/art/813661180_18115305131070803_8784916059366770496_n.jpg",
    artist: "Nancy Sikri",
    title: "Layers of Silence",
    subtitle: "An introspective abstract series",
    medium: "Acrylic on Canvas",
    size: "16 × 20 in",
    year: 2023,
    color: "Blue",
  },
  {
    id: 6,
    src: "/art/811266960_18115098530070803_4087374646249167423_n.jpg",
    artist: "Nancy Sikri",
    title: "Echoes in Ochre",
    subtitle: "Warm tones, raw emotion",
    medium: "Archival Print on Cotton Rag",
    size: "12 × 16 in",
    year: 2023,
    color: "Yellow",
  },
  {
    id: 2,
    src: "/art/822454183_18116058677070803_7997214052897677537_n.jpg",
    artist: "Nancy Sikri",
    title: "A Soul Within and Without",
    subtitle: "Duality captured in strokes",
    medium: "Acrylic on Canvas",
    size: "20 × 24 in",
    year: 2024,
    color: "Rose",
  },
  {
    id: 4,
    src: "/art/817902603_18115636340070803_3091029228027957233_n.jpg",
    artist: "Nancy Sikri",
    title: "Shadowed Thoughts",
    subtitle: "Where silence speaks loudest",
    medium: "Acrylic on Canvas",
    size: "24 × 36 in",
    year: 2023,
    color: "Amber",
  },
  {
    id: 7,
    src: "/art/810148848_18115030028070803_5556986987562606541_n.jpg",
    artist: "Nancy Sikri",
    title: "The Wandering Eye",
    subtitle: "Perspectives in abstract form",
    medium: "Giclée Fine Art Print",
    size: "16 × 24 in",
    year: 2023,
    color: "Emerald",
  },
];

// Returns transform + z-index for each card position relative to active
function getCardStyle(offset) {
  const abs = Math.abs(offset);
  if (offset === 0) {
    return {
      transform: "translateX(0) scale(1) translateZ(0)",
      zIndex: 10,
      opacity: 1,
    };
  }
  const dir    = offset > 0 ? 1 : -1;
  const shiftX = dir * (abs === 1 ? 52 : abs === 2 ? 86 : 110);   // % shift
  const scale  = abs === 1 ? 0.82 : abs === 2 ? 0.68 : 0.58;
  const rotate = dir * (abs === 1 ? 4 : abs === 2 ? 7 : 9);
  return {
    transform: `translateX(${shiftX}%) scale(${scale}) rotate(${rotate}deg)`,
    zIndex: 10 - abs,
    opacity: abs > 2 ? 0 : abs === 2 ? 0.55 : 0.85,
  };
}

export default function TopPicks() {
  const [active, setActive] = useState(2); // center card
  const { openArtwork, openInquiry } = useArtModal();

  const handleCardClick = (i, isCenter, pick) => {
    if (isCenter) {
      openArtwork(pick);
    } else {
      setActive(i);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-brand-cream overflow-hidden">
      {/* Title */}
      <div className="text-center mb-12 md:mb-16">
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 400,
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            color: "#1C1C1C",
            letterSpacing: "0.01em",
          }}
        >
          Today's top picks
        </h2>
        <p className="text-xs text-brand-muted font-sans mt-2 tracking-wide">
          Tap active card to inspect texture with lens zoom
        </p>
      </div>

      {/* Fan carousel */}
      <div className="relative flex items-center justify-center h-[320px] md:h-[420px]">
        {picks.map((pick, i) => {
          const offset = i - active;
          const style  = getCardStyle(offset);
          const isCenter = offset === 0;

          return (
            <div
              key={i}
              onClick={() => handleCardClick(i, isCenter, pick)}
              className="absolute cursor-pointer w-[200px] h-[280px] md:w-[260px] md:h-[360px]"
              style={{
                transition: "transform 0.5s cubic-bezier(0.34,1.2,0.64,1), opacity 0.4s ease, z-index 0s",
                ...style,
              }}
            >
              {/* Card */}
              <div
                className="relative w-full h-full overflow-hidden group"
                style={{
                  borderRadius: "16px",
                  boxShadow: isCenter
                    ? "0 24px 60px rgba(28,28,28,0.28)"
                    : "0 8px 24px rgba(28,28,28,0.14)",
                }}
              >
                <Image
                  src={pick.src}
                  alt={pick.title}
                  fill
                  className="object-cover"
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(28,28,28,0.85) 0%, rgba(28,28,28,0.2) 50%, transparent 100%)",
                  }}
                />

                {/* Center pill label */}
                {isCenter && (
                  <div
                    className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full flex items-center gap-1.5 shadow"
                    style={{
                      background: "rgba(28,28,28,0.7)",
                      backdropFilter: "blur(6px)",
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: "0.72rem",
                      color: "#F5F0E8",
                      letterSpacing: "0.06em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <FaSearchPlus className="text-brand-accent text-[10px]" />
                    <span>Click to Zoom</span>
                  </div>
                )}

                {/* Bottom text & action on center card */}
                {isCenter && (
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <p
                      style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        color: "#FFFFFF",
                        lineHeight: 1.2,
                        marginBottom: "0.2rem",
                      }}
                    >
                      {pick.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.75)",
                        fontStyle: "italic",
                        marginBottom: "0.6rem",
                      }}
                    >
                      {pick.subtitle}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openInquiry(pick);
                        }}
                        className="px-2.5 py-1 bg-brand-accent hover:bg-white text-brand-dark text-[0.62rem] tracking-wider uppercase font-sans font-semibold rounded transition-colors"
                      >
                        Inquire
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openArtwork(pick);
                        }}
                        className="px-2.5 py-1 bg-white/20 hover:bg-white/40 text-white text-[0.62rem] tracking-wider uppercase font-sans rounded transition-colors backdrop-blur-sm"
                      >
                        Macro View
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {picks.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Pick ${i + 1}`}
            style={{
              width: i === active ? "1.5rem" : "0.4rem",
              height: "0.25rem",
              borderRadius: "999px",
              background: i === active ? "#1C1C1C" : "#C9A96E",
              border: "none",
              cursor: "pointer",
              transition: "width 0.3s ease, background 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
