"use client";

import { useEffect, useState } from "react";
import AdminShell from "../AdminShell";
import Link from "next/link";

const S = ({ label, value, sub, href, color = "#C9A96E" }) => (
  <Link href={href} style={{ textDecoration: "none" }}>
    <div
      style={{
        background: "#1A1A1A",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "10px",
        padding: "1.5rem",
        transition: "border-color 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.35)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
    >
      <p style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", marginBottom: "0.8rem" }}>
        {label}
      </p>
      <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.4rem", fontWeight: 400, color, lineHeight: 1 }}>
        {value ?? "—"}
      </p>
      {sub && (
        <p style={{ fontSize: "0.65rem", color: "rgba(245,240,232,0.3)", marginTop: "0.4rem", letterSpacing: "0.08em" }}>
          {sub}
        </p>
      )}
    </div>
  </Link>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [err,   setErr]   = useState(false);

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => setErr(true));
  }, []);

  return (
    <AdminShell>
      <div style={{ padding: "2.5rem 2rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.4rem" }}>
            Overview
          </p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "1.9rem", color: "#F5F0E8" }}>
            Dashboard
          </h1>
        </div>

        {err && (
          <p style={{ color: "#e57373", fontSize: "0.8rem", marginBottom: "1.5rem" }}>
            Could not load stats — check MongoDB connection.
          </p>
        )}

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
          <S label="Total Artworks"   value={stats?.artworks?.total}       sub={`${stats?.artworks?.featured ?? 0} featured`}   href="/admin/artworks"  />
          <S label="Blog Posts"       value={stats?.blogs?.total}           sub={`${stats?.blogs?.published ?? 0} published`}    href="/admin/blogs"     color="#81c784" />
          <S label="Inquiries"        value={stats?.inquiries?.total}       sub={`${stats?.inquiries?.new ?? 0} new`}            href="/admin/inquiries" color="#64b5f6" />
          <S label="New Inquiries"    value={stats?.inquiries?.new}         sub="awaiting reply"                                 href="/admin/inquiries" color="#ffb74d" />
          <S label="Users"            value={stats?.users?.total}           sub="registered accounts"                            href="/admin/users"     color="#ce93d8" />
        </div>

        {/* Quick links */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "2rem" }}>
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", marginBottom: "1rem" }}>
            Quick actions
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {[
              { label: "+ Add Artwork",   href: "/admin/artworks?new=1" },
              { label: "+ New Blog Post", href: "/admin/blogs?new=1"    },
              { label: "View Inquiries",  href: "/admin/inquiries"      },
              { label: "↗ View Site",     href: "/",                    target: "_blank" },
            ].map(({ label, href, target }) => (
              <Link
                key={href}
                href={href}
                target={target}
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  color: "rgba(245,240,232,0.55)",
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "6px",
                  padding: "0.5rem 1rem",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A96E"; e.currentTarget.style.color = "#C9A96E"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(245,240,232,0.55)"; }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
