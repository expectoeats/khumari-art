"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { allWorks } from "../../components/data";
import { FaArrowRight } from "react-icons/fa";

const edits = [
  {
    slug: "earth-and-ash",
    title: "Earth & Ash",
    subtitle: "Works that breathe in browns, ochres, and warm silence",
    cover: "/art/817902603_18115636340070803_3091029228027957233_n.jpg",
    count: 4,
    mood: "Grounded · Warm · Still",
    ids: [4, 5, 8, 9],
  },
  {
    slug: "raw-and-unfinished",
    title: "Raw & Unfinished",
    subtitle: "Paintings that stopped exactly where they needed to",
    cover: "/art/822454183_18116058677070803_7997214052897677537_n.jpg",
    count: 3,
    mood: "Visceral · Honest · Incomplete",
    ids: [1, 2, 3],
  },
  {
    slug: "between-light",
    title: "Between Light",
    subtitle: "Compositions caught in the moment before clarity arrives",
    cover: "/art/794222736_18113991668070803_4825890433763461046_n.jpg",
    count: 3,
    mood: "Ethereal · Quiet · Contemplative",
    ids: [8, 10, 11],
  },
  {
    slug: "dark-interiors",
    title: "Dark Interiors",
    subtitle: "Works made at night, when everything honest comes out",
    cover: "/art/823606039_18116134385070803_3865341406544213906_n.jpg",
    count: 3,
    mood: "Introspective · Heavy · True",
    ids: [1, 4, 7],
  },
];

export default function EditsPage() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      <Navbar />

      {/* ── Mobile Hero ── */}
      <section
        className="md:hidden relative w-full overflow-hidden"
        style={{ minHeight: "340px", height: "42vh" }}
      >
        <Image
          src="/art/817902603_18115636340070803_3091029228027957233_n.jpg"
          alt="The Edits"
          fill
          priority
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(10, 8, 6, 0.55)" }}
        />
        <div className="absolute bottom-8 left-6 z-10">
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#C9A96E",
              marginBottom: "0.4rem",
            }}
          >
            Curated Series
          </p>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 400,
              fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
              color: "#F5F0E8",
              letterSpacing: "0.02em",
              lineHeight: 1.1,
            }}
          >
            The Edits
          </h1>
        </div>
      </section>

      {/* ── Desktop Hero — expanding panels ── */}
      <section
        className="hidden md:flex w-full overflow-hidden"
        style={{ height: "88vh", minHeight: "500px", cursor: "pointer" }}
        onMouseLeave={() => setHovered(null)}
      >
        {edits.map((edit, i) => {
          const isActive = hovered === edit.slug;
          const noneHovered = hovered === null;

          return (
            <div
              key={edit.slug}
              className="relative overflow-hidden flex-shrink-0"
              style={{
                width: isActive
                  ? "42%"
                  : noneHovered
                  ? "25%"
                  : "19.3%",
                transition: "width 0.65s cubic-bezier(0.77,0,0.175,1)",
                borderRight: i < edits.length - 1
                  ? "1px solid rgba(255,255,255,0.07)"
                  : "none",
              }}
              onMouseEnter={() => setHovered(edit.slug)}
            >
              {/* Image */}
              <Image
                src={edit.cover}
                alt={edit.title}
                fill
                className="object-cover"
                style={{
                  transform: isActive ? "scale(1.05)" : "scale(1.12)",
                  transition: "transform 0.8s ease",
                }}
                priority={i === 0}
              />

              {/* Overlay — darker on inactive */}
              <div
                className="absolute inset-0"
                style={{
                  background: isActive
                    ? "linear-gradient(to top, rgba(10,8,6,0.72) 0%, rgba(10,8,6,0.08) 60%, transparent 100%)"
                    : "rgba(10,8,6,0.55)",
                  transition: "background 0.5s ease",
                }}
              />

              {/* Panel number — top */}
              <div
                className="absolute top-6 left-5"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.55rem",
                  letterSpacing: "0.3em",
                  color: "rgba(201,169,110,0.5)",
                  writingMode: "vertical-rl",
                  textTransform: "uppercase",
                  opacity: isActive ? 0 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                0{i + 1}
              </div>

              {/* Bottom content */}
              <div
                className="absolute bottom-0 left-0 right-0 px-5 pb-8"
                style={{
                  opacity: isActive ? 1 : 0.7,
                  transition: "opacity 0.4s ease",
                }}
              >
                {/* Mood — only on active */}
                <p
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    fontSize: "0.78rem",
                    color: "rgba(201,169,110,0.7)",
                    marginBottom: "0.5rem",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(6px)",
                    transition: "opacity 0.35s ease 0.1s, transform 0.35s ease 0.1s",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {edit.mood}
                </p>

                {/* Title — vertical when inactive, horizontal when active */}
                <h2
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontWeight: 400,
                    fontSize: isActive ? "clamp(1.4rem, 2.5vw, 2.2rem)" : "0.9rem",
                    color: "#F5F0E8",
                    lineHeight: 1.15,
                    letterSpacing: "0.01em",
                    writingMode: isActive ? "horizontal-tb" : "vertical-rl",
                    transform: isActive ? "none" : "rotate(180deg)",
                    transition: "font-size 0.4s ease, writing-mode 0s 0.2s",
                    whiteSpace: isActive ? "normal" : "nowrap",
                  }}
                >
                  {edit.title}
                </h2>

                {/* Subtitle — only on active */}
                <p
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    fontSize: "0.82rem",
                    color: "rgba(245,240,232,0.45)",
                    marginTop: "0.5rem",
                    lineHeight: 1.5,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(8px)",
                    transition: "opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s",
                  }}
                >
                  {edit.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Edits grid ── */}
      <section className="py-12 md:py-24 px-5 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {edits.map((edit, i) => {
            const works = allWorks.filter(w => edit.ids.includes(w.id)).slice(0, 3);
            const isHov = hovered === edit.slug;

            return (
              <div
                key={edit.slug}
                className="group relative overflow-hidden cursor-pointer"
                style={{
                  borderRadius: "6px",
                  background: "#F5F0E8",
                  transition: "box-shadow 0.4s ease",
                  boxShadow: isHov ? "0 24px 60px rgba(28,28,28,0.14)" : "0 2px 12px rgba(28,28,28,0.05)",
                }}
                onMouseEnter={() => setHovered(edit.slug)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Cover image */}
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <Image src={edit.cover} alt={edit.title} fill className="object-cover img-zoom" />
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(20,18,16,0.7) 0%, rgba(20,18,16,0.1) 60%, transparent 100%)" }} />

                  {/* Mood pill */}
                  <div className="absolute top-4 left-4"
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontStyle: "italic",
                      fontSize: "0.78rem",
                      color: "rgba(245,240,232,0.65)",
                      background: "rgba(20,18,16,0.4)",
                      backdropFilter: "blur(6px)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "2px",
                    }}>
                    {edit.mood}
                  </div>

                  {/* Mini preview strip — bottom of image */}
                  <div className="absolute bottom-4 right-4 flex gap-1.5">
                    {works.map(w => (
                      <div key={w.id} className="relative w-10 h-10 rounded overflow-hidden border border-white/20">
                        <Image src={w.src} alt={w.title} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Text block */}
                <div className="px-6 py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontWeight: 500,
                        fontSize: "1.5rem",
                        color: "#1C1C1C",
                        marginBottom: "0.4rem",
                        letterSpacing: "0.01em",
                      }}>
                        {edit.title}
                      </h2>
                      <p style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontStyle: "italic",
                        fontSize: "0.95rem",
                        color: "#6B5F55",
                        lineHeight: 1.5,
                      }}>
                        {edit.subtitle}
                      </p>
                    </div>

                    <div
                      className="flex-shrink-0 w-9 h-9 flex items-center justify-center border border-brand-sand/60"
                      style={{
                        borderRadius: "50%",
                        background: isHov ? "#1C1C1C" : "transparent",
                        transition: "background 0.3s ease, border-color 0.3s ease",
                        borderColor: isHov ? "#1C1C1C" : undefined,
                      }}
                    >
                      <FaArrowRight style={{
                        color: isHov ? "#F5F0E8" : "#C9A96E",
                        fontSize: "0.6rem",
                        transition: "color 0.3s ease",
                      }} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div style={{ width: "1.5rem", height: "1px", background: "#C9A96E" }} />
                    <p style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.58rem",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "#8B7355",
                    }}>
                      {edit.count} works
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Bottom note ── */}
      <section className="py-12 md:py-16 px-6 md:px-10 border-t border-brand-sand/50" style={{ background: "#F5F0E8" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <p style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: "italic",
            fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
            color: "#1C1C1C",
          }}>
            Browse everything in the full collection.
          </p>
          <Link href="/collect" className="btn-dark w-full md:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 flex-shrink-0">
            Collect
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
