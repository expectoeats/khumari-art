"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "../AdminShell";

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell>
      <div style={{ padding: "2.5rem 2rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.3rem" }}>Manage</p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.9rem", color: "#F5F0E8" }}>Users</h1>
          </div>
          {/* Total count badge */}
          <div style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: "6px", padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", color: "#C9A96E", lineHeight: 1 }}>{users.length}</p>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,169,110,0.6)" }}>Total users</p>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: "1.5rem" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            style={{
              background: "rgba(245,240,232,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#F5F0E8", fontSize: "0.82rem", padding: "0.55rem 1rem", outline: "none",
              borderRadius: "6px", fontFamily: "'Jost', sans-serif", width: "280px",
            }}
          />
        </div>

        <p style={{ fontSize: "0.62rem", color: "rgba(245,240,232,0.25)", letterSpacing: "0.1em", marginBottom: "1.2rem" }}>
          {loading ? "Loading…" : `${visible.length} user${visible.length !== 1 ? "s" : ""}`}
        </p>

        {/* Table */}
        <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
          {/* Head */}
          <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 1fr 80px 100px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {["#", "Name", "Email", "Saved", "Joined"].map((h, i) => (
              <div key={i} style={{ padding: "0.65rem 0.8rem", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)" }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>Loading…</div>
          ) : visible.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>No users found.</div>
          ) : visible.map((user, i) => (
            <div
              key={user._id}
              style={{
                display: "grid", gridTemplateColumns: "44px 1fr 1fr 80px 100px",
                borderBottom: i < visible.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                alignItems: "center",
              }}
            >
              {/* Avatar */}
              <div style={{ padding: "0.7rem 0.8rem" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "#1C1C1C", border: "1.5px solid rgba(201,169,110,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.75rem", color: "#C9A96E", fontStyle: "italic" }}>
                    {user.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Name */}
              <div style={{ padding: "0.7rem 0.8rem", fontSize: "0.85rem", color: "#F5F0E8", fontFamily: "'DM Serif Display', serif" }}>
                {user.name}
              </div>

              {/* Email */}
              <div style={{ padding: "0.7rem 0.8rem", fontSize: "0.72rem", color: "rgba(245,240,232,0.45)", fontFamily: "'Jost', sans-serif", letterSpacing: "0.04em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </div>

              {/* Wishlist count */}
              <div style={{ padding: "0.7rem 0.8rem" }}>
                <span style={{ fontSize: "0.68rem", background: "rgba(201,169,110,0.1)", color: "#C9A96E", borderRadius: "4px", padding: "0.15rem 0.5rem", fontFamily: "'Jost', sans-serif" }}>
                  {user.wishlist?.length || 0}
                </span>
              </div>

              {/* Joined date */}
              <div style={{ padding: "0.7rem 0.8rem", fontSize: "0.65rem", color: "rgba(245,240,232,0.3)", fontFamily: "'Jost', sans-serif" }}>
                {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
