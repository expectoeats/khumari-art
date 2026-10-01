import Link from "next/link";
import { FaInstagram, FaFacebookF, FaPinterestP } from "react-icons/fa";

const footerNav = [
  { label: "Collect",   href: "/collect" },
  { label: "Artists",   href: "/artists" },
  { label: "The Edits", href: "/edits"   },
  { label: "Journal",   href: "/journal" },
  { label: "About",     href: "/info"    },
];

export default function Footer() {
  return (
    <footer id="connect" className="bg-brand-dark">

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-20 md:pt-28 pb-16 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10 items-start">

          {/* Col 1 — Artist identity */}
          <div className="space-y-6">
            <div>
              <p
                className="text-brand-cream mb-1"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontWeight: 400,
                  fontSize: "1.6rem",
                  letterSpacing: "0.04em",
                }}
              >
                Nancy Sikri
              </p>
              <p
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontStyle: "italic",
                  fontSize: "0.95rem",
                  color: "#8B7355",
                  letterSpacing: "0.02em",
                }}
              >
                Abstract Painter, New Delhi
              </p>
            </div>

            <p
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "rgba(232,221,208,0.45)",
                maxWidth: "22ch",
              }}
            >
              Self-taught. Emotion-driven. Each work is an open invitation to feel.
            </p>

            {/* Social */}
            <div className="flex gap-4 pt-2">
              {[
                { Icon: FaInstagram,  href: "https://www.instagram.com/kala_samputah" },
                { Icon: FaFacebookF,  href: "#" },
                { Icon: FaPinterestP, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-brand-sand/30 hover:text-brand-accent transition-colors duration-300"
                >
                  <Icon className="text-base" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <div className="space-y-4">
            <p
              className="mb-5"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: "0.8rem",
                color: "#8B7355",
                letterSpacing: "0.08em",
              }}
            >
              Explore
            </p>
            {footerNav.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="block text-brand-sand/30 hover:text-brand-accent transition-colors duration-300"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1.05rem",
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Col 3 — Inquire */}
          <div className="space-y-6">
            <p
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: "0.8rem",
                color: "#8B7355",
                letterSpacing: "0.08em",
              }}
            >
              Get in touch
            </p>

            <div className="space-y-1">
              <p
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1.35rem",
                  fontWeight: 300,
                  color: "rgba(245,240,232,0.75)",
                  lineHeight: 1.35,
                  letterSpacing: "0.01em",
                }}
              >
                Interested in a piece?
              </p>
              <p
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1.35rem",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "#C9A96E",
                  letterSpacing: "0.01em",
                  lineHeight: 1.35,
                }}
              >
                Let's talk.
              </p>
            </div>

            <a
              href="mailto:RATULM28@GMAIL.COM"
              className="inline-block text-brand-sand/40 hover:text-brand-accent border-b border-brand-accent/20 hover:border-brand-accent pb-0.5 transition-all duration-300"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
              }}
            >
              ratulm28@gmail.com
            </a>
          </div>

        </div>
      </div>

      {/* ── Gold rule ── */}
      <div
        className="mx-6 md:mx-16"
        style={{
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(201,169,110,0.3), transparent)",
        }}
      />

      {/* ── Bottom bar ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "0.78rem",
            color: "rgba(232,221,208,0.18)",
            letterSpacing: "0.06em",
          }}
        >
          © 2026 Nancy Sikri
        </p>
        <p
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: "italic",
            fontSize: "0.78rem",
            color: "rgba(201,169,110,0.25)",
            letterSpacing: "0.04em",
          }}
        >
          @kala_samputah
        </p>
      </div>

    </footer>
  );
}
