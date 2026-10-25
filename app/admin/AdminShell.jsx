"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { label: "Dashboard",  href: "/admin/dashboard",  icon: "◈" },
  { label: "Artworks",   href: "/admin/artworks",   icon: "◻" },
  { label: "Blog Posts", href: "/admin/blogs",       icon: "✦" },
  { label: "Inquiries",  href: "/admin/inquiries",  icon: "✉" },
  { label: "Orders",     href: "/admin/orders",     icon: "₊" },
  { label: "Categories", href: "/admin/categories", icon: "▢" },
  { label: "Tags",       href: "/admin/tags",       icon: "◷" },
  { label: "Analytics",  href: "/admin/analytics",  icon: "↗" },
  { label: "Users",      href: "/admin/users",      icon: "◎" },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0F0F0F", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col justify-between py-8 px-5"
        style={{
          background: "#161616",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        {/* Brand */}
        <div>
          <div className="mb-10">
            <p style={{
              fontSize: "0.6rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#C9A96E",
              marginBottom: "0.25rem",
            }}>
              Kala Samputah
            </p>
            <p style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.3)", letterSpacing: "0.1em" }}>
              Admin Panel
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1">
            {nav.map(({ label, href, icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    textDecoration: "none",
                    background: active ? "rgba(201,169,110,0.1)" : "transparent",
                    color: active ? "#C9A96E" : "rgba(245,240,232,0.4)",
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  <span style={{ fontSize: "0.7rem", width: "14px", textAlign: "center" }}>{icon}</span>
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            target="_blank"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: "rgba(245,240,232,0.25)",
              textDecoration: "none",
              padding: "0.4rem 0.8rem",
            }}
          >
            ↗ View Site
          </Link>
          <button
            onClick={handleLogout}
            disabled={loading}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "6px",
              padding: "0.55rem 0.8rem",
              fontSize: "0.68rem",
              letterSpacing: "0.12em",
              color: loading ? "rgba(245,240,232,0.2)" : "rgba(245,240,232,0.45)",
              cursor: loading ? "not-allowed" : "pointer",
              textAlign: "left",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Logging out…" : "Log out"}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto" style={{ minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
