"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { allWorks } from "../../components/data";
import { FaArrowRight, FaSearchPlus, FaTimes, FaPalette } from "react-icons/fa";
import { useArtModal } from "../../components/ArtModalContext";

const edits = [
  {
    slug: "earth-and-ash",
    title: "Earth & Ash",
    subtitle: "Works that breathe in browns, ochres, and warm silence",
    cover: "/art/817902603_18115636340070803_3091029228027957233_n.jpg",
    count: 4,
    mood: "Grounded · Warm · Still",
    colors: ["Amber", "Yellow", "Blue"],
    ids: [4, 5, 8, 9],
  },
  {
    slug: "raw-and-unfinished",
    title: "Raw & Unfinished",
    subtitle: "Paintings that stopped exactly where they needed to",
    cover: "/art/822454183_18116058677070803_7997214052897677537_n.jpg",
    count: 3,
    mood: "Visceral · Honest · Incomplete",
    colors: ["Rose", "Crimson"],
    ids: [1, 2, 3],
  },
  {
    slug: "between-light",
    title: "Between Light",
    subtitle: "Compositions caught in the moment before clarity arrives",
    cover: "/art/794222736_18113991668070803_4825890433763461046_n.jpg",
    count: 3,
    mood: "Ethereal · Quiet · Contemplative",
    colors: ["Teal", "Blue", "Lavender"],
    ids: [8, 10, 11],
  },
  {
    slug: "dark-interiors",
    title: "Dark Interiors",
    subtitle: "Works made at night, when everything honest comes out",
    cover: "/art/823606039_18116134385070803_3865341406544213906_n.jpg",
    count: 3,
    mood: "Introspective · Heavy · True",
    colors: ["Crimson", "Amber", "Emerald"],
    ids: [1, 4, 7],
  },
];

const filterPalette = [
  { name: "All",      hex: "#1C1C1C" },
  { name: "Rose",     hex: "#f06292" },
  { name: "Crimson",  hex: "#e53935" },
  { name: "Amber",    hex: "#ef8c38" },
  { name: "Yellow",   hex: "#fdd835" },
  { name: "Teal",     hex: "#3aafa9" },
  { name: "Blue",     hex: "#2d9de5" },
  { name: "Lavender", hex: "#b39ddb" },
  { name: "Emerald",  hex: "#43a047" },
];

export default function EditsPage() {
  const [hovered, setHovered] = useState(null);
  const [selectedColor, setSelectedColor] = useState("All");
  const { openArtwork, openInquiry } = useArtModal();

  // Filter edits according to color
  const filteredEdits = selectedColor === "All"
    ? edits
    : edits.filter(e => e.colors.includes(selectedColor));

  // Also filter individual matching works if color selected
  const matchingColorWorks = selectedColor === "All"
    ? []
    : allWorks.filter(w => w.color === selectedColor);

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
              onClick={() => openArtwork({
                title: edit.title,
                src: edit.cover,
                artist: "Nancy Sikri",
                medium: `Curated Series · ${edit.count} Works`,
                size: "Original Studio Series",
                year: 2024,
              })}
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

              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: isActive
                    ? "linear-gradient(to top, rgba(10,8,6,0.78) 0%, rgba(10,8,6,0.1) 60%, transparent 100%)"
                    : "rgba(10,8,6,0.55)",
                  transition: "background 0.5s ease",
                }}
              />

              {/* Panel number */}
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

                {isActive && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-white/20 text-white rounded text-[0.62rem] tracking-wider uppercase font-sans flex items-center gap-1 backdrop-blur-sm">
                      <FaSearchPlus className="text-brand-accent text-[9px]" />
                      Tap to Zoom Canvas
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Interactive Color Palette Filter Bar ── */}
      <div className="border-b border-[#E8E1D5] bg-[#F5EFE6]/70 py-4 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-dark font-sans font-medium">
            <FaPalette className="text-brand-accent text-sm" />
            <span>Filter Series by Palette:</span>
          </div>

          {/* Palette Swatch Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {filterPalette.map((p) => {
              const active = selectedColor === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => setSelectedColor(p.name)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all ${
                    active
                      ? "bg-brand-dark text-white font-medium shadow"
                      : "bg-white/80 hover:bg-white text-brand-muted border border-[#E0D7C9]"
                  }`}
                >
                  {p.name !== "All" && (
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-inner"
                      style={{ background: p.hex }}
                    />
                  )}
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>

          {selectedColor !== "All" && (
            <button
              onClick={() => setSelectedColor("All")}
              className="text-[0.68rem] tracking-wider uppercase font-sans text-brand-warm hover:text-brand-dark flex items-center gap-1 underline"
            >
              <FaTimes className="text-[9px]" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Edits grid ── */}
      <section className="py-12 md:py-20 px-5 md:px-10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Main Series Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {filteredEdits.map((edit) => {
              const works = allWorks.filter(w => edit.ids.includes(w.id)).slice(0, 3);
              const isHov = hovered === edit.slug;

              const editCoverWork = {
                title: edit.title,
                src: edit.cover,
                artist: "Nancy Sikri",
                medium: `Curated Series · ${edit.count} Works`,
                size: "Original Studio Series",
                year: 2024,
              };

              return (
                <div
                  key={edit.slug}
                  className="group relative overflow-hidden rounded-lg bg-[#F5F0E8] border border-[#EAE2D5] transition-all duration-300 hover:shadow-xl"
                  onMouseEnter={() => setHovered(edit.slug)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Cover image (Click to Zoom) */}
                  <div 
                    onClick={() => openArtwork(editCoverWork)}
                    className="relative w-full overflow-hidden cursor-pointer" 
                    style={{ aspectRatio: "16/9" }}
                  >
                    <Image src={edit.cover} alt={edit.title} fill className="object-cover img-zoom" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                    {/* Mood pill */}
                    <div className="absolute top-4 left-4 font-display italic text-[0.78rem] text-[#F5F0E8] bg-black/45 backdrop-blur-md px-3 py-1 rounded">
                      {edit.mood}
                    </div>

                    {/* Hover Lens hint */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-brand-dark text-xs tracking-wider uppercase font-sans font-medium shadow">
                        <FaSearchPlus className="text-brand-accent text-xs" />
                        Inspect Series Cover
                      </span>
                    </div>

                    {/* Mini preview strip of paintings (Each clickable to Zoom!) */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
                      <span className="text-[0.6rem] tracking-wider uppercase text-white/80 font-sans hidden sm:inline-block">
                        Series Works:
                      </span>
                      {works.map(w => (
                        <div 
                          key={w.id} 
                          onClick={(e) => {
                            e.stopPropagation();
                            openArtwork(w);
                          }}
                          title={`Click to inspect: ${w.title}`}
                          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded overflow-hidden border-2 border-white/70 shadow hover:border-brand-accent transition-all cursor-pointer hover:scale-110"
                        >
                          <Image src={w.src} alt={w.title} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Text and Actions block */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display font-medium text-2xl text-brand-dark mb-1">
                          {edit.title}
                        </h2>
                        <p className="font-display italic text-sm text-[#6B5F55] leading-relaxed">
                          {edit.subtitle}
                        </p>
                      </div>

                      {/* Arrow / Inspect button */}
                      <button
                        onClick={() => openArtwork(editCoverWork)}
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-brand-sand bg-white text-brand-dark hover:bg-brand-dark hover:text-white transition-all shadow-sm"
                        title="View with Lens Zoom"
                        aria-label="Inspect Series"
                      >
                        <FaSearchPlus className="text-sm text-brand-accent" />
                      </button>
                    </div>

                    {/* Buttons: Inquire & Inspect */}
                    <div className="mt-5 pt-4 border-t border-[#E8E0D2] flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[0.62rem] tracking-widest uppercase font-sans text-brand-warm font-semibold">
                        {edit.count} Original Works in Series
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openInquiry(editCoverWork)}
                          className="px-4 py-2 bg-brand-dark hover:bg-brand-warm text-brand-cream text-xs tracking-wider uppercase font-sans font-medium rounded transition-colors"
                        >
                          Inquire for Quote
                        </button>
                        <button
                          type="button"
                          onClick={() => openArtwork(editCoverWork)}
                          className="px-3.5 py-2 border border-brand-sand bg-white hover:bg-neutral-50 text-brand-dark text-xs tracking-wider uppercase font-sans rounded transition-colors"
                        >
                          Inspect Canvas
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* If a specific color is selected, show its individual artworks too */}
          {selectedColor !== "All" && matchingColorWorks.length > 0 && (
            <div className="pt-8 border-t border-[#E8E1D5]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="text-[0.65rem] tracking-widest uppercase text-brand-accent font-sans font-medium">
                    Individual Works
                  </span>
                  <h3 className="font-display text-2xl text-brand-dark">
                    All {selectedColor} Palette Paintings
                  </h3>
                </div>
                <Link
                  href={`/collect?color=${selectedColor}`}
                  className="text-xs uppercase tracking-wider text-brand-warm hover:text-brand-dark border-b border-brand-warm pb-0.5 font-sans"
                >
                  View in Collection →
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {matchingColorWorks.map((work) => (
                  <div
                    key={work.id}
                    onClick={() => openArtwork(work)}
                    className="group bg-white rounded-lg p-3 border border-[#EAE2D5] cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="relative aspect-[3/4] w-full rounded overflow-hidden mb-3 bg-neutral-100">
                      <Image src={work.src} alt={work.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <h4 className="font-display text-base text-brand-dark truncate">{work.title}</h4>
                    <p className="text-xs text-brand-muted font-sans mb-3">{work.medium} · {work.size}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openInquiry(work);
                        }}
                        className="w-full py-1.5 text-center text-[0.65rem] tracking-wider uppercase font-sans font-medium bg-brand-dark text-white rounded hover:bg-brand-warm transition-colors"
                      >
                        Inquire for Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
