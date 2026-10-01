"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaArrowRight } from "react-icons/fa";

const posts = [
  {
    id: 1,
    category: "Process",
    title: "Why I never sketch before I paint",
    excerpt: "Planning kills the feeling. The first mark is always the most honest — and you can't plan honesty.",
    cover: "/art/822454183_18116058677070803_7997214052897677537_n.jpg",
    date: "Oct 2026",
    readTime: "4 min",
    featured: true,
  },
  {
    id: 2,
    category: "Behind the work",
    title: "The painting that took eight months",
    excerpt: "It sat against the wall, unfinished, for most of a year. Then one evening it told me what it needed.",
    cover: "/art/823606039_18116134385070803_3865341406544213906_n.jpg",
    date: "Sep 2026",
    readTime: "6 min",
    featured: false,
  },
  {
    id: 3,
    category: "Thoughts",
    title: "On selling something you made at 2am",
    excerpt: "Every collector is a stranger who agrees to carry something you felt. That never stops being strange.",
    cover: "/art/817902603_18115636340070803_3091029228027957233_n.jpg",
    date: "Aug 2026",
    readTime: "3 min",
    featured: false,
  },
  {
    id: 4,
    category: "Process",
    title: "Colour is not decoration. It is the argument.",
    excerpt: "I don't pick colours — they insist. The work of painting is mostly arguing with that insistence.",
    cover: "/art/818988016_18116134361070803_5613175907062480033_n.jpg",
    date: "Jul 2026",
    readTime: "5 min",
    featured: false,
  },
  {
    id: 5,
    category: "Behind the work",
    title: "What lockdown taught the studio",
    excerpt: "Forty works in eight months. When the world stops, the hand doesn't. It turns out space was always enough.",
    cover: "/art/794222736_18113991668070803_4825890433763461046_n.jpg",
    date: "Jun 2026",
    readTime: "7 min",
    featured: false,
  },
];

export default function JournalPage() {
  const [hovered, setHovered] = useState(null);
  const featured = posts.find(p => p.featured);
  const rest = posts.filter(p => !p.featured);

  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      <Navbar />

      {/* ── Hero — newspaper masthead over artwork ── */}
      <section className="relative w-full overflow-hidden" style={{ height: "75vh", minHeight: "480px" }}>

        {/* Background artwork — featured post cover */}
        {featured && (
          <Image
            src={featured.cover}
            alt=""
            fill
            className="object-cover"
            style={{ transform: "scale(1.02)" }}
            priority
          />
        )}

        {/* Strong dark overlay — heavier on left where text sits */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(10,8,6,0.88) 0%, rgba(10,8,6,0.6) 45%, rgba(10,8,6,0.15) 100%)",
          }}
        />

        {/* Thin top border */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{ height: "1px", background: "rgba(201,169,110,0.25)" }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between px-8 md:px-14 py-10 md:py-12">

          {/* Top row — date + issue */}
          <div className="flex items-center justify-between">
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: "0.58rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(245,240,232,0.3)",
            }}>
              Studio Journal
            </p>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(245,240,232,0.3)",
            }}>
              New Delhi · 2026
            </p>
          </div>

          {/* Center — big masthead title */}
          <div>
            {/* Thin rule above title */}
            <div style={{
              width: "100%",
              height: "1px",
              background: "rgba(245,240,232,0.12)",
              marginBottom: "1.2rem",
            }} />

            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontWeight: 400,
                fontSize: "clamp(4rem, 12vw, 10rem)",
                lineHeight: 0.88,
                color: "#F5F0E8",
                letterSpacing: "-0.01em",
              }}
            >
              Journal
            </h1>

            {/* Thin rule below title */}
            <div style={{
              width: "100%",
              height: "1px",
              background: "rgba(245,240,232,0.12)",
              marginTop: "1.2rem",
            }} />
          </div>

          {/* Bottom — post count + latest label */}
          <div className="flex items-end justify-between">
            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: "clamp(0.85rem, 1.5vw, 1.05rem)",
              color: "rgba(245,240,232,0.38)",
              letterSpacing: "0.02em",
            }}>
              Words from the studio.
            </p>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: "0.58rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(201,169,110,0.5)",
            }}>
              {posts.length} entries
            </p>
          </div>
        </div>
      </section>

      {/* ── Featured post ── */}
      {featured && (
        <section className="py-12 md:py-16 px-6 md:px-10 border-b border-brand-sand/40">
          <div className="max-w-7xl mx-auto">
            <p className="section-title mb-8">Featured</p>
            <div
              className="group grid md:grid-cols-2 gap-8 md:gap-14 items-center cursor-pointer"
              onMouseEnter={() => setHovered(featured.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="relative overflow-hidden" style={{ borderRadius: "6px", aspectRatio: "4/3" }}>
                <Image src={featured.cover} alt={featured.title} fill className="object-cover img-zoom" />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.58rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#C9A96E",
                  }}>
                    {featured.category}
                  </span>
                  <span style={{ width: "1px", height: "10px", background: "#C9A96E", opacity: 0.4, display: "inline-block" }} />
                  <span style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.58rem",
                    letterSpacing: "0.15em",
                    color: "#8B7355",
                  }}>
                    {featured.date} · {featured.readTime} read
                  </span>
                </div>

                <h2 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontWeight: 400,
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  color: "#1C1C1C",
                  lineHeight: 1.2,
                  marginBottom: "1rem",
                  letterSpacing: "0.01em",
                }}>
                  {featured.title}
                </h2>

                <p style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontStyle: "italic",
                  fontSize: "1.1rem",
                  color: "#6B5F55",
                  lineHeight: 1.7,
                  marginBottom: "1.8rem",
                }}>
                  {featured.excerpt}
                </p>

                <div className="inline-flex items-center gap-3"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: hovered === featured.id ? "#1C1C1C" : "#C9A96E",
                    transition: "color 0.3s ease",
                    cursor: "pointer",
                  }}>
                  Read
                  <span style={{
                    display: "inline-block",
                    height: "1px",
                    background: "currentColor",
                    width: hovered === featured.id ? "3rem" : "1.5rem",
                    transition: "width 0.4s ease",
                  }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Post list ── */}
      <section className="py-12 md:py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="section-title mb-10">All entries</p>

          <div className="flex flex-col divide-y"
            style={{ borderTop: "1px solid #E8DDD0", borderBottom: "1px solid #E8DDD0" }}>
            {rest.map((post) => (
              <div
                key={post.id}
                className="group grid grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto] items-center gap-6 py-7 cursor-pointer"
                onMouseEnter={() => setHovered(post.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Thumbnail — desktop only */}
                <div className="relative hidden md:block flex-shrink-0 overflow-hidden"
                  style={{ width: "80px", height: "80px", borderRadius: "4px" }}>
                  <Image src={post.cover} alt={post.title} fill className="object-cover img-zoom" />
                </div>

                {/* Text */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.55rem",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "#C9A96E",
                    }}>
                      {post.category}
                    </span>
                    <span style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.55rem",
                      letterSpacing: "0.15em",
                      color: "#8B7355",
                    }}>
                      {post.date}
                    </span>
                  </div>
                  <h3 style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontWeight: 400,
                    fontSize: "clamp(1.1rem, 2vw, 1.45rem)",
                    color: hovered === post.id ? "#1C1C1C" : "#2A2A2A",
                    lineHeight: 1.25,
                    marginBottom: "0.3rem",
                    transition: "color 0.3s ease",
                  }}>
                    {post.title}
                  </h3>
                  <p style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    fontSize: "0.9rem",
                    color: "#6B5F55",
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {post.excerpt}
                  </p>
                </div>

                {/* Arrow */}
                <div style={{
                  width: "2rem",
                  height: "2rem",
                  border: `1px solid ${hovered === post.id ? "#1C1C1C" : "#E8DDD0"}`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "border-color 0.3s ease, background 0.3s ease",
                  background: hovered === post.id ? "#1C1C1C" : "transparent",
                }}>
                  <FaArrowRight style={{
                    color: hovered === post.id ? "#F5F0E8" : "#C9A96E",
                    fontSize: "0.55rem",
                    transition: "color 0.3s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
