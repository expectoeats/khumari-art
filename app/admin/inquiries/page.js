"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "../AdminShell";

const STATUS_COLORS = {
  new:     { bg: "rgba(255,183,77,0.12)", color: "#ffb74d", border: "rgba(255,183,77,0.3)"  },
  read:    { bg: "rgba(100,181,246,0.1)",  color: "#64b5f6", border: "rgba(100,181,246,0.25)" },
  replied: { bg: "rgba(129,199,132,0.1)",  color: "#81c784", border: "rgba(129,199,132,0.3)" },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.new;
  return (
    <span style={{ fontSize: "0.58rem", background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: "4px", padding: "0.2rem 0.55rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
      {status}
    </span>
  );
}

function InquiryDrawer({ inquiry, onStatusChange, onDelete, onClose }) {
  const [updating, setUpdating] = useState(false);

  const changeStatus = async (status) => {
    setUpdating(true);
    const res  = await fetch(`/api/inquiries/${inquiry._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const data = await res.json();
    if (res.ok) onStatusChange(data.inquiry);
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this inquiry permanently?")) return;
    await fetch(`/api/inquiries/${inquiry._id}`, { method: "DELETE" });
    onDelete(inquiry._id);
    onClose();
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", justifyContent: "flex-end" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#1A1A1A", borderLeft: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "420px", height: "100vh", overflowY: "auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.3rem" }}>Inquiry</p>
            <h2 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontSize: "1.3rem", color: "#F5F0E8" }}>{inquiry.name}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(245,240,232,0.4)", fontSize: "1.2rem", cursor: "pointer", marginTop: "0.1rem" }}>✕</button>
        </div>

        {/* Status */}
        <div>
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", marginBottom: "0.6rem" }}>Status</p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["new", "read", "replied"].map(s => (
              <button
                key={s}
                onClick={() => changeStatus(s)}
                disabled={updating || inquiry.status === s}
                style={{
                  background: inquiry.status === s ? STATUS_COLORS[s].bg : "rgba(255,255,255,0.04)",
                  border: `1px solid ${inquiry.status === s ? STATUS_COLORS[s].border : "rgba(255,255,255,0.08)"}`,
                  color: inquiry.status === s ? STATUS_COLORS[s].color : "rgba(245,240,232,0.35)",
                  borderRadius: "4px", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase",
                  padding: "0.3rem 0.7rem", cursor: inquiry.status === s || updating ? "default" : "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

        {/* Details */}
        {[
          { label: "Email",   value: inquiry.email   },
          { label: "Phone / WhatsApp", value: inquiry.phone || "—" },
          { label: "Source",  value: inquiry.source  },
          { label: "Artwork", value: inquiry.artworkTitle || "—" },
          { label: "Date",    value: new Date(inquiry.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
        ].map(({ label, value }) => (
          <div key={label}>
            <p style={{ fontSize: "0.55rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", marginBottom: "0.3rem" }}>{label}</p>
            <p style={{ fontSize: "0.85rem", color: "rgba(245,240,232,0.7)", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif' }}>{value}</p>
          </div>
        ))}

        {/* Message */}
        <div>
          <p style={{ fontSize: "0.55rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", marginBottom: "0.6rem" }}>Message</p>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "1rem" }}>
            <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontStyle: "italic", fontSize: "1rem", color: "rgba(245,240,232,0.7)", lineHeight: 1.75 }}>
              {inquiry.message}
            </p>
          </div>
        </div>

        {/* Reply via Email */}
        <a
          href={`mailto:${inquiry.email}?subject=Re: Your inquiry — Kala Samputah`}
          style={{
            display: "block", textAlign: "center", background: "#C9A96E", borderRadius: "6px", color: "#111010",
            fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600,
            padding: "0.75rem", textDecoration: "none",
          }}
        >
          Reply via Email
        </a>

        {/* WhatsApp button — only if phone was provided */}
        {inquiry.phone && (
          <a
            href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              `Hi ${inquiry.name}, thank you for your inquiry about "${inquiry.artworkTitle || "the artwork"}" at Kala Samputah. We'd love to help — could you share more details about your interest?`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              background: "#25D366", borderRadius: "6px", color: "#fff",
              fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600,
              padding: "0.75rem", textDecoration: "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Reply via WhatsApp
          </a>
        )}

        <button
          onClick={handleDelete}
          style={{ background: "none", border: "1px solid rgba(229,115,115,0.2)", borderRadius: "6px", color: "rgba(229,115,115,0.6)", fontSize: "0.65rem", letterSpacing: "0.12em", padding: "0.6rem", cursor: "pointer" }}
        >
          Delete Inquiry
        </button>
      </div>
    </div>
  );
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [open,      setOpen]      = useState(null);
  const [filter,    setFilter]    = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/inquiries");
    const data = await res.json();
    setInquiries(data.inquiries || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = (updated) => {
    setInquiries(prev => prev.map(i => i._id === updated._id ? updated : i));
    setOpen(updated);
  };

  const handleDelete = (id) => {
    setInquiries(prev => prev.filter(i => i._id !== id));
  };

  const visible = filter === "all" ? inquiries : inquiries.filter(i => i.status === filter);

  return (
    <AdminShell>
      <div style={{ padding: "2.5rem 2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.3rem" }}>Manage</p>
          <h1 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontSize: "1.9rem", color: "#F5F0E8" }}>Inquiries</h1>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {["all", "new", "read", "replied"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{
                background: filter === s ? "rgba(201,169,110,0.12)" : "transparent",
                border: `1px solid ${filter === s ? "#C9A96E" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "20px", color: filter === s ? "#C9A96E" : "rgba(245,240,232,0.35)",
                fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "0.3rem 0.9rem", cursor: "pointer",
              }}>
              {s} {s !== "all" && <span style={{ opacity: 0.6 }}>({inquiries.filter(i => i.status === s).length})</span>}
            </button>
          ))}
        </div>

        <p style={{ fontSize: "0.62rem", color: "rgba(245,240,232,0.25)", letterSpacing: "0.1em", marginBottom: "1.2rem" }}>
          {loading ? "Loading…" : `${visible.length} inquiry${visible.length !== 1 ? "ies" : "y"}`}
        </p>

        <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 90px 100px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {["From", "Artwork", "Date", "Status"].map((h, i) => (
              <div key={i} style={{ padding: "0.65rem 0.8rem", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)" }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>Loading…</div>
          ) : visible.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>No inquiries yet.</div>
          ) : visible.map((inq, i) => (
            <div
              key={inq._id}
              onClick={() => setOpen(inq)}
              style={{
                display: "grid", gridTemplateColumns: "1fr 140px 90px 100px",
                borderBottom: i < visible.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                alignItems: "center", cursor: "pointer",
                background: inq.status === "new" ? "rgba(255,183,77,0.02)" : "transparent",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
              onMouseLeave={e => (e.currentTarget.style.background = inq.status === "new" ? "rgba(255,183,77,0.02)" : "transparent")}
            >
              <div style={{ padding: "0.8rem 0.8rem" }}>
                <p style={{ fontSize: "0.85rem", color: inq.status === "new" ? "#F5F0E8" : "rgba(245,240,232,0.65)", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', marginBottom: "0.15rem" }}>
                  {inq.name}
                </p>
                <p style={{ fontSize: "0.65rem", color: "rgba(245,240,232,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inq.email}</p>
              </div>
              <div style={{ padding: "0.8rem", fontSize: "0.65rem", color: "rgba(245,240,232,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {inq.artworkTitle || "—"}
              </div>
              <div style={{ padding: "0.8rem", fontSize: "0.62rem", color: "rgba(245,240,232,0.3)", letterSpacing: "0.04em" }}>
                {new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </div>
              <div style={{ padding: "0.8rem" }}>
                <StatusBadge status={inq.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <InquiryDrawer
          inquiry={open}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onClose={() => setOpen(null)}
        />
      )}
    </AdminShell>
  );
}
