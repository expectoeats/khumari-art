"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#F4EBE1", color: "#4A2818" }}
    >

      {/* ── Top bar ── */}
      <header
        className="flex items-center justify-between px-6 md:px-12 py-5 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(74,40,24,0.1)" }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: "italic",
            fontSize: "1.35rem",
            color: "#4A2818",
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}
        >
          Kala Samputah
        </Link>

        {/* Pill button */}
        <Link
          href="/collect"
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: "0.62rem",
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#4A2818",
            textDecoration: "none",
            border: "1.5px solid #4A2818",
            borderRadius: "999px",
            padding: "0.5rem 1.4rem",
            transition: "background 0.25s ease, color 0.25s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#4A2818";
            e.currentTarget.style.color = "#F4EBE1";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#4A2818";
          }}
        >
          Collect
        </Link>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">

        {/* ── Marquee background text ── */}
        <div
          className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
          aria-hidden
        >
          {/* Two identical strips stacked — creates seamless vertical fill */}
          {[0, 1].map(row => (
            <div
              key={row}
              className="absolute w-full flex whitespace-nowrap"
              style={{ top: row === 0 ? "15%" : "52%" }}
            >
              {/* Duplicate the strip so it loops seamlessly */}
              {[0, 1].map(copy => (
                <span
                  key={copy}
                  className="flex items-center flex-shrink-0"
                  style={{
                    animation: `marquee404 ${row === 0 ? "18s" : "22s"} linear infinite${row === 1 ? " reverse" : ""}`,
                    willChange: "transform",
                  }}
                >
                  {[...Array(6)].map((_, i) => (
                    <span
                      key={i}
                      style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontWeight: 900,
                        fontSize: "18vw",
                        lineHeight: 0.9,
                        color: "rgba(74,40,24,0.07)",
                        textTransform: "uppercase",
                        letterSpacing: "-0.02em",
                        paddingRight: "4vw",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {i % 2 === 0 ? "NOT FOUND" : "404"}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* ── Art placeholder ── */}
        <div
          className="relative z-10 mb-8 md:mb-10"
          style={{
            width: "clamp(120px, 22vw, 200px)",
            aspectRatio: "3 / 4",
            boxShadow: "0 20px 60px rgba(74,40,24,0.18), 0 6px 20px rgba(74,40,24,0.1)",
          }}
        >
          <Image
            src="/art/822454183_18116058677070803_7997214052897677537_n.jpg"
            alt="Artwork"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* ── Description text ── */}
        <p
          className="relative z-10 text-center px-6"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: "italic",
            fontSize: "clamp(0.88rem, 1.6vw, 1.05rem)",
            color: "rgba(74,40,24,0.55)",
            lineHeight: 1.75,
            maxWidth: "42ch",
            marginBottom: "2rem",
          }}
        >
          This is a 404 error, which means you've clicked on a bad link
          or entered an invalid URL. Maybe what you are looking for can
          be found in the homepage.
        </p>

        {/* ── CTA button ── */}
        <Link
          href="/"
          className="relative z-10"
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#4A2818",
            textDecoration: "none",
            border: "1.5px solid #4A2818",
            padding: "0.85rem 2.4rem",
            display: "inline-block",
            transition: "background 0.25s ease, color 0.25s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#4A2818";
            e.currentTarget.style.color = "#F4EBE1";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#4A2818";
          }}
        >
          Go to the Home Page
        </Link>
      </main>

      {/* ── Marquee keyframe injected via style tag ── */}
      <style>{`
        @keyframes marquee404 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
