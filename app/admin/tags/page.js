"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "../AdminShell";

const Label = ({ children }) => (
  <span style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", display: "block", marginBottom: "0.4rem" }}>{children}</span>
);
const Input = ({ value, onChange, placeholder = "" }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width: "100%", background: "rgba(245,240,232,0.05)", border: "1px solid rgba(255,255,255,0.08)",
      color: "#F5F0E8", fontSize: "0.85rem", padding: "0.6rem 0.8rem", outline: "none",
      borderRadius: "6px", fontFamily: "'Jost', sans-serif",
    }}
  />
);

function TagModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: "", slug: "", color: "#C9A96E" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.name) { setError("Tag name is required."); return; }
    setSaving(true); setError("");
    try {
      const method = form._id ? "PATCH" : "POST";
      const url = form._id ? `/api/tags/${form._id}` : "/api/tags";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, slug: form.slug, color: form.color }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); return; }
      onSave(data.tag);
    } catch { setError("Network error"); }
    finally { setSaving(false); }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", width: "100%", maxWidth: "520px", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Beausite Classic', serif", fontSize: "1.4rem", color: "#F5F0E8" }}>{form._id ? "Edit Tag" : "New Tag"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(245,240,232,0.4)", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
        </div>
        {error && <p style={{ fontSize: "0.75rem", color: "#e57373", marginBottom: "1rem", padding: "0.5rem 0.75rem", background: "rgba(229,115,115,0.08)", borderRadius: "4px" }}>{error}</p>}
        <Label>Name</Label>
        <Input value={form.name} onChange={set("name")} placeholder="e.g. Abstract" />
        <Label style={{ marginTop: "1rem" }}>Slug</Label>
        <Input value={form.slug} onChange={set("slug")} placeholder="e.g. abstract" />
        <Label style={{ marginTop: "1rem" }}>Color</Label>
        <input
          type="color"
          value={form.color}
          onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
          style={{ width: "100%", height: "40px", border: "none", borderRadius: "6px", cursor: "pointer", background: "none" }}
        />
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "rgba(245,240,232,0.5)", fontSize: "0.75rem", padding: "0.5rem 1rem", cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ background: "#C9A96E", color: "#111010", border: "none", borderRadius: "6px", fontSize: "0.75rem", padding: "0.5rem 1.2rem", cursor: saving ? "not-allowed" : "pointer", fontWeight: 600, letterSpacing: "0.1em" }}>{saving ? "Saving…" : form._id ? "Update" : "Create"}</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tags");
      const data = await res.json();
      setTags(data.tags || []);
    } catch { setTags([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = (tag) => {
    setTags((prev) => {
      const exists = prev.find((t) => t._id === tag._id);
      if (exists) return prev.map((t) => (t._id === tag._id ? tag : t));
      return [...prev, tag];
    });
    setModal(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this tag permanently?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/tags/${id}`, { method: "DELETE" });
      setTags((prev) => prev.filter((t) => t._id !== id));
    } catch { alert("Failed to delete tag"); }
    finally { setDeleting(null); }
  };

  return (
    <AdminShell>
      <div style={{ padding: "2.5rem 2rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.3rem" }}>Manage</p>
            <h1 style={{ fontFamily: "'Beausite Classic', serif", fontSize: "1.9rem", color: "#F5F0E8" }}>Tags</h1>
          </div>
          <button onClick={() => setModal(null)} style={{ background: "#C9A96E", color: "#111010", border: "none", borderRadius: "6px", fontSize: "0.7rem", padding: "0.55rem 1rem", cursor: "pointer", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>+ New Tag</button>
        </div>

        <p style={{ fontSize: "0.62rem", color: "rgba(245,240,232,0.25)", letterSpacing: "0.1em", marginBottom: "1.2rem" }}>
          {loading ? "Loading…" : `${tags.length} tag${tags.length !== 1 ? "s" : ""}`}
        </p>

        <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 120px 100px 100px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {["#", "Name", "Slug", "Color", ""].map((h, i) => (
              <div key={i} style={{ padding: "0.65rem 0.8rem", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)" }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>Loading…</div>
          ) : tags.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>No tags yet.</div>
          ) : (
            tags.map((tag, i) => (
              <div key={tag._id} style={{ display: "grid", gridTemplateColumns: "44px 1fr 120px 100px 100px", borderBottom: i < tags.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
                <div style={{ padding: "0.7rem 0.8rem" }}>{i + 1}</div>
                <div style={{ padding: "0.7rem 0.8rem", fontSize: "0.85rem", color: "#F5F0E8", fontFamily: "'Beausite Classic', serif" }}>{tag.name}</div>
                <div style={{ padding: "0.7rem 0.8rem", fontSize: "0.7rem", color: "rgba(245,240,232,0.4)", fontFamily: "'Jost', sans-serif" }}>{tag.slug}</div>
                <div style={{ padding: "0.7rem 0.8rem" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "4px", background: tag.color || "#C9A96E", border: "1px solid rgba(255,255,255,0.2)" }}></div>
                </div>
                <div style={{ padding: "0.7rem 0.6rem", display: "flex", gap: "0.4rem" }}>
                  <button onClick={() => setModal(tag)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "4px", color: "rgba(245,240,232,0.5)", fontSize: "0.62rem", padding: "0.3rem 0.6rem", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDelete(tag._id)} disabled={deleting === tag._id} style={{ background: "rgba(229,115,115,0.08)", border: "none", borderRadius: "4px", color: "#e57373", fontSize: "0.62rem", padding: "0.3rem 0.6rem", cursor: deleting === tag._id ? "not-allowed" : "pointer", opacity: deleting === tag._id ? 0.5 : 1 }}>Del</button>
                </div>
              </div>
            ))
          )}
        </div>

        {modal && <TagModal initial={modal} onSave={handleSave} onClose={() => setModal(null)} />}
      </div>
    </AdminShell>
  );
}