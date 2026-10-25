"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaInstagram, FaFacebookF, FaPinterestP, FaWhatsapp } from "react-icons/fa";

const footerNav = [
  { label: "Collect",   href: "/collect" },
  { label: "Artists",   href: "/artists" },
  { label: "The Edits", href: "/edits"   },
  { label: "Journal",   href: "/journal" },
  { label: "Blog",      href: "/blog"    },
  { label: "About",     href: "/info"    },
];

export default function Footer() {
  const [email, setEmail] = useState("contact@kalasamputah.com");
  const [whatsapp, setWhatsapp] = useState("919818817291");

  useEffect(() => {
    fetch("/api/content")
      .then(res => res.json())
      .then(data => {
        if (data.content?.contact?.studioEmail) {
          setEmail(data.content.contact.studioEmail);
        }
        if (data.content?.contact?.whatsappNumber) {
          setWhatsapp(data.content.contact.whatsappNumber.replace(/[^0-9]/g, ""));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer id="connect" className="bg-brand-dark">

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-20 md:pt-28 pb-16 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10 items-start">

          {/* Col 1 — Artist identity */}
          <div className="space-y-6">
            <div>
              <p
                className="text-brand-cream mb-0.5"
                style={{
                  fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 300,
                  fontSize: "0.75rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#C9A96E",
                }}
              >
                Kala Samputah
              </p>
              <p
                className="text-brand-cream mb-1"
                style={{
                  fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 400,
                  fontSize: "1.6rem",
                  letterSpacing: "0.04em",
                }}
              >
                Nancy Sikri
              </p>
              <p
                style={{
                  fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
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
                fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
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
                { Icon: FaWhatsapp,   href: `https://wa.me/${whatsapp}?text=Hello%20Nancy%20%2F%20Kala%20Samputah%2C%20I%20am%20interested%20in%20your%20artworks.` },
                { Icon: FaInstagram,  href: "https://www.instagram.com/kala_samputah" },
                { Icon: FaFacebookF,  href: "https://www.facebook.com/kalasamputah" },
                { Icon: FaPinterestP, href: "https://www.pinterest.com/kalasamputah" },
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
                fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
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
                  fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
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
                fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
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
                  fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
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
                  fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
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
              href={`mailto:${email}`}
              className="inline-block text-brand-sand/40 hover:text-brand-accent border-b border-brand-accent/20 hover:border-brand-accent pb-0.5 transition-all duration-300"
              style={{
                fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
              }}
            >
              {email}
            </a>
          </div>

        </div>
      </div>

      {/* ── Gold rule ── */}
      <div
        className="mx-6 md:mx-16"
        style={{ height: "1px", background: "rgba(201,169,110,0.15)" }}
      />

      {/* ── Bottom bar ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-sand/25">
        <p
          style={{
            fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: "0.78rem",
            letterSpacing: "0.04em",
          }}
        >
          © {new Date().getFullYear()} Nancy Sikri · Kala Samputah. All rights reserved.
        </p>

        <p
          style={{
            fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: "0.75rem",
            color: "#8B7355",
            letterSpacing: "0.08em",
          }}
        >
          Original Acrylic Works · New Delhi, India
        </p>
      </div>

    </footer>
  );
}
