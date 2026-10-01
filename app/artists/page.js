"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { allWorks } from "../../components/data";
import { FaInstagram, FaArrowRight, FaPlay } from "react-icons/fa";

const timeline = [
  { year: "2018", event: "First canvas. No formal training. Just a feeling that wouldn't leave." },
  { year: "2019", event: "First sold piece — to a stranger who cried in front of it." },
  { year: "2020", event: "Lockdown became a studio. Produced 40 works in 8 months." },
  { year: "2021", event: "First group exhibition, New Delhi." },
  { year: "2022", event: "Instagram following crossed 5,000. The world found the work." },
  { year: "2023", event: "First commissioned series — 6 paintings for a private collector." },
  { year: "2024", event: "Ongoing. The work keeps asking questions." },
];

const process = [
  { n: "01", title: "Feeling First", body: "No sketches. No plan. The first mark is always emotional — a colour that insists on being there." },
  { n: "02", title: "Layering", body: "Acrylic over acrylic, sometimes 12 layers deep. What gets buried matters as much as what shows." },
  { n: "03", title: "Conversation", body: "At some point the canvas starts talking back. The work is finished when it no longer needs the artist." },
];

const featuredWorks = allWorks.filter(w => w.featured).slice(0, 3);

export default function ArtistsPage() {
  const [activeYear, setActiveYear] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      <Navbar />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 1 — Split hero
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="w-full grid md:grid-cols-2"
        style={{ minHeight: "92vh" }}
      >
        {/* LEFT — dark text panel */}
        <div
          className="relative flex flex-col justify-between px-6 sm:px-8 md:px-14 py-10 md:py-16 order-2 md:order-1"
          style={{ background: "#111010" }}
        >
          {/* Top-left small label */}
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
            fontSize: "0.6rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(201,169,110,0.6)",
          }}>
            Nancy Sikri
          </p>

          {/* Center — big name */}
          <div className="my-8 md:my-0">
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 400,
              fontSize: "clamp(3.4rem, 12vw, 8.5rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.01em",
              color: "#F5F0E8",
            }}>
              Nancy
            </h1>
            {/* Second line — indented, italic gold */}
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(3.4rem, 12vw, 8.5rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.01em",
              color: "#C9A96E",
              paddingLeft: "clamp(1.5rem, 5vw, 5rem)",
            }}>
              Sikri
            </h1>

            {/* Single raw line below name */}
            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)",
              color: "rgba(245,240,232,0.35)",
              marginTop: "1.5rem",
              letterSpacing: "0.04em",
              lineHeight: 1.5,
            }}>
              Painter. New Delhi. Self-taught.
            </p>
          </div>

          {/* Bottom — scroll cue */}
          <a
            href="#statement"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.58rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(201,169,110,0.45)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.8rem",
            }}
          >
            <span style={{ width: "1.8rem", height: "1px", background: "rgba(201,169,110,0.4)" }} />
            Scroll to explore
          </a>
        </div>

        {/* RIGHT — full-bleed portrait */}
        <div className="relative order-1 md:order-2 min-h-[340px] md:min-h-[55vw]">
          <Image
            src="/avatar.webp"
            alt="Nancy Sikri"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Subtle bottom fade on mobile so it blends into dark text */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 md:hidden"
            style={{
              background: "linear-gradient(to top, #111010, transparent)",
            }}
          />
          {/* Very subtle left fade so it bleeds into the dark panel */}
          <div
            className="absolute inset-y-0 left-0 w-16 hidden md:block"
            style={{
              background: "linear-gradient(to right, #111010, transparent)",
            }}
          />
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 2 — Artist statement
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="statement" className="py-14 md:py-32 px-6 md:px-10 scroll-mt-16" style={{ background: "#FDFAF5" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_2fr] gap-8 md:gap-20 items-start">

          {/* Left — label */}
          <div className="md:sticky md:top-28">
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#8B7355",
              marginBottom: "1rem",
            }}>
              Artist Statement
            </p>
            <div style={{ width: "1.5rem", height: "1px", background: "#C9A96E" }} />
          </div>

          {/* Right — statement text */}
          <div>
            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 300,
              fontSize: "clamp(1.4rem, 3.5vw, 2.6rem)",
              lineHeight: 1.45,
              color: "#1C1C1C",
              letterSpacing: "0.01em",
            }}>
              "I never learned to paint. I learned to{" "}
              <em style={{ color: "#C9A96E" }}>feel</em> — and the canvas became where feelings
              stopped being silent."
            </p>

            <div style={{ height: "1px", background: "#E8DDD0", margin: "2rem 0 md:2.5rem 0" }} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(0.98rem, 2.5vw, 1.05rem)",
              lineHeight: 1.8,
              color: "#2A2A2A",
            }}>
              <p>
                Art chose Nancy long before she chose it. Growing up in a family where creativity
                lived in every room, she watched, absorbed, and waited. When she finally picked
                up a brush, it was not to make something beautiful — it was to make something
                honest.
              </p>
              <p>
                Her process is intuitive and physical. No sketches, no preliminary studies.
                Each work begins with a single colour that insists on being there, and builds
                through layers — some buried completely — until the canvas stops asking for more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 3 — Process steps
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-14 md:py-24 px-6 md:px-10 overflow-hidden" style={{ background: "#F5F0E8" }}>

        {/* Large italic process word */}
        <div className="text-center mb-10 md:mb-12 relative">
          <span
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(3.5rem, 16vw, 12rem)",
              color: "rgba(28,28,28,0.04)",
              lineHeight: 1,
            }}
          >
            Process
          </span>
          <p className="relative section-title mb-2">How it's made</p>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 300,
            fontSize: "clamp(1.6rem, 4vw, 3rem)",
            color: "#1C1C1C",
            letterSpacing: "0.04em",
            position: "relative",
          }}>
            The making of a painting
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-0 mt-8 md:mt-16">
          {process.map((step, i) => (
            <div
              key={step.n}
              className={`group relative px-6 md:px-10 py-8 md:py-10 border-t md:border-t-0 md:border-l ${i === 0 ? "border-t-0 md:border-l-0" : "border-[#E8DDD0]"}`}
              style={{
                transition: "background 0.3s ease",
              }}
            >
              {/* Number */}
              <p style={{
                fontFamily: "'DM Serif Display', serif",
                fontWeight: 300,
                fontSize: "clamp(2.8rem, 6vw, 4rem)",
                color: "rgba(201,169,110,0.25)",
                lineHeight: 1,
                marginBottom: "1rem",
                transition: "color 0.3s ease",
              }}
              className="group-hover:text-brand-accent"
              >
                {step.n}
              </p>

              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontWeight: 500,
                fontSize: "1.2rem",
                color: "#1C1C1C",
                marginBottom: "0.6rem",
                letterSpacing: "0.02em",
              }}>
                {step.title}
              </h3>

              <p style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "0.95rem",
                lineHeight: 1.75,
                color: "#6B5F55",
              }}>
                {step.body}
              </p>

              {/* Gold bottom bar on hover */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: i > 0 ? "calc(1px)" : 0,
                right: 0,
                height: "2px",
                background: "#C9A96E",
                transform: "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.4s ease",
              }}
              className="group-hover:[transform:scaleX(1)]"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 4 — Timeline
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-14 md:py-32 px-6 md:px-10" style={{ background: "#1C1C1C" }}>
        <div className="max-w-5xl mx-auto">

          <div className="mb-10 md:mb-14">
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#8B7355",
              marginBottom: "0.8rem",
            }}>
              A life in art
            </p>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 300,
              fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
              color: "#F5F0E8",
              letterSpacing: "0.03em",
            }}>
              The journey
            </h2>
          </div>

          {/* Timeline rows */}
          <div>
            {timeline.map((item, i) => (
              <div
                key={item.year}
                className="group flex items-start gap-4 md:gap-10 cursor-pointer py-5 md:py-6 border-t"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
                onMouseEnter={() => setActiveYear(item.year)}
                onMouseLeave={() => setActiveYear(null)}
              >
                {/* Year */}
                <p style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontWeight: 300,
                  fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                  color: activeYear === item.year ? "#C9A96E" : "rgba(245,240,232,0.3)",
                  minWidth: "3.5rem",
                  transition: "color 0.3s ease",
                  lineHeight: 1,
                  paddingTop: "0.15rem",
                }}>
                  {item.year}
                </p>

                {/* Dot */}
                <div style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  marginTop: "0.45rem",
                  flexShrink: 0,
                  background: activeYear === item.year ? "#C9A96E" : "rgba(201,169,110,0.25)",
                  transition: "background 0.3s ease",
                }} />

                {/* Event text */}
                <p style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontStyle: activeYear === item.year ? "normal" : "italic",
                  fontSize: "clamp(0.92rem, 2.5vw, 1.05rem)",
                  color: activeYear === item.year ? "#F5F0E8" : "rgba(232,221,208,0.45)",
                  lineHeight: 1.6,
                  transition: "color 0.3s ease, font-style 0.2s ease",
                }}>
                  {item.event}
                </p>
              </div>
            ))}

            {/* Last border */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 5 — Featured works
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="work" className="py-14 md:py-28 px-6 md:px-10" style={{ background: "#FDFAF5" }}>
        <div className="max-w-7xl mx-auto">

          <div className="flex items-end justify-between mb-8 md:mb-16">
            <div>
              <p className="section-title mb-2">Selected works</p>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontWeight: 300,
                fontSize: "clamp(1.6rem, 4vw, 3rem)",
                color: "#1C1C1C",
                letterSpacing: "0.03em",
              }}>
                From the studio
              </h2>
            </div>
            <Link
              href="/collect"
              className="hidden md:inline-flex items-center gap-2 text-brand-accent hover:text-brand-dark transition-colors"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              View all works
              <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          {/* 3-col featured grid — alternating heights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredWorks.map((work, i) => (
              <div
                key={work.id}
                className="group relative overflow-hidden hover-lift cursor-pointer"
                style={{
                  borderRadius: "6px",
                  aspectRatio: i === 1 ? "3/4" : "4/5",
                }}
              >
                <Image
                  src={work.src}
                  alt={work.title}
                  fill
                  className="object-cover img-zoom"
                />
                <div className="absolute inset-0 category-overlay" />

                <div className="absolute bottom-5 left-5 right-5">
                  <p style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontWeight: 500,
                    fontSize: "1rem",
                    color: "#F5F0E8",
                    marginBottom: "0.2rem",
                  }}>
                    {work.title}
                  </p>
                  <p style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    fontSize: "0.8rem",
                    color: "rgba(245,240,232,0.55)",
                  }}>
                    {work.medium} · {work.year}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link href="/collect" className="btn-dark w-full inline-flex items-center justify-center gap-3 px-8 py-3.5">
              View all works
              <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 6 — Connect strip
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-14 md:py-20 px-6 md:px-10 border-t border-brand-sand/60" style={{ background: "#F5F0E8" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">

          <div>
            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: "clamp(1.3rem, 3vw, 2rem)",
              color: "#1C1C1C",
              lineHeight: 1.3,
            }}>
              "Every work is a conversation<br />
              <em style={{ color: "#C9A96E" }}>between two strangers.</em>"
            </p>
          </div>

          <div className="flex flex-col gap-4 items-center md:items-end w-full md:w-auto">
            <a
              href="https://www.instagram.com/kala_samputah"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 group"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#8B7355",
                textDecoration: "none",
              }}
            >
              <FaInstagram style={{ color: "#C9A96E" }} />
              Follow @kala_samputah
            </a>
            <a
              href="mailto:RATULM28@GMAIL.COM"
              className="btn-dark w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5"
            >
              Inquire about a commission
              <FaArrowRight className="text-[10px]" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
