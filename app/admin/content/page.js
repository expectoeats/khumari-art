"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import AdminShell from "../AdminShell";
import { FaTrash, FaPlus, FaCheck, FaUpload } from "react-icons/fa";

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState("");

  // Section states
  const [heroSlides, setHeroSlides] = useState([]);
  const [artist, setArtist]         = useState({
    name: "",
    title: "",
    photo: "",
    quote: "",
    bio1: "",
    bio2: "",
    stats: [
      { value: "256", label: "Original Works" },
      { value: "6.9k", label: "Followers" },
      { value: "7+", label: "Years Creating" },
    ],
    instagram: "",
  });
  const [announcement, setAnnouncement] = useState({
    text: "",
    whatsappNumber: "919818817291",
    studioEmail: "contact@kalasamputah.com",
    isVisible: true,
  });
  const [story, setStory] = useState({
    title: "",
    subtitle: "",
    quote: "",
    artworkTitle: "",
    src: "",
  });

  // Upload refs
  const artistPhotoRef = useRef(null);
  const storyImageRef  = useRef(null);
  const newSlideRef    = useRef(null);

  // New slide form
  const [newSlide, setNewSlide] = useState({ src: "", label: "" });

  useEffect(() => {
    fetch("/api/content")
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          if (data.content.hero?.slides) setHeroSlides(data.content.hero.slides);
          if (data.content.artist) setArtist(data.content.artist);
          if (data.content.announcement) setAnnouncement(data.content.announcement);
          if (data.content.story) setStory(data.content.story);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveSection = async (key, value) => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMsg(`${key.toUpperCase()} content saved successfully!`);
      setTimeout(() => setMsg(""), 3500);
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url;
  };

  return (
    <AdminShell>
      <div style={{ maxWidth: "1000px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.3rem" }}>
              Customizer
            </p>
            <h1 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontSize: "1.9rem", color: "#F5F0E8" }}>
              Website Content & Media
            </h1>
          </div>
          {msg && (
            <div style={{ padding: "0.5rem 1rem", borderRadius: "6px", background: msg.startsWith("Error") ? "rgba(220,53,69,0.2)" : "rgba(37,211,102,0.15)", border: `1px solid ${msg.startsWith("Error") ? "#e57373" : "#25D366"}`, color: "#F5F0E8", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FaCheck style={{ color: msg.startsWith("Error") ? "#e57373" : "#25D366" }} />
              {msg}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "2rem" }}>
          {[
            { id: "hero",         label: "Hero Slides" },
            { id: "artist",       label: "Artist Bio & Stats" },
            { id: "announcement", label: "Announcement & Contact" },
            { id: "story",        label: "Story of the Day" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.8rem 1.4rem",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.id ? "2px solid #C9A96E" : "2px solid transparent",
                color: activeTab === tab.id ? "#F5F0E8" : "rgba(245,240,232,0.4)",
                fontSize: "0.78rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontWeight: activeTab === tab.id ? 600 : 400,
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "0.9rem" }}>Loading content…</p>
        ) : (
          <div>
            
            {/* ── 1. HERO SLIDES ── */}
            {activeTab === "hero" && (
              <div style={{ background: "#161616", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", padding: "1.8rem" }}>
                <h3 style={{ fontSize: "1.1rem", color: "#F5F0E8", marginBottom: "0.5rem", fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif' }}>
                  Homepage Hero Slides
                </h3>
                <p style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.4)", marginBottom: "1.5rem" }}>
                  Add, edit or delete the full-screen slides that visitors see first on the homepage.
                </p>

                {/* Slides list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                  {heroSlides.map((slide, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        padding: "1rem",
                        background: "#1E1E1E",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div style={{ position: "relative", width: "80px", height: "55px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, background: "#2A2A2A" }}>
                        <Image src={slide.src} alt={slide.label} fill className="object-cover" />
                      </div>
                      <div style={{ flex: 1, display: "flex", gap: "0.8rem", alignItems: "center" }}>
                        <input
                          type="text"
                          value={slide.label}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].label = e.target.value;
                            setHeroSlides(updated);
                          }}
                          placeholder="Slide Label (e.g. Original Works)"
                          style={{
                            flex: 1,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "6px",
                            padding: "0.6rem 0.9rem",
                            color: "#F5F0E8",
                            fontSize: "0.85rem",
                          }}
                        />
                        <input
                          type="text"
                          value={slide.src}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].src = e.target.value;
                            setHeroSlides(updated);
                          }}
                          placeholder="Image Path"
                          style={{
                            flex: 1.5,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "6px",
                            padding: "0.6rem 0.9rem",
                            color: "#F5F0E8",
                            fontSize: "0.85rem",
                          }}
                        />
                      </div>
                      <button
                        onClick={() => setHeroSlides(heroSlides.filter((_, i) => i !== idx))}
                        style={{
                          background: "rgba(220,53,69,0.15)",
                          border: "none",
                          color: "#e57373",
                          padding: "0.6rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                        title="Delete Slide"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new slide box */}
                <div style={{ padding: "1.2rem", background: "rgba(201,169,110,0.05)", borderRadius: "8px", border: "1px dashed rgba(201,169,110,0.3)", marginBottom: "2rem" }}>
                  <p style={{ fontSize: "0.8rem", color: "#C9A96E", fontWeight: 600, marginBottom: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    + Add New Hero Slide
                  </p>
                  <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="Slide Label (e.g. Autumn Expressions)"
                      value={newSlide.label}
                      onChange={(e) => setNewSlide({ ...newSlide, label: e.target.value })}
                      style={{
                        flex: 1,
                        minWidth: "200px",
                        background: "#161616",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "6px",
                        padding: "0.65rem 0.9rem",
                        color: "#F5F0E8",
                        fontSize: "0.85rem",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Image URL or Path"
                      value={newSlide.src}
                      onChange={(e) => setNewSlide({ ...newSlide, src: e.target.value })}
                      style={{
                        flex: 1.5,
                        minWidth: "220px",
                        background: "#161616",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "6px",
                        padding: "0.65rem 0.9rem",
                        color: "#F5F0E8",
                        fontSize: "0.85rem",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => newSlideRef.current?.click()}
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#F5F0E8",
                        padding: "0.65rem 1rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <FaUpload /> Upload Image
                    </button>
                    <input
                      ref={newSlideRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadFile(file);
                          setNewSlide(s => ({ ...s, src: url }));
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newSlide.src || !newSlide.label) return;
                        setHeroSlides([...heroSlides, newSlide]);
                        setNewSlide({ src: "", label: "" });
                      }}
                      style={{
                        background: "#C9A96E",
                        border: "none",
                        color: "#111",
                        fontWeight: 600,
                        padding: "0.65rem 1.4rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      Add to List
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => saveSection("hero", { slides: heroSlides })}
                  disabled={saving}
                  style={{
                    background: "#C9A96E",
                    border: "none",
                    color: "#111",
                    fontWeight: 600,
                    padding: "0.8rem 2rem",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  {saving ? "Saving…" : "Save Hero Slides"}
                </button>
              </div>
            )}

            {/* ── 2. ARTIST BIO & STATS ── */}
            {activeTab === "artist" && (
              <div style={{ background: "#161616", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", padding: "1.8rem" }}>
                <h3 style={{ fontSize: "1.1rem", color: "#F5F0E8", marginBottom: "0.5rem", fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif' }}>
                  About Artist & Studio Stats
                </h3>
                <p style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.4)", marginBottom: "1.5rem" }}>
                  Update Nancy Sikri's portrait photo, biography text, quote, and live studio metrics.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A96E", display: "block", marginBottom: "0.4rem" }}>
                      Artist Name
                    </label>
                    <input
                      type="text"
                      value={artist.name}
                      onChange={(e) => setArtist({ ...artist, name: e.target.value })}
                      style={{ width: "100%", background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.7rem", color: "#F5F0E8" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A96E", display: "block", marginBottom: "0.4rem" }}>
                      Tagline / Location
                    </label>
                    <input
                      type="text"
                      value={artist.title}
                      onChange={(e) => setArtist({ ...artist, title: e.target.value })}
                      style={{ width: "100%", background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.7rem", color: "#F5F0E8" }}
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A96E", display: "block", marginBottom: "0.4rem" }}>
                    Artist Portrait Photo
                  </label>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    {artist.photo && (
                      <div style={{ position: "relative", width: "70px", height: "70px", borderRadius: "50%", overflow: "hidden", border: "2px solid #C9A96E", flexShrink: 0 }}>
                        <Image src={artist.photo} alt="Artist photo" fill className="object-cover" />
                      </div>
                    )}
                    <input
                      type="text"
                      value={artist.photo}
                      onChange={(e) => setArtist({ ...artist, photo: e.target.value })}
                      placeholder="Photo URL or upload image"
                      style={{ flex: 1, background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.7rem", color: "#F5F0E8" }}
                    />
                    <button
                      type="button"
                      onClick={() => artistPhotoRef.current?.click()}
                      style={{ background: "#C9A96E", border: "none", color: "#111", padding: "0.7rem 1.2rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}
                    >
                      <FaUpload /> Upload
                    </button>
                    <input
                      ref={artistPhotoRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadFile(file);
                          setArtist(a => ({ ...a, photo: url }));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Quote */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A96E", display: "block", marginBottom: "0.4rem" }}>
                    Featured Artist Quote
                  </label>
                  <input
                    type="text"
                    value={artist.quote}
                    onChange={(e) => setArtist({ ...artist, quote: e.target.value })}
                    style={{ width: "100%", background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.7rem", color: "#F5F0E8" }}
                  />
                </div>

                {/* Bio paragraphs */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A96E", display: "block", marginBottom: "0.4rem" }}>
                      Biography Paragraph 1
                    </label>
                    <textarea
                      rows={3}
                      value={artist.bio1}
                      onChange={(e) => setArtist({ ...artist, bio1: e.target.value })}
                      style={{ width: "100%", background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.7rem", color: "#F5F0E8", resize: "vertical" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A96E", display: "block", marginBottom: "0.4rem" }}>
                      Biography Paragraph 2
                    </label>
                    <textarea
                      rows={3}
                      value={artist.bio2}
                      onChange={(e) => setArtist({ ...artist, bio2: e.target.value })}
                      style={{ width: "100%", background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.7rem", color: "#F5F0E8", resize: "vertical" }}
                    />
                  </div>
                </div>

                {/* Stats Counters */}
                <div style={{ marginBottom: "2rem" }}>
                  <label style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A96E", display: "block", marginBottom: "0.6rem" }}>
                    Studio Stats Counters
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                    {artist.stats?.map((stat, i) => (
                      <div key={i} style={{ background: "#1E1E1E", padding: "0.8rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const updated = [...artist.stats];
                            updated[i].value = e.target.value;
                            setArtist({ ...artist, stats: updated });
                          }}
                          placeholder="Value (e.g. 256)"
                          style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#C9A96E", fontSize: "1.2rem", fontWeight: 600, paddingBottom: "0.3rem", marginBottom: "0.4rem" }}
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const updated = [...artist.stats];
                            updated[i].label = e.target.value;
                            setArtist({ ...artist, stats: updated });
                          }}
                          placeholder="Label (e.g. Original Works)"
                          style={{ width: "100%", background: "transparent", border: "none", color: "rgba(245,240,232,0.6)", fontSize: "0.75rem" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => saveSection("artist", artist)}
                  disabled={saving}
                  style={{
                    background: "#C9A96E",
                    border: "none",
                    color: "#111",
                    fontWeight: 600,
                    padding: "0.8rem 2rem",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  {saving ? "Saving…" : "Save Artist Bio & Stats"}
                </button>
              </div>
            )}

            {/* ── 3. ANNOUNCEMENT & CONTACT ── */}
            {activeTab === "announcement" && (
              <div style={{ background: "#161616", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", padding: "1.8rem" }}>
                <h3 style={{ fontSize: "1.1rem", color: "#F5F0E8", marginBottom: "0.5rem", fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif' }}>
                  Announcement Bar & Studio Contact
                </h3>
                <p style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.4)", marginBottom: "1.5rem" }}>
                  Manage the top announcement bar ticker and direct contact channels.
                </p>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A96E", display: "block", marginBottom: "0.4rem" }}>
                    Top Bar Announcement Text
                  </label>
                  <input
                    type="text"
                    value={announcement.text}
                    onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                    placeholder="e.g. New collection available — Inquire for pricing"
                    style={{ width: "100%", background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.7rem", color: "#F5F0E8" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A96E", display: "block", marginBottom: "0.4rem" }}>
                      WhatsApp Number (for direct chat)
                    </label>
                    <input
                      type="text"
                      value={announcement.whatsappNumber}
                      onChange={(e) => setAnnouncement({ ...announcement, whatsappNumber: e.target.value })}
                      placeholder="e.g. 919818817291"
                      style={{ width: "100%", background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.7rem", color: "#F5F0E8" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A96E", display: "block", marginBottom: "0.4rem" }}>
                      Inquiry Email Address
                    </label>
                    <input
                      type="email"
                      value={announcement.studioEmail}
                      onChange={(e) => setAnnouncement({ ...announcement, studioEmail: e.target.value })}
                      placeholder="e.g. contact@kalasamputah.com"
                      style={{ width: "100%", background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.7rem", color: "#F5F0E8" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={announcement.isVisible}
                      onChange={(e) => setAnnouncement({ ...announcement, isVisible: e.target.checked })}
                      style={{ width: "16px", height: "16px", accentColor: "#C9A96E" }}
                    />
                    <span style={{ fontSize: "0.85rem", color: "#F5F0E8" }}>Show Announcement Bar on Website</span>
                  </label>
                </div>

                <button
                  onClick={() => saveSection("announcement", announcement)}
                  disabled={saving}
                  style={{
                    background: "#C9A96E",
                    border: "none",
                    color: "#111",
                    fontWeight: 600,
                    padding: "0.8rem 2rem",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  {saving ? "Saving…" : "Save Announcement & Contact"}
                </button>
              </div>
            )}

            {/* ── 4. STORY OF THE DAY ── */}
            {activeTab === "story" && (
              <div style={{ background: "#161616", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", padding: "1.8rem" }}>
                <h3 style={{ fontSize: "1.1rem", color: "#F5F0E8", marginBottom: "0.5rem", fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif' }}>
                  Story of the Day
                </h3>
                <p style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.4)", marginBottom: "1.5rem" }}>
                  Update the featured journal story and highlighted artwork on the homepage.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A96E", display: "block", marginBottom: "0.4rem" }}>
                      Story Title
                    </label>
                    <input
                      type="text"
                      value={story.title}
                      onChange={(e) => setStory({ ...story, title: e.target.value })}
                      style={{ width: "100%", background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.7rem", color: "#F5F0E8" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A96E", display: "block", marginBottom: "0.4rem" }}>
                      Featured Artwork Title
                    </label>
                    <input
                      type="text"
                      value={story.artworkTitle}
                      onChange={(e) => setStory({ ...story, artworkTitle: e.target.value })}
                      style={{ width: "100%", background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.7rem", color: "#F5F0E8" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A96E", display: "block", marginBottom: "0.4rem" }}>
                    Story Excerpt / Quote
                  </label>
                  <textarea
                    rows={3}
                    value={story.quote}
                    onChange={(e) => setStory({ ...story, quote: e.target.value })}
                    style={{ width: "100%", background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.7rem", color: "#F5F0E8", resize: "vertical" }}
                  />
                </div>

                {/* Image Upload */}
                <div style={{ marginBottom: "2rem" }}>
                  <label style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A96E", display: "block", marginBottom: "0.4rem" }}>
                    Featured Artwork Image
                  </label>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    {story.src && (
                      <div style={{ position: "relative", width: "70px", height: "70px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
                        <Image src={story.src} alt="Story artwork" fill className="object-cover" />
                      </div>
                    )}
                    <input
                      type="text"
                      value={story.src}
                      onChange={(e) => setStory({ ...story, src: e.target.value })}
                      placeholder="Image URL or upload file"
                      style={{ flex: 1, background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.7rem", color: "#F5F0E8" }}
                    />
                    <button
                      type="button"
                      onClick={() => storyImageRef.current?.click()}
                      style={{ background: "#C9A96E", border: "none", color: "#111", padding: "0.7rem 1.2rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}
                    >
                      <FaUpload /> Upload
                    </button>
                    <input
                      ref={storyImageRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadFile(file);
                          setStory(s => ({ ...s, src: url }));
                        }
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => saveSection("story", story)}
                  disabled={saving}
                  style={{
                    background: "#C9A96E",
                    border: "none",
                    color: "#111",
                    fontWeight: 600,
                    padding: "0.8rem 2rem",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  {saving ? "Saving…" : "Save Story of the Day"}
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </AdminShell>
  );
}
