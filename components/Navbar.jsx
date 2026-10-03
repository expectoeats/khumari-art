"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSearch, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useArtModal } from "./ArtModalContext";

// Map each nav label → its route
const navItems = [
  { label: "Collect",   href: "/collect"  },
  { label: "Artists",   href: "/artists"  },
  { label: "The Edits", href: "/edits"    },
  { label: "Journal",   href: "/journal"  },
  { label: "Info",      href: "/info"     },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible]       = useState(true);
  const pathname                    = usePathname();
  const { openInquiry }             = useArtModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── Announcement Bar ── */}
      {visible && (
        <div className="announcement-bar relative flex items-center justify-center py-2.5 px-10 text-center">
          <span>
            New collection available —{" "}
            <button
              onClick={() =>
                openInquiry({
                  title: "New 2024 Studio Collection",
                  src: "/art/822454183_18116058677070803_7997214052897677537_n.jpg",
                  artist: "Nancy Sikri",
                  medium: "Original Acrylic Works",
                })
              }
              className="underline font-medium hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 inline"
            >
              Inquire for pricing
            </button>
          </span>
          <button
            onClick={() => setVisible(false)}
            className="absolute right-4 text-brand-sand hover:text-white transition-colors"
            aria-label="Close announcement"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>
      )}

      {/* ── Navbar ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "navbar-scrolled" : "bg-brand-cream/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">

          {/* Logo → home */}
          <Link href="/" className="flex-shrink-0">
            <span
              className="text-brand-dark tracking-[0.28em] uppercase"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "1.15rem" }}
            >
              KALA SAMPUTAH
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="relative transition-colors duration-300 group"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.72rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: isActive(href) ? "#1C1C1C" : "#8B7355",
                  textDecoration: "none",
                }}
              >
                {label}
                {/* Active underline */}
                <span
                  style={{
                    position: "absolute",
                    bottom: "-4px",
                    left: 0,
                    right: 0,
                    height: "1px",
                    background: "#C9A96E",
                    transform: isActive(href) ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.3s ease",
                  }}
                  className="group-hover:[transform:scaleX(1)]"
                />
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <button aria-label="Search" className="text-brand-charcoal hover:text-brand-accent transition-colors hidden md:block">
              <FaSearch className="text-sm" />
            </button>
            <button aria-label="Account" className="text-brand-charcoal hover:text-brand-accent transition-colors hidden md:block">
              <FaUser className="text-sm" />
            </button>
            <button
              aria-label="Toggle menu"
              className="text-brand-charcoal hover:text-brand-accent transition-colors md:hidden"
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-brand-cream border-t border-brand-sand px-6 py-6 flex flex-col gap-5">
            {navItems.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="transition-colors duration-300"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.78rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: isActive(href) ? "#1C1C1C" : "#8B7355",
                  textDecoration: "none",
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
