"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { FaDownload, FaPalette, FaExpand, FaCompress } from "react-icons/fa";

// ─── Wall colour palettes ───────────────────────────────────────────────────
const WALL_SWATCHES = [
  { name: "Ivory White",    hex: "#F8F5F0" },
  { name: "Warm Beige",     hex: "#E8D9C5" },
  { name: "Dusty Rose",     hex: "#D9B8AD" },
  { name: "Sage Green",     hex: "#9CAF95" },
  { name: "Steel Blue",     hex: "#7A9BB5" },
  { name: "Navy",           hex: "#1E2E4A" },
  { name: "Charcoal",       hex: "#2E2E2E" },
  { name: "Terracotta",     hex: "#C97B55" },
  { name: "Olive",          hex: "#6B7A4A" },
  { name: "Lilac Mist",     hex: "#C8B8D5" },
  { name: "Slate Grey",     hex: "#8A9099" },
  { name: "Midnight Black", hex: "#111111" },
];

// ─── Room scene configs ─────────────────────────────────────────────────────
const ROOM_STYLES = [
  { id: "minimal",  label: "Minimal"  },
  { id: "luxury",   label: "Luxury"   },
  { id: "dark",     label: "Dark Loft"},
];

// Painting scale presets (% of visualizer width)
const SCALE_PRESETS = [
  { label: "Small",  value: 22 },
  { label: "Medium", value: 36 },
  { label: "Large",  value: 52 },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Darken a hex colour by `amount` (0–255) for skirting/dado line */
function darken(hex, amount = 30) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (n >> 16) - amount);
  const g = Math.max(0, ((n >> 8) & 0xff) - amount);
  const b = Math.max(0, (n & 0xff) - amount);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** Is the colour perceived as dark? */
function isDark(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = n >> 16;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return 0.299 * r + 0.587 * g + 0.114 * b < 128;
}

// ─── WallVisualizer ─────────────────────────────────────────────────────────
export default function WallVisualizer({ artwork }) {
  const [wallColor, setWallColor]     = useState("#F8F5F0");
  const [scaleIdx, setScaleIdx]       = useState(1); // Medium default
  const [roomStyle, setRoomStyle]     = useState("minimal");
  const [customColor, setCustomColor] = useState("#F8F5F0");
  const [fullscreen, setFullscreen]   = useState(false);
  const sceneRef                      = useRef(null);

  const scale     = SCALE_PRESETS[scaleIdx].value;
  const dark      = isDark(wallColor);
  const textColor = dark ? "rgba(255,255,255,0.75)" : "rgba(30,20,10,0.55)";
  const shadowColor = dark
    ? "0 12px 50px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5)"
    : "0 12px 50px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.14)";

  // ── Floor / dado colours derived from wall ──────────────────────────────
  const floorColor  = roomStyle === "dark" ? "#1A1410" : darken(wallColor, 55);
  const dadoColor   = darken(wallColor, 18);
  const moldingSize = roomStyle === "luxury" ? "6px" : "0px";

  // ── Download scene as PNG ────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!sceneRef.current) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(sceneRef.current, {
        useCORS:     true,
        allowTaint:  true,
        scale:       2,
        logging:     false,
      });
      const link = document.createElement("a");
      link.download = `${artwork?.title || "artwork"}-wall-preview.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("[WallVisualizer] download failed:", err);
    }
  };

  // ── Room scene JSX ───────────────────────────────────────────────────────
  const RoomScene = () => (
    <div
      ref={sceneRef}
      style={{
        position:       "relative",
        width:          "100%",
        aspectRatio:    fullscreen ? "16/7" : "16/9",
        background:     wallColor,
        transition:     "background 0.4s ease, aspect-ratio 0.3s ease",
        overflow:       "hidden",
        borderRadius:   fullscreen ? "0" : "12px",
      }}
    >
      {/* ── Ceiling trim (luxury only) ─────────────────────────────── */}
      {roomStyle === "luxury" && (
        <div style={{
          position:   "absolute",
          top:        0,
          left:       0,
          right:      0,
          height:     "6px",
          background: darken(wallColor, 40),
        }} />
      )}

      {/* ── Dado rail / wainscoting (luxury) ──────────────────────── */}
      {roomStyle === "luxury" && (
        <>
          <div style={{
            position:   "absolute",
            bottom:     "22%",
            left:       0,
            right:      0,
            height:     "3px",
            background: dadoColor,
            opacity:    0.6,
          }} />
          <div style={{
            position:   "absolute",
            bottom:     0,
            left:       0,
            right:      0,
            height:     "22%",
            background: darken(wallColor, 25),
            opacity:    0.55,
          }} />
        </>
      )}

      {/* ── Floor line ────────────────────────────────────────────── */}
      <div style={{
        position:   "absolute",
        bottom:     0,
        left:       0,
        right:      0,
        height:     roomStyle === "minimal" ? "12%" : "10%",
        background: floorColor,
        opacity:    0.75,
      }} />

      {/* ── Skirting board ────────────────────────────────────────── */}
      <div style={{
        position:   "absolute",
        bottom:     roomStyle === "minimal" ? "12%" : "10%",
        left:       0,
        right:      0,
        height:     moldingSize || "2px",
        background: darken(wallColor, 50),
        opacity:    0.6,
      }} />

      {/* ── Furniture silhouette (luxury — subtle sofa shadow) ────── */}
      {roomStyle === "luxury" && (
        <div style={{
          position:        "absolute",
          bottom:          "10%",
          left:            "50%",
          transform:       "translateX(-50%)",
          width:           "55%",
          height:          "11%",
          background:      darken(wallColor, 70),
          opacity:         0.18,
          borderRadius:    "4px 4px 0 0",
          filter:          "blur(6px)",
        }} />
      )}

      {/* ── Side lighting (dark loft: two warm spotlights) ─────────── */}
      {roomStyle === "dark" && (
        <>
          <div style={{
            position:   "absolute",
            top:        0,
            left:       "25%",
            width:      "12%",
            height:     "60%",
            background: "radial-gradient(ellipse at top, rgba(255,200,100,0.18) 0%, transparent 75%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position:   "absolute",
            top:        0,
            right:      "20%",
            width:      "14%",
            height:     "55%",
            background: "radial-gradient(ellipse at top, rgba(255,210,120,0.14) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
        </>
      )}

      {/* ── Painting ──────────────────────────────────────────────── */}
      <div style={{
        position:        "absolute",
        top:             "50%",
        left:            "50%",
        transform:       "translate(-50%, -60%)",
        width:           `${scale}%`,
        transition:      "width 0.35s ease, box-shadow 0.4s ease",
        boxShadow:       shadowColor,
        border:          roomStyle === "luxury"
          ? "8px solid #F5EFE6"
          : roomStyle === "dark"
          ? "6px solid #1C1C1C"
          : "5px solid #FDFAF5",
        outline:         roomStyle === "luxury" ? "1px solid rgba(0,0,0,0.1)" : "none",
        aspectRatio:     "3/4",
        overflow:        "hidden",
      }}>
        {artwork?.src ? (
          <img
            src={artwork.src}
            alt={artwork.title || "Artwork"}
            style={{
              width:      "100%",
              height:     "100%",
              objectFit:  "cover",
              display:    "block",
            }}
            crossOrigin="anonymous"
          />
        ) : (
          <div style={{
            width:      "100%",
            height:     "100%",
            background: "rgba(201,169,110,0.25)",
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ color: "rgba(201,169,110,0.7)", fontSize: "0.75rem" }}>
              No image
            </span>
          </div>
        )}
      </div>

      {/* ── Painting title label ───────────────────────────────────── */}
      <div style={{
        position:   "absolute",
        bottom:     roomStyle === "minimal" ? "14%" : "12%",
        left:       "50%",
        transform:  "translateX(-50%)",
        color:      textColor,
        fontSize:   "0.58rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        fontFamily:    '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
        whiteSpace:    "nowrap",
        pointerEvents: "none",
      }}>
        {artwork?.title || ""}
      </div>
    </div>
  );

  return (
    <div style={{ width: "100%" }}>

      {/* ── Scene ───────────────────────────────────────────────────── */}
      <div style={{ position: "relative" }}>
        <RoomScene />

        {/* Fullscreen toggle */}
        <button
          onClick={() => setFullscreen((v) => !v)}
          title={fullscreen ? "Exit fullscreen" : "Fullscreen preview"}
          style={{
            position:    "absolute",
            top:         "0.6rem",
            right:       "0.6rem",
            background:  "rgba(0,0,0,0.35)",
            border:      "none",
            borderRadius: "6px",
            color:       "#fff",
            width:       "2rem",
            height:      "2rem",
            display:     "flex",
            alignItems:  "center",
            justifyContent: "center",
            cursor:      "pointer",
            backdropFilter: "blur(4px)",
          }}
        >
          {fullscreen ? <FaCompress size={12} /> : <FaExpand size={12} />}
        </button>
      </div>

      {/* ── Controls panel ──────────────────────────────────────────── */}
      <div style={{
        marginTop:    "1.2rem",
        display:      "flex",
        flexDirection: "column",
        gap:          "1.2rem",
      }}>

        {/* Row 1: Wall Colour swatches */}
        <div>
          <p style={{
            fontSize:      "0.58rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color:         "rgba(74,40,24,0.45)",
            fontFamily:    '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            marginBottom:  "0.6rem",
            display:       "flex",
            alignItems:    "center",
            gap:           "0.35rem",
          }}>
            <FaPalette size={10} /> Wall Colour
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            {WALL_SWATCHES.map((sw) => (
              <button
                key={sw.hex}
                title={sw.name}
                onClick={() => setWallColor(sw.hex)}
                style={{
                  width:        "2.1rem",
                  height:       "2.1rem",
                  borderRadius: "50%",
                  background:   sw.hex,
                  border:       wallColor === sw.hex
                    ? "2.5px solid #C9A96E"
                    : "2px solid rgba(0,0,0,0.1)",
                  boxShadow:    wallColor === sw.hex ? "0 0 0 2px rgba(201,169,110,0.4)" : "none",
                  cursor:       "pointer",
                  transition:   "transform 0.15s ease, box-shadow 0.15s ease",
                  flexShrink:   0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            ))}

            {/* Custom colour picker */}
            <label
              title="Pick custom colour"
              style={{
                width:        "2.1rem",
                height:       "2.1rem",
                borderRadius: "50%",
                background:   `conic-gradient(red, yellow, lime, cyan, blue, magenta, red)`,
                border:       "2px solid rgba(0,0,0,0.1)",
                cursor:       "pointer",
                flexShrink:   0,
                position:     "relative",
                overflow:     "hidden",
              }}
            >
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setWallColor(e.target.value);
                }}
                style={{
                  position: "absolute",
                  opacity:  0,
                  inset:    0,
                  width:    "100%",
                  height:   "100%",
                  cursor:   "pointer",
                }}
              />
            </label>
          </div>
        </div>

        {/* Row 2: Painting Size + Room Style */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>

          {/* Size */}
          <div>
            <p style={{
              fontSize:      "0.58rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color:         "rgba(74,40,24,0.45)",
              fontFamily:    '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              marginBottom:  "0.55rem",
            }}>
              Painting Size
            </p>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {SCALE_PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => setScaleIdx(i)}
                  style={{
                    padding:       "0.35rem 0.9rem",
                    borderRadius:  "20px",
                    border:        `1.5px solid ${scaleIdx === i ? "#C9A96E" : "rgba(74,40,24,0.15)"}`,
                    background:    scaleIdx === i ? "rgba(201,169,110,0.12)" : "transparent",
                    color:         scaleIdx === i ? "#C9A96E" : "rgba(74,40,24,0.45)",
                    fontSize:      "0.62rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily:    '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                    cursor:        "pointer",
                    transition:    "all 0.2s ease",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Room Style */}
          <div>
            <p style={{
              fontSize:      "0.58rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color:         "rgba(74,40,24,0.45)",
              fontFamily:    '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              marginBottom:  "0.55rem",
            }}>
              Room Style
            </p>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {ROOM_STYLES.map((rs) => (
                <button
                  key={rs.id}
                  onClick={() => setRoomStyle(rs.id)}
                  style={{
                    padding:       "0.35rem 0.9rem",
                    borderRadius:  "20px",
                    border:        `1.5px solid ${roomStyle === rs.id ? "#C9A96E" : "rgba(74,40,24,0.15)"}`,
                    background:    roomStyle === rs.id ? "rgba(201,169,110,0.12)" : "transparent",
                    color:         roomStyle === rs.id ? "#C9A96E" : "rgba(74,40,24,0.45)",
                    fontSize:      "0.62rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily:    '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                    cursor:        "pointer",
                    transition:    "all 0.2s ease",
                  }}
                >
                  {rs.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Download button */}
        <div>
          <button
            onClick={handleDownload}
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              gap:           "0.5rem",
              padding:       "0.55rem 1.4rem",
              background:    "#1C1C1C",
              color:         "#F5EFE6",
              border:        "none",
              borderRadius:  "6px",
              fontSize:      "0.62rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily:    '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              cursor:        "pointer",
              transition:    "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#C9A96E")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1C1C1C")}
          >
            <FaDownload size={11} />
            Save Preview
          </button>
          <p style={{
            marginTop:     "0.35rem",
            fontSize:      "0.6rem",
            color:         "rgba(74,40,24,0.35)",
            fontFamily:    '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
          }}>
            Share with your interior designer or save for reference
          </p>
        </div>
      </div>
    </div>
  );
}
