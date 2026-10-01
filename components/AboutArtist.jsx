import Image from "next/image";
import { FaInstagram, FaArrowRight } from "react-icons/fa";

export default function AboutArtist() {
  return (
    <section className="relative py-14 md:py-32 overflow-hidden bg-brand-beige">

      {/* Background blob shapes */}
      <div
        className="absolute top-10 left-[-80px] w-64 h-64 opacity-10 blob-shape"
        style={{ background: "#C9A96E", borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
      />
      <div
        className="absolute bottom-10 right-[-60px] w-48 h-48 opacity-10 blob-shape"
        style={{ background: "#8B7355", borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%", animationDelay: "3s" }}
      />

      {/* Decorative large text */}
      <div className="absolute top-16 right-8 md:right-24 rotate-12 opacity-10 select-none pointer-events-none">
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "6rem", fontWeight: 300, color: "#8B7355", lineHeight: 1 }}>
          Art
        </span>
      </div>
      <div className="absolute bottom-16 left-8 md:left-24 -rotate-6 opacity-10 select-none pointer-events-none">
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "4rem", fontWeight: 300, color: "#8B7355", lineHeight: 1 }}>
          Soul
        </span>
      </div>

      {/* Rotating dashed ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5 rotate-slow pointer-events-none hidden md:block">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#C9A96E" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="#8B7355" strokeWidth="0.3" strokeDasharray="2 6" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 relative z-10">

        {/* Section heading */}
        <div className="text-center mb-10 md:mb-20">
          <p className="section-title mb-3">The Artist</p>
          <h2
            className="text-brand-dark text-4xl md:text-6xl"
            style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 300, letterSpacing: "0.06em" }}
          >
            Meet{" "}
            <span className="relative inline-block italic">
              Nancy
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 8" preserveAspectRatio="none" height="8">
                <path d="M2 6 Q30 1 60 5 Q90 9 118 3" stroke="#C9A96E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Photo column */}
          <div className="relative flex justify-center">

            {/* Dot grid */}
            <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 grid grid-cols-4 gap-2 opacity-30">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-warm" />
              ))}
            </div>

            {/* Gold offset frame */}
            <div
              className="absolute top-3 left-3 md:top-6 md:left-6 aspect-[3/4] border border-brand-accent opacity-40"
              style={{ width: "100%", maxWidth: "340px" }}
            />

            {/* Photo */}
            <div className="relative w-full max-w-[260px] md:max-w-[320px] aspect-[3/4] overflow-hidden z-10">
              <Image
                src="/avatar.webp"
                alt="Nancy Sikri — Artist"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/20 to-transparent" />
            </div>
          </div>

          {/* Text column */}
          <div className="space-y-8">

            <div>
              <h3
                className="text-brand-dark text-3xl md:text-4xl mb-1"
                style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}
              >
                Nancy Sikri
              </h3>
              <p className="section-title">Abstract Painter · New Delhi, India</p>
            </div>

            <div className="divider w-16" />

            <div
              className="space-y-4 md:space-y-5 text-brand-charcoal"
              style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)", lineHeight: 1.85 }}
            >
              <p>
                Art chose Nancy long before she chose it. Growing up surrounded by creative energy,
                she found her voice in abstract expression — a language beyond words.
              </p>
              <p>
                Every canvas she creates is an invitation: to pause, feel, and discover
                something honest within yourself. Her work lives in the space between
                emotion and instinct.
              </p>
              <p className="italic text-brand-warm">
                "I don't paint what I see. I paint what I feel."
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:flex md:gap-8 pt-2">
              {[
                { value: "256",  label: "Original Works" },
                { value: "6.9k", label: "Followers"      },
                { value: "7+",   label: "Years Creating" },
              ].map((stat, i, arr) => (
                <div key={stat.label} className="flex gap-4 md:gap-8 items-start">
                  <div>
                    <p
                      className="text-brand-dark text-xl md:text-3xl"
                      style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 300 }}
                    >
                      {stat.value}
                    </p>
                    <p className="section-title text-[0.58rem] md:text-[0.62rem] mt-0.5">{stat.label}</p>
                  </div>
                  {i < arr.length - 1 && <div className="w-[1px] self-stretch bg-brand-sand hidden md:block" />}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-2">
              <button className="btn-dark px-8 py-3.5 inline-flex items-center justify-center gap-2.5 w-full md:w-auto">
                View Portfolio
                <FaArrowRight className="text-[10px]" />
              </button>
              <a
                href="https://www.instagram.com/kala_samputah"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline px-8 py-3.5 inline-flex items-center justify-center gap-2.5 w-full md:w-auto"
              >
                <FaInstagram />
                @kala_samputah
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
