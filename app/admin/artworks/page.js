"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import AdminShell from "../AdminShell";
import { useToast } from "../../../components/ToastProvider";

const EMPTY = {
  title: "", artist: "Nancy Sikri", medium: "", category: "Paintings",
  year: new Date().getFullYear(), size: "", color: "", desc: "", src: "", featured: false,
  images: [],
};

const CATEGORIES = ["Paintings", "Prints", "Photography"];
const COLORS     = ["Crimson","Rose","Amber","Yellow","Teal","Blue","Lavender","Emerald"];
const ANGLE_LABELS = ["Front View", "Texture Detail", "Profile & Frame", "In-Situ Room View"];
const MAX_ANGLES   = 4;

// ── Reusable field components ─────────────────────────────────────────────────
const Label = ({ children }) => (
  <span style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", display: "block", marginBottom: "0.4rem" }}>
    {children}
  </span>
);

const Input = ({ value, onChange, type = "text", placeholder = "" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width: "100%", background: "rgba(245,240,232,0.05)", border: "1px solid rgba(255,255,255,0.08)",
      color: "#F5F0E8", fontSize: "0.85rem", padding: "0.6rem 0.8rem", outline: "none",
      borderRadius: "6px", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
    }}
  />
);

const Select = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={onChange}
    style={{
      width: "100%", background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)",
      color: "#F5F0E8", fontSize: "0.85rem", padding: "0.6rem 0.8rem", outline: "none",
      borderRadius: "6px", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', cursor: "pointer",
    }}
  >
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const Textarea = ({ value, onChange, rows = 3 }) => (
  <textarea
    value={value}
    onChange={onChange}
    rows={rows}
    style={{
      width: "100%", background: "rgba(245,240,232,0.05)", border: "1px solid rgba(255,255,255,0.08)",
      color: "#F5F0E8", fontSize: "0.85rem", padding: "0.6rem 0.8rem", outline: "none",
      borderRadius: "6px", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', resize: "vertical", lineHeight: 1.6,
    }}
  />
);

// ── Modal form ────────────────────────────────────────────────────────────────
function ArtworkModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(() => ({ images: [], ...(initial || EMPTY) }));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingAngles, setUploadingAngles] = useState(false);
  const fileInputRef = useRef(null);
  const angleInputRef = useRef(null);
  const { toast } = useToast();

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const angleList = Array.isArray(form.images) ? form.images : [];

  const handleSave = async () => {
    const missing = [
      !form.title && "Title",
      !form.medium && "Medium",
      !form.src && "Main image",
    ].filter(Boolean);
    if (missing.length) {
      toast.error("A few details are still missing", `Please add ${missing.join(" and ")} before saving this artwork.`);
      return;
    }
    setSaving(true);
    try {
      const method = form._id ? "PUT" : "POST";
      const url    = form._id ? `/api/artworks/${form._id}` : "/api/artworks";
      const payload = { ...form, images: angleList.filter(img => img?.src) };
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data   = await res.json();
      if (!res.ok) {
        toast.error("Could not save the artwork", data.error || "Please review the details and try again.");
        return;
      }
      toast.success(
        form._id ? "Artwork updated beautifully" : "Artwork added to the catalogue",
        `"${data.artwork.title}" is now live for collectors to explore.`
      );
      onSave(data.artwork);
    } catch {
      toast.error("Saving failed", "A network issue occurred. Please try again in a moment.");
    }
    finally { setSaving(false); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        toast.error(`"${file.name}" could not be uploaded`, data.error || "Supported: JPEG, PNG, WebP or GIF under 5MB.");
        return;
      }
      setForm(f => ({ ...f, src: data.url }));
      toast.success("Main image uploaded", "Looks wonderful. Remember to mark its angle label below.");
    } catch {
      toast.error(`"${file.name}" could not be uploaded`, "A network issue occurred. Please try again.");
    }
    finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Additional angle shots (3–4 photos per painting) ────────────────────────
  const handleAngleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingAngles(true);
    const added = [];
    const failed = [];
    for (const file of files) {
      if (angleList.length + added.length >= MAX_ANGLES) {
        toast.warning("Angle limit reached", `A painting can showcase up to ${MAX_ANGLES} views.`);
        break;
      }
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          failed.push({ name: file.name, reason: data.error || "Unsupported file" });
          continue;
        }
        added.push({
          src: data.url,
          alt: ANGLE_LABELS[angleList.length + added.length] || `Angle ${angleList.length + added.length + 1}`,
          isPrimary: false,
        });
      } catch {
        failed.push({ name: file.name, reason: "Network issue" });
      }
    }
    if (added.length) {
      setForm(f => {
        const merged = [...(f.images || []), ...added];
        // First uploaded angle becomes the main image if none set yet
        const src = f.src || merged[0].src;
        const hasPrimary = merged.some(img => img.isPrimary);
        const images = hasPrimary
          ? merged
          : merged.map((img, i) => ({ ...img, isPrimary: i === 0 && img.src === src }));
        return { ...f, images, src };
      });
      toast.success(
        `${added.length} angle ${added.length === 1 ? "photo" : "photos"} added`,
        "Collectors can now browse these views on the artwork page."
      );
    }
    failed.forEach((f) =>
      toast.error(`"${f.name}" was skipped`, `${f.reason}. Supported formats: JPEG, PNG, WebP or GIF under 5MB.`)
    );
    setUploadingAngles(false);
    if (angleInputRef.current) angleInputRef.current.value = "";
  };

  const updateAngle = (i, patch) =>
    setForm(f => ({ ...f, images: f.images.map((img, idx) => (idx === i ? { ...img, ...patch } : img)) }));

  const removeAngle = (i) =>
    setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const makeAnglePrimary = (i) =>
    setForm(f => ({
      ...f,
      src: f.images[i].src,
      images: f.images.map((img, idx) => ({ ...img, isPrimary: idx === i })),
    }));

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontSize: "1.4rem", color: "#F5F0E8" }}>
            {form._id ? "Edit Artwork" : "New Artwork"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(245,240,232,0.4)", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div><Label>Title *</Label><Input value={form.title} onChange={set("title")} /></div>
          <div><Label>Artist</Label><Input value={form.artist} onChange={set("artist")} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div><Label>Category</Label><Select value={form.category} onChange={set("category")} options={CATEGORIES} /></div>
            <div><Label>Medium *</Label><Input value={form.medium} onChange={set("medium")} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
            <div><Label>Year</Label><Input value={form.year} onChange={set("year")} type="number" /></div>
            <div><Label>Size</Label><Input value={form.size} onChange={set("size")} placeholder="24 × 30 in" /></div>
            <div><Label>Color</Label><Select value={form.color} onChange={set("color")} options={["", ...COLORS]} /></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Label style={{ marginBottom: 0 }}>Image Path *</Label>
              <Input value={form.src} onChange={set("src")} placeholder="/art/filename.jpg" style={{ flex: 1 }} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  background: "#C9A96E", border: "none", borderRadius: "6px",
                  color: "#111010", fontSize: "0.65rem", padding: "0.55rem 0.9rem",
                  cursor: uploading ? "not-allowed" : "pointer", letterSpacing: "0.08em",
                  fontWeight: 600,
                }}
              >
                {uploading ? "Uploading…" : "Browse File"}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              style={{ display: "none" }}
            />
            {form.src && (
              <div style={{ marginTop: "0.25rem", position: "relative", width: "80px", height: "80px", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Image src={form.src} alt="preview" fill className="object-cover" onError={() => {}} />
              </div>
            )}
          </div>
          {/* Additional angle shots */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <Label>Additional Angles ({angleList.length}/{MAX_ANGLES})</Label>
              <button
                type="button"
                onClick={() => angleInputRef.current?.click()}
                disabled={uploadingAngles || angleList.length >= MAX_ANGLES}
                style={{
                  background: "rgba(201,169,110,0.12)", border: "1px solid #C9A96E", borderRadius: "6px",
                  color: "#C9A96E", fontSize: "0.62rem", padding: "0.45rem 0.9rem", letterSpacing: "0.1em",
                  fontWeight: 600, cursor: uploadingAngles || angleList.length >= MAX_ANGLES ? "not-allowed" : "pointer",
                  opacity: uploadingAngles || angleList.length >= MAX_ANGLES ? 0.5 : 1,
                }}
              >
                {uploadingAngles ? "Uploading…" : "+ Add Angle Photos"}
              </button>
            </div>
            <p style={{ fontSize: "0.62rem", color: "rgba(245,240,232,0.35)", lineHeight: 1.5 }}>
              Recommended: Front View · Texture Close-up · Frame Profile · In-Situ Room View. Buyers can browse all angles on the artwork page.
            </p>
            <input
              ref={angleInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleAngleUpload}
              style={{ display: "none" }}
            />
            {angleList.map((img, i) => (
              <div
                key={`${img.src}-${i}`}
                style={{
                  display: "flex", gap: "0.6rem", alignItems: "center",
                  background: "rgba(245,240,232,0.04)",
                  border: `1px solid ${img.isPrimary ? "#C9A96E" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "8px", padding: "0.5rem",
                }}
              >
                <div style={{ position: "relative", width: "52px", height: "65px", borderRadius: "4px", overflow: "hidden", flexShrink: 0, background: "#111010" }}>
                  <Image src={img.src} alt={img.alt || `Angle ${i + 1}`} fill className="object-cover" onError={() => {}} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.35rem", minWidth: 0 }}>
                  <Input value={img.alt || ""} onChange={(e) => updateAngle(i, { alt: e.target.value })} placeholder="Angle label (e.g. Texture Detail)" />
                  <span style={{ fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: img.isPrimary ? "#C9A96E" : "rgba(245,240,232,0.3)" }}>
                    {img.isPrimary ? "★ Primary — shown first & on cards" : `Angle ${i + 1}`}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flexShrink: 0 }}>
                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => makeAnglePrimary(i)}
                      title="Set as primary view"
                      style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "4px", color: "rgba(245,240,232,0.6)", fontSize: "0.6rem", padding: "0.3rem 0.55rem", cursor: "pointer", letterSpacing: "0.06em" }}
                    >
                      Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAngle(i)}
                    title="Remove this angle"
                    style={{ background: "rgba(229,115,115,0.08)", border: "none", borderRadius: "4px", color: "#e57373", fontSize: "0.6rem", padding: "0.3rem 0.55rem", cursor: "pointer", letterSpacing: "0.06em" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div><Label>Description</Label><Textarea value={form.desc} onChange={set("desc")} rows={3} /></div>
          <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
              style={{ accentColor: "#C9A96E", width: "14px", height: "14px" }}
            />
            <span style={{ fontSize: "0.75rem", color: "rgba(245,240,232,0.5)", letterSpacing: "0.08em" }}>Featured artwork</span>
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "rgba(245,240,232,0.4)", fontSize: "0.7rem", letterSpacing: "0.12em", padding: "0.6rem 1.2rem", cursor: "pointer" }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ background: "#C9A96E", border: "none", borderRadius: "6px", color: "#111010", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, padding: "0.6rem 1.4rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null); // null | "new" | artwork object
  const [filter,   setFilter]   = useState("All");
  const [search,   setSearch]   = useState("");
  const [deleting, setDeleting] = useState(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/artworks");
    const data = await res.json();
    setArtworks(data.artworks || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = (saved) => {
    setArtworks(prev => {
      const exists = prev.find(a => a._id === saved._id);
      return exists ? prev.map(a => a._id === saved._id ? saved : a) : [saved, ...prev];
    });
    setModal(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this artwork? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/artworks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setArtworks(prev => prev.filter(a => a._id !== id));
      toast.success("Artwork removed", "The piece has been deleted from the catalogue.");
    } catch {
      toast.error("Could not delete the artwork", "A network issue occurred. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const visible = artworks
    .filter(a => filter === "All" || a.category === filter)
    .filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminShell>
      <div style={{ padding: "2.5rem 2rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.3rem" }}>Manage</p>
            <h1 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontSize: "1.9rem", color: "#F5F0E8" }}>Artworks</h1>
          </div>
          <button
            onClick={() => setModal("new")}
            style={{ background: "#C9A96E", border: "none", borderRadius: "6px", color: "#111010", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, padding: "0.65rem 1.4rem", cursor: "pointer" }}
          >
            + Add Artwork
          </button>
        </div>

        {/* Filters + search */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          {["All", ...CATEGORIES].map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                background: filter === c ? "rgba(201,169,110,0.15)" : "transparent",
                border: `1px solid ${filter === c ? "#C9A96E" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "20px", color: filter === c ? "#C9A96E" : "rgba(245,240,232,0.4)",
                fontSize: "0.65rem", letterSpacing: "0.12em", padding: "0.35rem 0.9rem", cursor: "pointer",
              }}
            >
              {c}
            </button>
          ))}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search title…"
            style={{
              marginLeft: "auto", background: "rgba(245,240,232,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#F5F0E8", fontSize: "0.78rem", padding: "0.4rem 0.8rem", borderRadius: "6px",
              outline: "none", width: "180px", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          />
        </div>

        {/* Count */}
        <p style={{ fontSize: "0.62rem", color: "rgba(245,240,232,0.25)", letterSpacing: "0.1em", marginBottom: "1.2rem" }}>
          {loading ? "Loading…" : `${visible.length} artwork${visible.length !== 1 ? "s" : ""}`}
        </p>

        {/* Table */}
        <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
          {/* Head */}
          <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 120px 80px 70px 90px", gap: "0", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {["", "Title", "Category", "Year", "Featured", ""].map((h, i) => (
              <div key={i} style={{ padding: "0.65rem 0.8rem", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)" }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>Loading artworks…</div>
          ) : visible.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>No artworks found.</div>
          ) : (
            visible.map((a, i) => (
              <div
                key={a._id}
                style={{
                  display: "grid", gridTemplateColumns: "56px 1fr 120px 80px 70px 90px",
                  borderBottom: i < visible.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  alignItems: "center",
                }}
              >
                {/* Thumb */}
                <div style={{ padding: "0.5rem 0.6rem" }}>
                  <div style={{ position: "relative", width: "36px", height: "36px", borderRadius: "4px", overflow: "hidden", background: "#1A1A1A" }}>
                    {a.src && <Image src={a.src} alt={a.title} fill className="object-cover" />}
                  </div>
                </div>
                {/* Title */}
                <div style={{ padding: "0.5rem 0.8rem", fontSize: "0.8rem", color: "#F5F0E8", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a.title}
                  {Array.isArray(a.images) && a.images.length > 1 && (
                    <span style={{ marginLeft: "0.5rem", fontSize: "0.56rem", background: "rgba(201,169,110,0.12)", color: "#C9A96E", borderRadius: "4px", padding: "0.1rem 0.4rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {a.images.length} angles
                    </span>
                  )}
                </div>
                {/* Category */}
                <div style={{ padding: "0.5rem 0.8rem", fontSize: "0.65rem", color: "rgba(245,240,232,0.4)", letterSpacing: "0.06em" }}>{a.category}</div>
                {/* Year */}
                <div style={{ padding: "0.5rem 0.8rem", fontSize: "0.65rem", color: "rgba(245,240,232,0.4)" }}>{a.year}</div>
                {/* Featured */}
                <div style={{ padding: "0.5rem 0.8rem" }}>
                  <span style={{ fontSize: "0.6rem", background: a.featured ? "rgba(201,169,110,0.15)" : "rgba(255,255,255,0.04)", color: a.featured ? "#C9A96E" : "rgba(245,240,232,0.25)", borderRadius: "4px", padding: "0.15rem 0.5rem", letterSpacing: "0.08em" }}>
                    {a.featured ? "Yes" : "No"}
                  </span>
                </div>
                {/* Actions */}
                <div style={{ padding: "0.5rem 0.6rem", display: "flex", gap: "0.4rem" }}>
                  <button
                    onClick={() => setModal(a)}
                    style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "4px", color: "rgba(245,240,232,0.5)", fontSize: "0.62rem", padding: "0.3rem 0.6rem", cursor: "pointer", letterSpacing: "0.08em" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    disabled={deleting === a._id}
                    style={{ background: "rgba(229,115,115,0.08)", border: "none", borderRadius: "4px", color: "#e57373", fontSize: "0.62rem", padding: "0.3rem 0.6rem", cursor: "pointer", opacity: deleting === a._id ? 0.5 : 1 }}
                  >
                    Del
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <ArtworkModal
          initial={modal === "new" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </AdminShell>
  );
}
