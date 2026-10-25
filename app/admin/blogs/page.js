"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "../AdminShell";

const EMPTY = {
  slug: "", title: "", category: "Process", excerpt: "", cover: "",
  readTime: "5 min", published: false,
  content: [{ type: "paragraph", text: "" }],
};

const Label = ({ children }) => (
  <span style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", display: "block", marginBottom: "0.4rem" }}>
    {children}
  </span>
);
const Input = ({ value, onChange, placeholder = "", type = "text" }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{ width: "100%", background: "rgba(245,240,232,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#F5F0E8", fontSize: "0.85rem", padding: "0.6rem 0.8rem", outline: "none", borderRadius: "6px", fontFamily: "'Jost', sans-serif" }}
  />
);
const Textarea = ({ value, onChange, rows = 3 }) => (
  <textarea value={value} onChange={onChange} rows={rows}
    style={{ width: "100%", background: "rgba(245,240,232,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#F5F0E8", fontSize: "0.85rem", padding: "0.6rem 0.8rem", outline: "none", borderRadius: "6px", fontFamily: "'Jost', sans-serif", resize: "vertical", lineHeight: 1.6 }}
  />
);

function BlogModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const setBlock = (i, key, val) => {
    setForm(f => {
      const content = [...f.content];
      content[i] = { ...content[i], [key]: val };
      return { ...f, content };
    });
  };
  const addBlock    = (type) => setForm(f => ({ ...f, content: [...f.content, { type, text: "" }] }));
  const removeBlock = (i)    => setForm(f => ({ ...f, content: f.content.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    if (!form.slug || !form.title) { setError("Slug and title are required."); return; }
    setSaving(true); setError("");
    try {
      const method = form._id ? "PUT" : "POST";
      const url    = form._id ? `/api/blogs/${form._id}` : "/api/blogs";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data   = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); return; }
      onSave(data.post);
    } catch { setError("Network error"); }
    finally { setSaving(false); }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "2rem 1rem", overflowY: "auto" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", width: "100%", maxWidth: "640px", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Beausite Classic', serif", fontSize: "1.4rem", color: "#F5F0E8" }}>
            {form._id ? "Edit Post" : "New Blog Post"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(245,240,232,0.4)", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div><Label>Title *</Label><Input value={form.title} onChange={set("title")} /></div>
            <div>
              <Label>Slug *</Label>
              <Input
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }))}
                placeholder="url-friendly-slug"
              />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
            <div>
              <Label>Category</Label>
              <select value={form.category} onChange={set("category")}
                style={{ width: "100%", background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", color: "#F5F0E8", fontSize: "0.85rem", padding: "0.6rem 0.8rem", outline: "none", borderRadius: "6px", cursor: "pointer" }}>
                {["Process","Behind the work","Thoughts"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><Label>Read Time</Label><Input value={form.readTime} onChange={set("readTime")} placeholder="5 min" /></div>
            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "0.1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", paddingBottom: "0.7rem" }}>
                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} style={{ accentColor: "#81c784", width: "14px", height: "14px" }} />
                <span style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.5)", letterSpacing: "0.06em" }}>Published</span>
              </label>
            </div>
          </div>
          <div><Label>Cover Image Path</Label><Input value={form.cover} onChange={set("cover")} placeholder="/art/filename.jpg" /></div>
          <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={set("excerpt")} rows={2} /></div>

          {/* Content blocks */}
          <div>
            <Label>Content Blocks</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {form.content.map((block, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <select
                      value={block.type}
                      onChange={e => setBlock(i, "type", e.target.value)}
                      style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(245,240,232,0.6)", fontSize: "0.65rem", padding: "0.2rem 0.5rem", borderRadius: "4px", outline: "none", cursor: "pointer" }}
                    >
                      {["paragraph", "quote", "heading"].map(t => <option key={t}>{t}</option>)}
                    </select>
                    <button onClick={() => removeBlock(i)} style={{ background: "none", border: "none", color: "rgba(229,115,115,0.6)", fontSize: "0.75rem", cursor: "pointer", padding: "0 0.25rem" }}>✕</button>
                  </div>
                  <Textarea value={block.text} onChange={e => setBlock(i, "text", e.target.value)} rows={block.type === "paragraph" ? 3 : 2} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
              {["paragraph","quote","heading"].map(t => (
                <button key={t} onClick={() => addBlock(t)}
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px", color: "rgba(245,240,232,0.4)", fontSize: "0.62rem", letterSpacing: "0.1em", padding: "0.3rem 0.7rem", cursor: "pointer" }}>
                  + {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <p style={{ color: "#e57373", fontSize: "0.75rem", marginTop: "1rem" }}>{error}</p>}

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "rgba(245,240,232,0.4)", fontSize: "0.7rem", letterSpacing: "0.12em", padding: "0.6rem 1.2rem", cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving}
            style={{ background: "#C9A96E", border: "none", borderRadius: "6px", color: "#111010", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, padding: "0.6rem 1.4rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBlogs() {
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/blogs");
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = (saved) => {
    setPosts(prev => {
      const exists = prev.find(p => p._id === saved._id);
      return exists ? prev.map(p => p._id === saved._id ? saved : p) : [saved, ...prev];
    });
    setModal(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    setDeleting(id);
    await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    setPosts(prev => prev.filter(p => p._id !== id));
    setDeleting(null);
  };

  const togglePublish = async (post) => {
    const res  = await fetch(`/api/blogs/${post._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...post, published: !post.published }) });
    const data = await res.json();
    if (res.ok) setPosts(prev => prev.map(p => p._id === data.post._id ? data.post : p));
  };

  return (
    <AdminShell>
      <div style={{ padding: "2.5rem 2rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.3rem" }}>Manage</p>
            <h1 style={{ fontFamily: "'Beausite Classic', serif", fontSize: "1.9rem", color: "#F5F0E8" }}>Blog Posts</h1>
          </div>
          <button onClick={() => setModal("new")}
            style={{ background: "#C9A96E", border: "none", borderRadius: "6px", color: "#111010", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, padding: "0.65rem 1.4rem", cursor: "pointer" }}>
            + New Post
          </button>
        </div>

        <p style={{ fontSize: "0.62rem", color: "rgba(245,240,232,0.25)", letterSpacing: "0.1em", marginBottom: "1.2rem" }}>
          {loading ? "Loading…" : `${posts.length} post${posts.length !== 1 ? "s" : ""}`}
        </p>

        <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 80px 90px 100px", gap: 0, background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {["Title", "Category", "Read", "Status", ""].map((h, i) => (
              <div key={i} style={{ padding: "0.65rem 0.8rem", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)" }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>Loading posts…</div>
          ) : posts.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>No posts yet.</div>
          ) : posts.map((post, i) => (
            <div key={post._id} style={{ display: "grid", gridTemplateColumns: "1fr 110px 80px 90px 100px", borderBottom: i < posts.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
              <div style={{ padding: "0.7rem 0.8rem" }}>
                <p style={{ fontSize: "0.85rem", color: "#F5F0E8", fontFamily: "'Beausite Classic', serif", marginBottom: "0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</p>
                <p style={{ fontSize: "0.6rem", color: "rgba(245,240,232,0.25)", letterSpacing: "0.06em" }}>{post.slug}</p>
              </div>
              <div style={{ padding: "0.7rem 0.8rem", fontSize: "0.65rem", color: "rgba(245,240,232,0.4)" }}>{post.category}</div>
              <div style={{ padding: "0.7rem 0.8rem", fontSize: "0.65rem", color: "rgba(245,240,232,0.35)" }}>{post.readTime}</div>
              <div style={{ padding: "0.7rem 0.8rem" }}>
                <button onClick={() => togglePublish(post)}
                  style={{ fontSize: "0.6rem", background: post.published ? "rgba(129,199,132,0.12)" : "rgba(255,255,255,0.04)", color: post.published ? "#81c784" : "rgba(245,240,232,0.3)", border: `1px solid ${post.published ? "rgba(129,199,132,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: "4px", padding: "0.2rem 0.6rem", cursor: "pointer", letterSpacing: "0.06em" }}>
                  {post.published ? "Published" : "Draft"}
                </button>
              </div>
              <div style={{ padding: "0.7rem 0.6rem", display: "flex", gap: "0.4rem" }}>
                <button onClick={() => setModal(post)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "4px", color: "rgba(245,240,232,0.5)", fontSize: "0.62rem", padding: "0.3rem 0.6rem", cursor: "pointer" }}>Edit</button>
                <button onClick={() => handleDelete(post._id)} disabled={deleting === post._id}
                  style={{ background: "rgba(229,115,115,0.08)", border: "none", borderRadius: "4px", color: "#e57373", fontSize: "0.62rem", padding: "0.3rem 0.6rem", cursor: "pointer", opacity: deleting === post._id ? 0.5 : 1 }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && <BlogModal initial={modal === "new" ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </AdminShell>
  );
}
