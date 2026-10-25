"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { blogPosts } from "../../../components/data";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function BlogPostPage() {
  const { slug } = useParams();
  const post     = blogPosts.find(p => p.slug === slug);

  if (!post) return notFound();

  const currentIndex = blogPosts.findIndex(p => p.slug === slug);
  const prev = blogPosts[currentIndex - 1] || null;
  const next = blogPosts[currentIndex + 1] || null;

  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      <Navbar />

      {/* ── Cover hero ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "52vh", minHeight: "300px" }}
      >
        <Image
          src={post.cover}
          alt={post.title}
          fill
          className="object-cover"
          priority
          style={{ transform: "scale(1.02)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,8,6,0.75) 0%, rgba(10,8,6,0.2) 50%, transparent 100%)",
          }}
        />

        {/* Back link */}
        <Link
          href="/blog"
          className="absolute top-8 left-8 md:left-14 z-10 flex items-center gap-2 transition-colors"
          style={{
            fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(245,240,232,0.55)",
            textDecoration: "none",
          }}
        >
          <FaArrowLeft className="text-[9px]" />
          All stories
        </Link>

        {/* Bottom meta */}
        <div className="absolute bottom-8 left-8 md:left-14 z-10" style={{ maxWidth: "600px" }}>
          <div className="flex items-center gap-3 mb-3">
            <span style={{
              fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: "0.58rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#C9A96E",
            }}>
              {post.category}
            </span>
            <span style={{ width: "1px", height: "8px", background: "rgba(201,169,110,0.4)", display: "inline-block" }} />
            <span style={{
              fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: "0.58rem",
              letterSpacing: "0.15em",
              color: "rgba(245,240,232,0.45)",
            }}>
              {post.date} · {post.readTime} read
            </span>
          </div>
          <h1 style={{
            fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif',
            fontWeight: 400,
            fontSize: "clamp(1.6rem, 4vw, 3rem)",
            lineHeight: 1.1,
            color: "#F5F0E8",
            letterSpacing: "0.01em",
          }}>
            {post.title}
          </h1>
        </div>
      </div>

      {/* ── Article body ── */}
      <article className="max-w-2xl mx-auto px-6 md:px-0 py-14 md:py-20">

        {/* Excerpt / lead */}
        <p style={{
          fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
          fontStyle: "italic",
          fontSize: "clamp(1.1rem, 2.2vw, 1.35rem)",
          color: "#8B7355",
          lineHeight: 1.7,
          marginBottom: "2.5rem",
          paddingBottom: "2.5rem",
          borderBottom: "1px solid #E8E4DE",
        }}>
          {post.excerpt}
        </p>

        {/* Content blocks */}
        <div className="flex flex-col gap-6">
          {post.content.map((block, i) => {
            if (block.type === "paragraph") {
              return (
                <p
                  key={i}
                  style={{
                    fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: "clamp(1rem, 1.8vw, 1.12rem)",
                    lineHeight: 1.85,
                    color: "#2A2A2A",
                    letterSpacing: "0.01em",
                  }}
                >
                  {block.text}
                </p>
              );
            }

            if (block.type === "quote") {
              return (
                <blockquote
                  key={i}
                  style={{
                    borderLeft: "2px solid #C9A96E",
                    paddingLeft: "1.5rem",
                    margin: "1rem 0",
                  }}
                >
                  <p style={{
                    fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                    fontStyle: "italic",
                    fontSize: "clamp(1.15rem, 2vw, 1.35rem)",
                    color: "#8B7355",
                    lineHeight: 1.65,
                  }}>
                    "{block.text}"
                  </p>
                </blockquote>
              );
            }

            return null;
          })}
        </div>

        {/* Byline */}
        <div
          className="flex items-center gap-4 mt-14 pt-10"
          style={{ borderTop: "1px solid #E8E4DE" }}
        >
          <div
            className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0"
            style={{ border: "1px solid #E8E4DE" }}
          >
            <Image src="/avatar.webp" alt="Nancy Sikri" fill className="object-cover" />
          </div>
          <div>
            <p style={{
              fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 400,
              fontSize: "1rem",
              color: "#1C1C1C",
            }}>
              Nancy Sikri
            </p>
            <p style={{
              fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
              fontStyle: "italic",
              fontSize: "0.82rem",
              color: "#8B7355",
            }}>
              Abstract Painter · New Delhi
            </p>
          </div>
        </div>
      </article>

      {/* ── Prev / Next navigation ── */}
      {(prev || next) && (
        <div
          className="max-w-7xl mx-auto px-6 md:px-10 py-10 grid grid-cols-1 md:grid-cols-2 gap-4"
          style={{ borderTop: "1px solid #E8E4DE" }}
        >
          {prev ? (
            <Link
              href={`/blog/${prev.slug}`}
              className="group flex items-center gap-4 p-6 transition-colors"
              style={{
                border: "1px solid #E8E4DE",
                borderRadius: "4px",
                textDecoration: "none",
                background: "transparent",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#C9A96E")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#E8E4DE")}
            >
              <FaArrowLeft style={{ color: "#C9A96E", flexShrink: 0, fontSize: "0.7rem" }} />
              <div>
                <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355", marginBottom: "0.3rem" }}>
                  Previous
                </p>
                <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "1rem", color: "#1C1C1C", lineHeight: 1.3 }}>
                  {prev.title}
                </p>
              </div>
            </Link>
          ) : <div />}

          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="group flex items-center justify-end gap-4 p-6 transition-colors text-right"
              style={{
                border: "1px solid #E8E4DE",
                borderRadius: "4px",
                textDecoration: "none",
                background: "transparent",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#C9A96E")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#E8E4DE")}
            >
              <div>
                <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355", marginBottom: "0.3rem" }}>
                  Next
                </p>
                <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "1rem", color: "#1C1C1C", lineHeight: 1.3 }}>
                  {next.title}
                </p>
              </div>
              <FaArrowRight style={{ color: "#C9A96E", flexShrink: 0, fontSize: "0.7rem" }} />
            </Link>
          ) : <div />}
        </div>
      )}

      {/* ── More posts ── */}
      <section className="py-12 md:py-16 px-6 md:px-10" style={{ background: "#F5F0E8" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="section-title mb-1">Keep reading</p>
              <h3 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontWeight: 400, fontSize: "1.8rem", color: "#1C1C1C" }}>
                More from the studio
              </h3>
            </div>
            <Link
              href="/blog"
              style={{
                fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: "0.62rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C9A96E",
                textDecoration: "none",
              }}
            >
              All stories →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts
              .filter(p => p.slug !== slug)
              .slice(0, 3)
              .map(p => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="relative overflow-hidden mb-4"
                    style={{ borderRadius: "4px", aspectRatio: "3/2" }}
                  >
                    <Image
                      src={p.cover}
                      alt={p.title}
                      fill
                      className="object-cover"
                      style={{ transition: "transform 0.6s ease" }}
                    />
                  </div>
                  <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.4rem" }}>
                    {p.category}
                  </p>
                  <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "1.05rem", color: "#1C1C1C", lineHeight: 1.3 }}>
                    {p.title}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
