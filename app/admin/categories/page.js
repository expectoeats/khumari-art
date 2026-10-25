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

function CategoryModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: "", slug: "", description: "", isActive: true, image: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.name) { setError("Category name is required."); return; }
    setSaving(true); setError("");
    try {
      const method = form._id ? "PATCH" : "POST";
      const url = form._id ? `/api/categories/${form._id}` : "/api/categories";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, slug: form.slug, description: form.description, isActive: form.isActive, image: form.image }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); return; }
      onSave(data.category);
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
          <h2 style={{ fontFamily: "'Beausite Classic', serif", fontSize: "1.4rem", color: "#F5F0E8" }}>{form._id ? "Edit Category" : "New Category"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(245,240,232,0.4)", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
        </div>
        {error && <p style={{ fontSize: "0.75rem", color: "#e57373", marginBottom: "1rem", padding: "0.5rem 0.75rem", background: "rgba(229,115,115,0.08)", borderRadius: "4px" }}>{error}</p>}
        <Label>Name</Label>
        <Input value={form.name} onChange={set("name")} placeholder="e.g. Paintings" />
        <Label style={{ marginTop: "1rem" }}>Slug</Label>
        <Input value={form.slug} onChange={set("slug")} placeholder="e.g. paintings" />
        <Label style={{ marginTop: "1rem" }}>Description</Label>
        <Input value={form.description} onChange={set("description")} placeholder="Short description" />
        <Label style={{ marginTop: "1rem" }}>Image URL</Label>
        <Input value={form.image} onChange={set("image")} placeholder="https://..." />
        <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
          <span style={{ fontSize: "0.8rem", color: "#F5F0E8" }}>Active</span>
        </div>
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "rgba(245,240,232,0.5)", fontSize: "0.75rem", padding: "0.5rem 1rem", cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ background: "#C9A96E", color: "#111010", border: "none", borderRadius: "6px", fontSize: "0.75rem", padding: "0.5rem 1.2rem", cursor: saving ? "not-allowed" : "pointer", fontWeight: 600, letterSpacing: "0.1em" }}>{saving ? "Saving…" : form._id ? "Update" : "Create"}</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch { setCategories([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = (category) => {
    setCategories((prev) => {
      const exists = prev.find((c) => c._id === category._id);
      if (exists) return prev.map((c) => (c._id === category._id ? category : c));
      return [...prev, category];
    });
    setModal(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category permanently?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch { alert("Failed to delete category"); }
    finally { setDeleting(null); }
  };

  return (
    <AdminShell>
      <div style={{ padding: "2.5rem 2rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.3rem" }}>Manage</p>
            <h1 style={{ fontFamily: "'Beausite Classic', serif", fontSize: "1.9rem", color: "#F5F0E8" }}>Categories</h1>
          </div>
          <button onClick={() => setModal(null)} style={{ background: "#C9A96E", color: "#111010", border: "none", borderRadius: "6px", fontSize: "0.7rem", padding: "0.55rem 1rem", cursor: "pointer", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>+ New Category</button>
        </div>

        <p style={{ fontSize: "0.62rem", color: "rgba(245,240,232,0.25)", letterSpacing: "0.1em", marginBottom: "1.2rem" }}>
          {loading ? "Loading…" : `${categories.length} category${categories.length !== 1 ? "es" : ""}`}
        </p>

        <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 120px 100px 100px 100px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {["#", "Name", "Slug", "Status", "Image", ""].map((h, i) => (
              <div key={i} style={{ padding: "0.65rem 0.8rem", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)" }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>Loading…</div>
          ) : categories.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>No categories yet.</div>
          ) : (
            categories.map((cat, i) => (
              <div key={cat._id} style={{ display: "grid", gridTemplateColumns: "44px 1fr 120px 100px 100px 100px", borderBottom: i < categories.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
                <div style={{ padding: "0.7rem 0.8rem" }}>{i + 1}</div>
                <div style={{ padding: "0.7rem 0.8rem", fontSize: "0.85rem", color: "#F5F0E8", fontFamily: "'Beausite Classic', serif" }}>{cat.name}</div>
                <div style={{ padding: "0.7rem 0.8rem", fontSize: "0.7rem", color: "rgba(245,240,232,0.4)", fontFamily: "'Jost', sans-serif" }}>{cat.slug}</div>
                <div style={{ padding: "0.7rem 0.8rem" }}>
                  <span style={{ fontSize: "0.6rem", background: cat.isActive ? "rgba(129,199,132,0.12)" : "rgba(255,255,255,0.04)", color: cat.isActive ? "#81c784" : "rgba(245,240,232,0.25)", borderRadius: "4px", padding: "0.15rem 0.5rem" }}>{cat.isActive ? "Active" : "Inactive"}</span>
                </div>
                <div style={{ padding: "0.7rem 0.8rem" }}>
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} style={{ width: "32px", height: "32px", borderRadius: "4px", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "0.65rem", color: "rgba(245,240,232,0.25)" }}>{"—"}</span>
                  )}
                </div>
                <div style={{ padding: "0.7rem 0.6rem", display: "flex", gap: "0.4rem" }}>
                  <button onClick={() => setModal(cat)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "4px", color: "rgba(245,240,232,0.5)", fontSize: "0.62rem", padding: "0.3rem 0.6rem", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDelete(cat._id)} disabled={deleting === cat._id} style={{ background: "rgba(229,115,115,0.08)", border: "none", borderRadius: "4px", color: "#e57373", fontSize: "0.62rem", padding: "0.3rem 0.6rem", cursor: deleting === cat._id ? "not-allowed" : "pointer", opacity: deleting === cat._id ? 0.5 : 1 }}>Del</button>
                </div>
              </div>
            ))
          )}
        </div>

        {modal && <CategoryModal initial={modal} onSave={handleSave} onClose={() => setModal(null)} />}
      </div>
    </AdminShell>
  );
}