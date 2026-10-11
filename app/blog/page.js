"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { blogPosts } from "../../components/data";

const categories = ["All", ...Array.from(new Set(blogPosts.map(p => p.category)))];

export default function BlogPage() {
  const [active, setActive] = useState("All");
  const [hovered, setHovered] = useState(null);

  const visible = active === "All"
    ? blogPosts
    : blogPosts.filter(p => p.category === active);

  const featured = blogPosts[0];
  const rest     = blogPosts.slice(1);
  const visibleRest = active === "All" ? rest : visible;

  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "58vh", minHeight: "340px" }}
      >
        <Image
          src={featured.cover}
          alt={featured.title}
          fill
          className="object-cover"
          priority
          style={{ transform: "scale(1.02)" }}
        />
        {/* Left-heavy gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(10,8,6,0.88) 0%, rgba(10,8,6,0.55) 45%, rgba(10,8,6,0.1) 100%)",
          }}
        />

        {/* Top line */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{ height: "1px", background: "rgba(201,169,110,0.2)" }}
        />

        <div className="absolute inset-0 flex flex-col justify-between px-8 md:px-14 py-10 md:py-12">
          {/* Top */}
          <div className="flex items-center justify-between">
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.58rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(245,240,232,0.3)",
            }}>
              Studio Blog
            </p>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(245,240,232,0.3)",
            }}>
              {blogPosts.length} stories
            </p>
          </div>

          {/* Big title */}
          <div>
            <div style={{ width: "100%", height: "1px", background: "rgba(245,240,232,0.1)", marginBottom: "1.2rem" }} />
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 400,
              fontSize: "clamp(3.5rem, 10vw, 8rem)",
              lineHeight: 0.9,
              color: "#F5F0E8",
              letterSpacing: "-0.01em",
            }}>
              From the<br />
              <em style={{ color: "#C9A96E" }}>Studio</em>
            </h1>
            <div style={{ width: "100%", height: "1px", background: "rgba(245,240,232,0.1)", marginTop: "1.2rem" }} />
          </div>

          {/* Bottom */}
          <div className="flex items-end justify-between">
            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: "clamp(0.85rem, 1.4vw, 1rem)",
              color: "rgba(245,240,232,0.35)",
            }}>
              Thoughts, process, and things worth saying.
            </p>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.58rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(201,169,110,0.5)",
            }}>
              Nancy Sikri · 2026
            </p>
          </div>
        </div>
      </section>

      {/* ── Filter bar ── */}
      <div
        className="sticky z-40 border-b"
        style={{
          top: "64px",
          background: "rgba(253,250,245,0.95)",
          backdropFilter: "blur(8px)",
          borderColor: "#E8E4DE",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="relative flex-shrink-0 py-4 px-5 transition-colors duration-200"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: active === cat ? "#1C1C1C" : "#8B7355",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {cat}
              {active === cat && (
                <span
                  className="absolute bottom-0 left-5 right-5"
                  style={{ height: "2px", background: "#1C1C1C", borderRadius: "2px" }}
                />
              )}
            </button>
          ))}
          <span
            className="ml-auto flex-shrink-0"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: "0.85rem",
              color: "#8B7355",
            }}
          >
            {visible.length} {visible.length === 1 ? "post" : "posts"}
          </span>
        </div>
      </div>

      {/* ── Featured post (only when All) ── */}
      {active === "All" && (
        <section className="py-12 md:py-16 px-6 md:px-10 border-b" style={{ borderColor: "#E8E4DE" }}>
          <div className="max-w-7xl mx-auto">
            <p className="section-title mb-8">Latest</p>
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid md:grid-cols-2 gap-8 md:gap-14 items-center"
              style={{ textDecoration: "none" }}
              onMouseEnter={() => setHovered(featured.slug)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Cover */}
              <div
                className="relative overflow-hidden"
                style={{ borderRadius: "4px", aspectRatio: "4/3" }}
              >
                <Image
                  src={featured.cover}
                  alt={featured.title}
                  fill
                  className="object-cover"
                  style={{
                    transform: hovered === featured.slug ? "scale(1.04)" : "scale(1)",
                    transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)",
                  }}
                />
              </div>

              {/* Text */}
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
                  <span style={{ width: "1px", height: "10px", background: "rgba(201,169,110,0.4)", display: "inline-block" }} />
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
                  lineHeight: 1.15,
                  marginBottom: "1rem",
                  letterSpacing: "0.01em",
                  transition: "color 0.25s ease",
                }}>
                  {featured.title}
                </h2>

                <p style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontStyle: "italic",
                  fontSize: "1.05rem",
                  color: "#6B5F55",
                  lineHeight: 1.75,
                  marginBottom: "1.8rem",
                }}>
                  {featured.excerpt}
                </p>

                <span style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.62rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: hovered === featured.slug ? "#1C1C1C" : "#C9A96E",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  transition: "color 0.25s ease",
                }}>
                  Read
                  <span style={{
                    display: "inline-block",
                    height: "1px",
                    background: "currentColor",
                    width: hovered === featured.slug ? "3rem" : "1.5rem",
                    transition: "width 0.4s ease",
                  }} />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── Post grid ── */}
      <section className="py-12 md:py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          {active !== "All" && <p className="section-title mb-10">{active}</p>}
          {active === "All" && <p className="section-title mb-10">All stories</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {visibleRest.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col"
                style={{ textDecoration: "none" }}
                onMouseEnter={() => setHovered(post.slug)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Cover */}
                <div
                  className="relative overflow-hidden mb-5"
                  style={{ borderRadius: "4px", aspectRatio: "3/2" }}
                >
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    className="object-cover"
                    style={{
                      transform: hovered === post.slug ? "scale(1.05)" : "scale(1)",
                      transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)",
                    }}
                  />
                  {/* Category pill */}
                  <div
                    className="absolute top-3 left-3"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.55rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#F5F0E8",
                      background: "rgba(10,8,6,0.5)",
                      backdropFilter: "blur(4px)",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "2px",
                    }}
                  >
                    {post.category}
                  </div>
                </div>

                {/* Meta */}
                <p style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.55rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#8B7355",
                  marginBottom: "0.6rem",
                }}>
                  {post.date} · {post.readTime} read
                </p>

                {/* Title */}
                <h3 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontWeight: 400,
                  fontSize: "1.25rem",
                  color: hovered === post.slug ? "#C9A96E" : "#1C1C1C",
                  lineHeight: 1.25,
                  marginBottom: "0.6rem",
                  transition: "color 0.25s ease",
                  flex: 1,
                }}>
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontStyle: "italic",
                  fontSize: "0.9rem",
                  color: "#6B5F55",
                  lineHeight: 1.65,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {post.excerpt}
                </p>

                {/* Read link */}
                <div
                  className="mt-4 flex items-center gap-2"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: hovered === post.slug ? "#1C1C1C" : "#C9A96E",
                    transition: "color 0.25s ease",
                  }}
                >
                  Read
                  <span style={{
                    height: "1px",
                    background: "currentColor",
                    width: hovered === post.slug ? "2rem" : "1rem",
                    display: "inline-block",
                    transition: "width 0.35s ease",
                  }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
