"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { allWorks } from "../../components/data";

const filters = ["All", "Paintings", "Prints", "Photography"];

export default function CollectPage() {
  const [active, setActive] = useState("All");
  const [hovered, setHovered] = useState(null);

  const visible = active === "All"
    ? allWorks
    : allWorks.filter(w => w.category === active);

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      <Navbar />

      {/* ── HERO — dark with kettle bg image ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "340px", height: "38vh" }}
      >
        {/* Background image from Artisera */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://www.artisera.com/cdn/shop/files/Colletibles_-_Landing_Page_Banner.png?v=1778651103')`,
          }}
        />

        {/* Dark overlay — heavier so text is readable */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(10, 8, 6, 0.62)" }}
        />

        {/* Bottom-left title */}
        <div className="absolute bottom-8 left-8 md:left-12 z-10">
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 400,
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              color: "#F5F0E8",
              letterSpacing: "0.02em",
              lineHeight: 1.1,
            }}
          >
            Collect
          </h1>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <div
        className="border-b"
        style={{ borderColor: "#E8E4DE", background: "#FAFAF8" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center gap-0 overflow-x-auto">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              style={{
                fontFamily: "'DM Sans', 'Jost', sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: active === f ? "#1C1C1C" : "#9E8F80",
                background: "none",
                border: "none",
                borderBottom: active === f ? "2px solid #1C1C1C" : "2px solid transparent",
                padding: "1rem 1.4rem",
                cursor: "pointer",
                transition: "color 0.2s ease, border-color 0.2s ease",
                flexShrink: 0,
              }}
            >
              {f}
            </button>
          ))}

          {/* Work count — right side */}
          <span
            className="ml-auto flex-shrink-0 pr-2"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.72rem",
              color: "#9E8F80",
              letterSpacing: "0.06em",
            }}
          >
            {visible.length} {visible.length === 1 ? "work" : "works"}
          </span>
        </div>
      </div>

      {/* ── GRID — 3 col, image + label below ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 md:gap-x-8 md:gap-y-14">
          {visible.map((work) => {
            const isHov = hovered === work.id;
            return (
              <div
                key={work.id}
                className="flex flex-col cursor-pointer"
                onMouseEnter={() => setHovered(work.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Image box — fixed aspect, slight zoom on hover */}
                <div
                  className="relative overflow-hidden w-full"
                  style={{
                    aspectRatio: "3 / 4",
                    background: "#EEEBE5",
                  }}
                >
                  <Image
                    src={work.src}
                    alt={work.title}
                    fill
                    className="object-cover"
                    style={{
                      transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      transform: isHov ? "scale(1.04)" : "scale(1)",
                    }}
                  />

                  {/* Hover overlay — "Discover the Collection" pill, like Artisera */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background: "rgba(10,8,6,0.28)",
                      opacity: isHov ? 1 : 0,
                      transition: "opacity 0.35s ease",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.65rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#F5F0E8",
                        background: "rgba(10,8,6,0.55)",
                        padding: "0.5rem 1.1rem",
                        borderRadius: "2px",
                        backdropFilter: "blur(4px)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Inquire for Quote
                    </span>
                  </div>
                </div>

                {/* Label block — below image, like Artisera */}
                <div className="mt-3 text-center">
                  <p
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontWeight: 400,
                      fontSize: "0.82rem",
                      letterSpacing: "0.06em",
                      color: isHov ? "#C9A96E" : "#1C1C1C",
                      textTransform: "uppercase",
                      transition: "color 0.25s ease",
                      lineHeight: 1.4,
                    }}
                  >
                    {work.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.68rem",
                      letterSpacing: "0.08em",
                      color: "#9E8F80",
                      marginTop: "0.2rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {work.medium} · {work.year}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── INQUIRE BAND ── */}
      <section
        className="border-t py-14 md:py-16 px-6 md:px-10"
        style={{ borderColor: "#E8E4DE", background: "#F5F0E8" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: "0.9rem",
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
              <em style={{ color: "#C9A96E" }}>only for you.</em>
            </h3>
          </div>
          <a
            href="mailto:ratulm28@gmail.com"
            className="btn-dark inline-flex items-center gap-3 px-10 py-4 flex-shrink-0"
          >
            Start a Conversation
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
