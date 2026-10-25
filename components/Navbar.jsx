"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSearch, FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaHeart, FaWhatsapp } from "react-icons/fa";
import { useArtModal } from "./ArtModalContext";
import { useUser } from "./UserContext";

const navItems = [
  { label: "Collect",   href: "/collect"  },
  { label: "Artists",   href: "/artists"  },
  { label: "The Edits", href: "/edits"    },
  { label: "Journal",   href: "/journal"  },
  { label: "Info",      href: "/info"     },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [visible,     setVisible]     = useState(true);
  const [announcement, setAnnouncement] = useState({
    text: "New collection available —",
    whatsappNumber: "919818817291",
    isVisible: true,
  });
  const { user, loaded } = useUser(); // user: object | null; loaded: boolean
  const [dropdown,    setDropdown]    = useState(false);
  const dropRef   = useRef(null);
  const pathname  = usePathname();
  const { openInquiry } = useArtModal();

  useEffect(() => {
    fetch("/api/content")
      .then(res => res.json())
      .then(data => {
        if (data.content?.announcement) {
          setAnnouncement(data.content.announcement);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropdown(false); }, [pathname]);

  const isActive = (href) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    setDropdown(false);
    await fetch("/api/user/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <>
      {/* ── Announcement Bar ── */}
      {visible && announcement.isVisible !== false && (
        <div className="announcement-bar relative flex items-center justify-center py-2.5 px-10 text-center flex-wrap gap-x-2 gap-y-1">
          <span className="inline-flex items-center flex-wrap justify-center gap-x-2">
            <span>{announcement.text || "New collection available —"}</span>
            <button
              onClick={() => openInquiry({ title: "New 2024 Studio Collection", src: "/art/822454183_18116058677070803_7997214052897677537_n.jpg", artist: "Nancy Sikri", medium: "Original Acrylic Works" })}
              className="underline font-medium hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 inline"
            >
              Inquire for pricing
            </button>
            <span className="opacity-40 hidden sm:inline">·</span>
            <a
              href={`https://wa.me/${announcement.whatsappNumber || "919818817291"}?text=Hello%20Nancy%20%2F%20Kala%20Samputah%2C%20I%20am%20visiting%20your%20website%20and%20would%20like%20to%20inquire%20about%20your%20art.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 underline hover:text-[#25D366] transition-colors"
            >
              <FaWhatsapp className="text-[#25D366] text-xs" />
              Chat on WhatsApp
            </a>
          </span>
          <button onClick={() => setVisible(false)} className="absolute right-4 text-brand-sand hover:text-white transition-colors" aria-label="Close">
            <FaTimes className="text-xs" />
          </button>
        </div>
      )}

      {/* ── Navbar ── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "navbar-scrolled" : "bg-brand-cream/90 backdrop-blur-sm"}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 min-w-0">
            <span className="text-brand-dark tracking-[0.18em] uppercase block truncate"
              style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 300, fontSize: "clamp(0.7rem, 2.5vw, 1.05rem)", letterSpacing: "clamp(0.08em, 0.5vw, 0.22em)" }}>
              KALA SAMPUTAH
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map(({ label, href }) => (
              <Link key={label} href={href} className="relative transition-colors duration-300 group"
                style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 400, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: isActive(href) ? "#1C1C1C" : "#8B7355", textDecoration: "none" }}>
                {label}
                <span style={{ position: "absolute", bottom: "-4px", left: 0, right: 0, height: "1px", background: "#C9A96E", transform: isActive(href) ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.3s ease" }}
                  className="group-hover:[transform:scaleX(1)]" />
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <button aria-label="Search" className="text-brand-charcoal hover:text-brand-accent transition-colors hidden md:block">
              <FaSearch className="text-sm" />
            </button>

            {/* User section — desktop */}
            {loaded && (
              <div className="hidden md:block relative" ref={dropRef}>
                {user ? (
                  /* Logged in — avatar + dropdown */
                  <>
                    <button
                      onClick={() => setDropdown(v => !v)}
                      className="flex items-center gap-2 transition-colors"
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                      {/* Avatar circle with initial */}
                      <div className="flex items-center justify-center w-7 h-7 rounded-full"
                        style={{ background: "#1C1C1C", border: "1.5px solid #C9A96E" }}>
                        <span style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.75rem", color: "#C9A96E", fontStyle: "italic" }}>
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B7355" }}>
                        {user.name?.split(" ")[0]}
                      </span>
                    </button>

                    {/* Dropdown */}
                    {dropdown && (
                      <div
                        className="absolute right-0 mt-3"
                        style={{
                          background: "#FDFAF5", border: "1px solid #E8DDD0",
                          boxShadow: "0 8px 30px rgba(28,28,28,0.1)",
                          width: "180px", zIndex: 100,
                        }}
                      >
                        <Link href="/profile" onClick={() => setDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-brand-beige transition-colors"
                          style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1C1C1C", textDecoration: "none" }}>
                          <FaUserCircle className="text-brand-accent text-sm flex-shrink-0" />
                          My Profile
                        </Link>
                        <Link href="/profile?tab=wishlist" onClick={() => setDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-brand-beige transition-colors"
                          style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1C1C1C", textDecoration: "none" }}>
                          <FaHeart className="text-brand-accent text-sm flex-shrink-0" />
                          Wishlist
                        </Link>
                        <div style={{ height: "1px", background: "#E8DDD0", margin: "0 1rem" }} />
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 w-full hover:bg-brand-beige transition-colors text-left"
                          style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B7355", background: "none", border: "none", cursor: "pointer" }}>
                          <FaSignOutAlt className="text-sm flex-shrink-0" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  /* Not logged in — Login + Signup links */
                  <div className="flex items-center gap-4">
                    <Link href="/login"
                      style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#1C1C1C")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#8B7355")}>
                      Login
                    </Link>
                    <Link href="/signup" className="btn-dark px-4 py-2"
                      style={{ fontSize: "0.65rem" }}>
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile hamburger */}
            <button aria-label="Toggle menu" className="text-brand-charcoal hover:text-brand-accent transition-colors md:hidden" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-brand-cream border-t border-brand-sand px-6 py-6 flex flex-col gap-5">
            {navItems.map(({ label, href }) => (
              <Link key={label} href={href} className="transition-colors duration-300"
                style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 400, fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", color: isActive(href) ? "#1C1C1C" : "#8B7355", textDecoration: "none" }}>
                {label}
              </Link>
            ))}

            {/* Mobile auth */}
            <div style={{ height: "1px", background: "#E8DDD0" }} />
            {user ? (
              <>
                <Link href="/profile" style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#8B7355", textDecoration: "none" }}>
                  My Profile
                </Link>
                <button onClick={handleLogout}
                  style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#8B7355", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                <Link href="/login" style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#8B7355", textDecoration: "none" }}>Login</Link>
                <Link href="/signup" className="btn-dark px-4 py-2" style={{ fontSize: "0.65rem" }}>Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
