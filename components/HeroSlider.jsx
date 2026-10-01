"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from "react-icons/fa";
import { heroSlides } from "./data";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying]       = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, [isPlaying]);

  const nextSlide = () => setCurrentSlide(p => (p + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide(p => (p - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative w-full h-[62vh] md:h-[88vh] overflow-hidden">
      {heroSlides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.label}
            fill
            className={`object-cover ${i === currentSlide ? "ken-burns" : ""}`}
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
        </div>
      ))}

      {/* Bottom label */}
      <div className="absolute bottom-10 left-8 md:left-16 z-10">
        <p className="section-title mb-1" style={{ color: "rgba(255,255,255,0.65)" }}>
          {heroSlides[currentSlide].label}
        </p>
        <h2
          className="text-white text-3xl md:text-6xl"
          style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 300, lineHeight: 1.1 }}
        >
          Original Art by<br />Nancy Sikri
        </h2>
      </div>

      {/* Prev arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-all"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="text-xs" />
      </button>

      {/* Next arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-all"
        aria-label="Next slide"
      >
        <FaChevronRight className="text-xs" />
      </button>

      {/* Play/Pause */}
      <button
        onClick={() => setIsPlaying(v => !v)}
        className="absolute top-5 right-5 z-10 w-8 h-8 border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-all"
        aria-label="Play or pause slideshow"
      >
        {isPlaying ? <FaPause className="text-[10px]" /> : <FaPlay className="text-[10px]" />}
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-10 right-8 md:right-16 z-10 flex gap-2 items-center">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`transition-all duration-300 ${
              i === currentSlide ? "w-6 h-[2px] bg-white" : "w-2 h-[2px] bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
