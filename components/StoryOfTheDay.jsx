"use client";

import Image from "next/image";
import { FaArrowRight, FaShareAlt } from "react-icons/fa";

const story = {
  src: "/art/655428058_18542777713071262_2316752950858361917_n.jpg",
  title: "The Art of Raw Emotion",
  subtitle: "From abstract chaos to painted clarity",
  tags: ["Abstract Expression", "Original Series"],
};

export default function StoryOfTheDay() {
  return (
    <section className="py-16 md:py-24 bg-brand-beige">
      {/* Title */}
      <div className="text-center mb-8 md:mb-12">
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 400,
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            color: "#1C1C1C",
            letterSpacing: "0.01em",
          }}
        >
          Story of the day
        </h2>
      </div>

      {/* Big card */}
      <div className="mx-4 md:mx-10 lg:mx-20 xl:mx-32">
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: "20px",
            aspectRatio: "16 / 7",
            boxShadow: "0 12px 48px rgba(28,28,28,0.18)",
          }}
        >
          <Image
            src={story.src}
            alt={story.title}
            fill
            className="object-cover"
            priority
          />

          {/* Dark gradient overlay — stronger at bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.80) 0%, rgba(10,10,10,0.25) 45%, transparent 100%)",
            }}
          />

          {/* Top-left thin white line indicator */}
          <div
            className="absolute top-5 left-5"
            style={{ width: "2rem", height: "2px", background: "rgba(255,255,255,0.6)", borderRadius: "2px" }}
          />

          {/* Share button — top right */}
          <button
            aria-label="Share"
            className="absolute top-5 right-5 flex items-center justify-center"
            style={{
              width: "2.2rem",
              height: "2.2rem",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "none",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <FaShareAlt className="text-xs" />
          </button>

          {/* Bottom-left text */}
          <div className="absolute bottom-6 left-6 right-16">
            <p
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontWeight: 600,
                fontSize: "clamp(1.2rem, 2.8vw, 2rem)",
                color: "#FFFFFF",
                lineHeight: 1.2,
                marginBottom: "0.4rem",
              }}
            >
              {story.title}
            </p>
            <p
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(0.8rem, 1.4vw, 1rem)",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              {story.subtitle}
            </p>
          </div>

          {/* Arrow button — bottom right */}
          <button
            aria-label="Read story"
            className="absolute bottom-6 right-6 flex items-center justify-center"
            style={{
              width: "2.4rem",
              height: "2.4rem",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.32)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
          >
            <FaArrowRight className="text-sm" />
          </button>
        </div>

        {/* Tags below card */}
        <div className="flex gap-6 justify-center mt-5">
          {story.tags.map(tag => (
            <span
              key={tag}
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "0.82rem",
                color: "#6B5F55",
                letterSpacing: "0.04em",
                cursor: "pointer",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
