"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import ArtCard from "./ArtCard";
import { paintings } from "./data";

export default function Paintings() {
  const [works, setWorks] = useState(paintings);

  useEffect(() => {
    fetch("/api/artworks")
      .then((res) => res.json())
      .then((data) => {
        if (data.artworks && data.artworks.length > 0) {
          const formatted = data.artworks.map((a) => ({
            id: a._id,
            _id: a._id,
            title: a.title,
            artist: a.artist || "Nancy Sikri",
            medium: a.medium || "Mixed Media on Canvas",
            size: a.dimensions || a.size || "",
            year: a.year || new Date().getFullYear(),
            color: a.color || "Amber",
            category: a.category?.name || a.category || "Paintings",
            src: a.images?.[0] || a.image || "/art/placeholder.jpg",
            featured: a.featured,
          }));

          const combined = [...formatted];
          paintings.forEach((p) => {
            if (!combined.some((c) => c.title?.toLowerCase() === p.title?.toLowerCase())) {
              combined.push(p);
            }
          });
          setWorks(combined.slice(0, 8));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 md:py-24 px-4 md:px-10 bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-10 md:mb-14">
          <p className="section-title mb-3">Explore</p>
          <h2
            className="text-brand-dark text-3xl md:text-5xl"
            style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontWeight: 300, letterSpacing: "0.1em" }}
          >
            PAINTINGS
          </h2>
          <div className="divider w-24 mx-auto mt-4" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {works.map((art, i) => (
            <ArtCard key={art.id || art._id || i} {...art} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/collect" className="btn-outline inline-flex items-center gap-3 px-10 py-4">
            VIEW ALL
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
