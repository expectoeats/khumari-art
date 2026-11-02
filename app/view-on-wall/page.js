"use client";

import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { allWorks } from "../../components/data";
import { useSiteContent } from "../../components/SiteContentContext";
import {
  ROOM_CATEGORIES,
  ROOMS_DATA,
  FRAME_STYLES,
  SCALE_PRESETS,
  LIGHTING_MODES,
} from "../../components/roomsData";
import {
  FaArrowLeft,
  FaWhatsapp,
  FaDownload,
  FaSlidersH,
  FaImages,
  FaExpand,
  FaCompress,
  FaRedoAlt,
  FaTimes,
  FaCheck,
  FaRulerCombined,
  FaSun,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function RoomVisualizerContent() {
  const searchParams = useSearchParams();
  const targetId = searchParams.get("id") || searchParams.get("artworkId") || "";

  // ── Artworks Catalog State ──
  const [artworksList, setArtworksList] = useState(allWorks);
  const [selectedArtwork, setSelectedArtwork] = useState(() => {
    if (!targetId) return allWorks[0];
    const match = allWorks.find(
      (w) =>
        w.id?.toString() === targetId ||
        w._id?.toString() === targetId ||
        (parseInt(targetId, 10) && w.id === parseInt(targetId, 10))
    );
    return match || allWorks[0];
  });

  // Fetch full live catalog from /api/artworks
  useEffect(() => {
    let active = true;
    const fetchArt = async () => {
      try {
        const res = await fetch("/api/artworks?limit=60");
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data.artworks) && data.artworks.length > 0 ? data.artworks : [];
          if (active && items.length > 0) {
            const mapped = items.map((art) => ({
              id: art._id,
              _id: art._id,
              title: art.title,
              artist: art.artist || "Nancy Sikri",
              medium: art.medium || "Acrylic on Canvas",
              size: art.dimensions || art.size || "Original Size",
              year: art.year || 2024,
              src: art.images?.[0] || art.image || art.src || "/art/placeholder.jpg",
            }));
            setArtworksList((prev) => {
              const combined = [...mapped];
              allWorks.forEach((sw) => {
                if (!combined.some((c) => c.title.toLowerCase() === sw.title.toLowerCase())) {
                  combined.push(sw);
                }
              });
              return combined;
            });

            if (targetId) {
              const found = mapped.find(
                (m) => m._id === targetId || m.id?.toString() === targetId
              );
              if (found) setSelectedArtwork(found);
            }
          }
        }
      } catch (err) {
        console.error("[Visualizer] fetch artworks failed:", err);
      }
    };
    fetchArt();
    return () => {
      active = false;
    };
  }, [targetId]);

  // ── Visualizer State ──
  const [selectedRoom, setSelectedRoom] = useState(ROOMS_DATA[0]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedFrame, setSelectedFrame] = useState(FRAME_STYLES[0]);
  const [scalePercent, setScalePercent] = useState(22); // balanced medium scale (percentage of room width)
  const [posOffset, setPosOffset] = useState({ x: 0, y: 0 }); // offset from defaultPos
  const [showDimensions, setShowDimensions] = useState(false);
  const [lighting, setLighting] = useState(LIGHTING_MODES[0]);
  const [isArtworkDrawerOpen, setIsArtworkDrawerOpen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isZenMode, setIsZenMode] = useState(false); // TRUE HIDE: only room and painting, zero UI text/buttons!
  const [isTopHovered, setIsTopHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("rooms"); // "rooms" | "frames" | "scale" | "lighting"

  const { content } = useSiteContent();
  const rawWhatsApp =
    content?.contact?.whatsappNumber ||
    content?.announcement?.whatsappNumber ||
    "919818817291";
  const whatsappNumber = rawWhatsApp.replace(/[^0-9]/g, "");

  // Stage reference for snapshot
  const stageRef = useRef(null);
  const topHoverTimeoutRef = useRef(null);

  // ── 1. Painting Drag & Reposition Logic ──
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ clientX: 0, clientY: 0, startPos: { x: 0, y: 0 } });

  const handlePointerDown = (e) => {
    // If clicking on resize handle or in Zen mode without interaction, ignore
    if (e.target.closest(".resize-handle")) return;
    e.preventDefault();
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      clientX,
      clientY,
      startPos: { ...posOffset },
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - dragStartRef.current.clientX;
    const deltaY = clientY - dragStartRef.current.clientY;

    const rect = stageRef.current ? stageRef.current.getBoundingClientRect() : { width: 1000, height: 600 };
    const pctX = (deltaX / rect.width) * 100;
    const pctY = (deltaY / rect.height) * 100;

    setPosOffset({
      x: dragStartRef.current.startPos.x + pctX,
      y: dragStartRef.current.startPos.y + pctY,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("touchmove", handlePointerMove, { passive: false });
      window.addEventListener("touchend", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [isDragging]);

  // ── 2. Interactive Direct Painting Resize Logic (Dragging Corner Handle) ──
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ clientX: 0, startScale: 22 });

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    resizeStartRef.current = {
      clientX,
      startScale: scalePercent,
    };
  };

  const handleResizeMove = (e) => {
    if (!isResizing) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - resizeStartRef.current.clientX;
    const rect = stageRef.current ? stageRef.current.getBoundingClientRect() : { width: 1000 };
    const pctChange = (deltaX / rect.width) * 100;
    // Bound scale between 10% and 48% of screen width
    const newScale = Math.max(10, Math.min(48, resizeStartRef.current.startScale + pctChange));
    setScalePercent(Math.round(newScale));
  };

  const handleResizeUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("pointermove", handleResizeMove);
      window.addEventListener("pointerup", handleResizeUp);
      window.addEventListener("touchmove", handleResizeMove, { passive: false });
      window.addEventListener("touchend", handleResizeUp);
    }
    return () => {
      window.removeEventListener("pointermove", handleResizeMove);
      window.removeEventListener("pointerup", handleResizeUp);
      window.removeEventListener("touchmove", handleResizeMove);
      window.removeEventListener("touchend", handleResizeUp);
    };
  }, [isResizing]);

  // ── 3. Zen Mode Top Hover Logic ──
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isZenMode) return;
      // If cursor is within top 75px of viewport, show top exit pill
      if (e.clientY < 75) {
        setIsTopHovered(true);
        if (topHoverTimeoutRef.current) clearTimeout(topHoverTimeoutRef.current);
      } else {
        if (!topHoverTimeoutRef.current) {
          topHoverTimeoutRef.current = setTimeout(() => {
            setIsTopHovered(false);
            topHoverTimeoutRef.current = null;
          }, 1000);
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (topHoverTimeoutRef.current) clearTimeout(topHoverTimeoutRef.current);
    };
  }, [isZenMode]);

  // Escape key handler
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (isZenMode) setIsZenMode(false);
        else if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
          setIsFullscreen(false);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isZenMode]);

  // Native Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const switchRoom = (room) => {
    setSelectedRoom(room);
    setPosOffset({ x: 0, y: 0 });
  };

  const visibleRooms = useMemo(() => {
    if (activeCategory === "all") return ROOMS_DATA;
    return ROOMS_DATA.filter((r) => r.category === activeCategory);
  }, [activeCategory]);

  // ── Download Studio Snapshot ──
  const handleDownloadSnapshot = async () => {
    if (!stageRef.current) return;
    setIsDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(stageRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        logging: false,
      });
      const link = document.createElement("a");
      const cleanTitle = (selectedArtwork?.title || "Artwork").replace(/[^a-zA-Z0-9_-]/g, "_");
      link.download = `Nancy_Sikri_${cleanTitle}_${selectedRoom.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("[Snapshot] capture failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello Nancy, I am viewing your painting "${selectedArtwork?.title}" in the "${selectedRoom?.title}" with the "${selectedFrame?.name}" on your Studio Room Visualizer. I would love to inquire about pricing and acquisition details.`
  )}`;

  // Calculated painting coordinates (% of stage)
  const calcLeft = (selectedRoom.defaultPos?.x || 50) + posOffset.x;
  const calcTop = (selectedRoom.defaultPos?.y || 38) + posOffset.y;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-[#F5F0E8] select-none font-sans">
      
      {/* ── 1. FULL HEIGHT 100VH STAGE (Floor to Ceiling) ── */}
      <main className="absolute inset-0 w-full h-full overflow-hidden bg-black flex items-center justify-center z-0">
        <div
          ref={stageRef}
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          style={{
            filter: lighting.filter,
            transition: "filter 0.4s ease",
          }}
        >
          {/* Room Background Image (Full Viewport Fit) */}
          <img
            key={selectedRoom.src}
            src={selectedRoom.src}
            alt={selectedRoom.title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out pointer-events-none select-none"
            style={{ objectPosition: "center center" }}
            crossOrigin="anonymous"
          />

          {/* Ambient Lighting Overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-colors duration-400"
            style={{ backgroundColor: lighting.overlay }}
          />

          {/* ── THE PAINTING ON THE WALL ── */}
          <div
            onPointerDown={handlePointerDown}
            className={`absolute transition-transform duration-75 ease-out select-none ${
              isDragging ? "cursor-grabbing ring-2 ring-[#C9A96E]/50" : "cursor-grab"
            }`}
            style={{
              left: `${calcLeft}%`,
              top: `${calcTop}%`,
              transform: "translate(-50%, -50%)",
              width: `${scalePercent}%`,
              maxWidth: "540px",
              minWidth: "140px",
              touchAction: "none",
              zIndex: 20,
            }}
          >
            {/* Outer Frame Wrapper */}
            <div
              className="relative overflow-hidden transition-all duration-300"
              style={{
                boxShadow: selectedFrame.shadowCss,
                border: selectedFrame.borderCss,
                padding: selectedFrame.paddingCss,
                backgroundColor: selectedFrame.frameColor,
              }}
            >
              {/* Painting Canvas */}
              <div className="relative aspect-[3/4] w-full bg-[#2A2624] overflow-hidden max-h-[58vh]">
                <img
                  src={selectedArtwork?.src}
                  alt={selectedArtwork?.title || "Artwork"}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  crossOrigin="anonymous"
                  draggable={false}
                />
              </div>
            </div>

            {/* ── INTERACTIVE CORNER RESIZE HANDLE (Visible when NOT in Zen Mode) ── */}
            {!isZenMode && (
              <div
                onPointerDown={handleResizeStart}
                className="resize-handle absolute -bottom-3 -right-3 w-7 h-7 rounded-full bg-[#C9A96E] text-black shadow-2xl flex items-center justify-center cursor-nwse-resize z-30 hover:scale-125 transition-transform border-2 border-white select-none group"
                title="Drag to resize painting directly"
              >
                <FaExpand className="text-[10px] pointer-events-none" />
                <span className="absolute -top-7 right-0 opacity-0 group-hover:opacity-100 bg-black/85 text-white px-2 py-0.5 rounded text-[9px] whitespace-nowrap pointer-events-none transition-opacity">
                  Drag to Resize ({scalePercent}%)
                </span>
              </div>
            )}

            {/* Dimensions Label Badge (Visible if toggled and not in Zen mode) */}
            {showDimensions && !isZenMode && (
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[0.6rem] uppercase tracking-widest text-[#E8DDD0] font-sans pointer-events-none shadow-md">
                {selectedArtwork?.size || "36″ × 48″"} • {selectedFrame.name}
              </div>
            )}
          </div>

          {/* Reposition Drag Hint (Hidden in Zen Mode) */}
          {!isZenMode && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-75">
              <span className="px-3.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[0.62rem] uppercase tracking-widest text-white/70 border border-white/10 font-sans shadow-lg">
                Drag to move • Grab corner to resize
              </span>
            </div>
          )}

          {/* Room Label Tag (Hidden in Zen Mode) */}
          {!isZenMode && (
            <div className="absolute top-20 left-6 z-10 hidden sm:block pointer-events-none">
              <span className="text-[0.55rem] uppercase tracking-[0.25em] text-[#C9A96E] block font-semibold drop-shadow">
                Current Setting
              </span>
              <p className="font-display text-sm md:text-base text-white/90 drop-shadow-md">
                {selectedRoom.title}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ── 2. TOP FLOATING GLASS HEADER (Slides up and hides completely in Zen Mode) ── */}
      <header
        className={`absolute top-0 inset-x-0 z-30 h-16 px-4 md:px-8 bg-gradient-to-b from-black/85 via-black/50 to-transparent backdrop-blur-[2px] flex items-center justify-between transition-all duration-300 ${
          isZenMode ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        }`}
      >
        {/* Left: Exit Link & Title */}
        <div className="flex items-center gap-3 md:gap-5">
          <Link
            href={targetId ? `/artwork/${targetId}` : "/collect"}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors bg-black/40 hover:bg-black/60 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md"
          >
            <FaArrowLeft className="text-xs" />
            <span className="hidden sm:inline">Exit</span>
          </Link>
          <div className="h-4 w-px bg-white/20 hidden sm:block" />
          <div>
            <span className="text-[0.58rem] uppercase tracking-[0.25em] text-[#C9A96E] font-semibold block leading-none drop-shadow">
              Atelier Studio View
            </span>
            <h1 className="font-display text-sm md:text-base text-white tracking-wide truncate max-w-[180px] sm:max-w-xs md:max-w-md drop-shadow">
              {selectedArtwork?.title || "Original Artwork"}
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Switch Artwork */}
          <button
            onClick={() => setIsArtworkDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 text-xs tracking-wider uppercase transition-all backdrop-blur-md"
          >
            <FaImages className="text-[#C9A96E] text-xs" />
            <span className="hidden md:inline">Artwork</span>
            <span className="text-[0.65rem] opacity-60">({artworksList.length})</span>
          </button>

          {/* Reset Position */}
          {(posOffset.x !== 0 || posOffset.y !== 0) && (
            <button
              onClick={() => setPosOffset({ x: 0, y: 0 })}
              title="Reset Painting Position"
              className="p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white/80 hover:text-white transition-all text-xs backdrop-blur-md"
            >
              <FaRedoAlt />
            </button>
          )}

          {/* Browser Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
            className="p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white/80 hover:text-white transition-all text-xs backdrop-blur-md"
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>

          {/* Save Snapshot */}
          <button
            onClick={handleDownloadSnapshot}
            disabled={isDownloading}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-xs tracking-wider uppercase text-white transition-all disabled:opacity-40 backdrop-blur-md"
          >
            <FaDownload className="text-[#C9A96E] text-xs" />
            <span className="hidden sm:inline">{isDownloading ? "Saving..." : "Snapshot"}</span>
          </button>

          {/* WhatsApp Inquire */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs tracking-wider uppercase font-medium transition-all shadow-lg backdrop-blur-md"
          >
            <FaWhatsapp className="text-sm" />
            <span className="hidden md:inline">Inquire</span>
          </a>

          {/* 🌟 HIDE ALL UI / ZEN MODE BUTTON 🌟 */}
          <button
            onClick={() => setIsZenMode(true)}
            title="Hide All UI (Pure Room & Painting Only)"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C9A96E] hover:bg-[#e0be7e] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-lg ml-1"
          >
            <FaEyeSlash className="text-xs" />
            <span className="hidden sm:inline">Hide All UI</span>
          </button>
        </div>
      </header>

      {/* ── 3. HOVER-TO-REVEAL TOP BAR IN ZEN MODE ── */}
      {isZenMode && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
            isTopHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/80 backdrop-blur-2xl border border-white/20 shadow-2xl">
            <Link
              href={targetId ? `/artwork/${targetId}` : "/collect"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider transition-all"
            >
              <FaArrowLeft className="text-[10px]" />
              <span>Exit</span>
            </Link>
            <button
              onClick={() => setIsZenMode(false)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C9A96E] hover:bg-[#e0be7e] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow"
            >
              <FaEye className="text-xs" />
              <span>Restore Controls</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 4. FLOATING GLASS BOTTOM CONTROLS DOCK (Hidden when in Zen Mode) ── */}
      {!isZenMode && (
        <>
          {isControlsVisible ? (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-5xl bg-[#121110]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-3 md:p-4 shadow-2xl transition-all duration-300">
              <div className="flex flex-col gap-2.5">
                {/* Control Mode Tabs & Tag Toggle */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {[
                      { id: "rooms", label: "Rooms & Walls", icon: FaImages },
                      { id: "frames", label: "Frames", icon: FaExpand },
                      { id: "scale", label: "Size & Scale", icon: FaRulerCombined },
                      { id: "lighting", label: "Ambience", icon: FaSun },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-sans transition-all ${
                            isActive
                              ? "bg-[#C9A96E]/20 text-[#C9A96E] border border-[#C9A96E]/40"
                              : "text-white/50 hover:text-white/80 border border-transparent"
                          }`}
                        >
                          <Icon className="text-xs" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Dimension Tag Toggle */}
                    <button
                      onClick={() => setShowDimensions((v) => !v)}
                      className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] uppercase tracking-wider transition-all ${
                        showDimensions
                          ? "bg-[#C9A96E]/25 text-[#C9A96E] border border-[#C9A96E]/40"
                          : "text-white/40 hover:text-white/70 border border-white/10"
                      }`}
                    >
                      <FaCheck className={`text-[10px] ${showDimensions ? "opacity-100" : "opacity-0"}`} />
                      <span>Dimensions Tag</span>
                    </button>

                    {/* Minimize Dock Button */}
                    <button
                      onClick={() => setIsControlsVisible(false)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white text-xs"
                      title="Minimize Dock"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {/* TAB CONTENT 1: ROOMS SELECTOR */}
                {activeTab === "rooms" && (
                  <div className="space-y-2">
                    {/* Category Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
                      {ROOM_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`px-3 py-0.5 rounded-full text-[0.62rem] tracking-wider uppercase font-medium whitespace-nowrap transition-all ${
                            activeCategory === cat.id
                              ? "bg-white text-black font-semibold"
                              : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/10"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Horizontal Room Carousel */}
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                      {visibleRooms.map((room) => {
                        const isSelected = selectedRoom.id === room.id;
                        return (
                          <button
                            key={room.id}
                            onClick={() => switchRoom(room)}
                            className={`group relative flex-shrink-0 w-24 sm:w-32 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all ${
                              isSelected
                                ? "border-[#C9A96E] ring-2 ring-[#C9A96E]/30 scale-[1.02]"
                                : "border-white/10 hover:border-white/30 opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={room.src}
                              alt={room.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                              <span className="text-[0.58rem] text-white leading-tight font-sans truncate w-full text-left">
                                {room.title}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#C9A96E] text-black flex items-center justify-center text-[8px] shadow">
                                <FaCheck />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT 2: FRAMES SELECTOR */}
                {activeTab === "frames" && (
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                    {FRAME_STYLES.map((frame) => {
                      const isSelected = selectedFrame.id === frame.id;
                      return (
                        <button
                          key={frame.id}
                          onClick={() => setSelectedFrame(frame)}
                          className={`flex-shrink-0 px-3.5 py-2 rounded-xl border transition-all text-left flex items-center gap-2.5 ${
                            isSelected
                              ? "bg-[#C9A96E]/15 border-[#C9A96E] ring-1 ring-[#C9A96E]/40"
                              : "bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10"
                          }`}
                        >
                          <div
                            className="w-7 h-9 rounded border overflow-hidden flex-shrink-0"
                            style={{
                              borderColor: frame.id === "canvas" ? "rgba(255,255,255,0.2)" : frame.frameColor,
                              backgroundColor: frame.frameColor,
                              borderWidth: frame.id === "canvas" ? "1px" : "3px",
                            }}
                          >
                            <div className="w-full h-full bg-[#352F2B]" />
                          </div>
                          <div>
                            <p className="text-xs text-white font-medium">{frame.name}</p>
                            <p className="text-[0.62rem] text-white/50">{frame.subtitle}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* TAB CONTENT 3: SIZE & SCALE SELECTOR */}
                {activeTab === "scale" && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.62rem] uppercase tracking-wider text-white/40 mr-1 hidden sm:inline">
                        Presets:
                      </span>
                      {SCALE_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setScalePercent(preset.percent)}
                          className={`px-3 py-1 rounded-lg text-xs tracking-wider uppercase transition-all ${
                            Math.abs(scalePercent - preset.percent) < 3
                              ? "bg-[#C9A96E] text-black font-semibold"
                              : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-60">
                      <span className="text-[0.62rem] uppercase tracking-wider text-white/40 whitespace-nowrap">
                        Scale: {scalePercent}%
                      </span>
                      <input
                        type="range"
                        min="10"
                        max="48"
                        value={scalePercent}
                        onChange={(e) => setScalePercent(parseInt(e.target.value, 10))}
                        className="w-full accent-[#C9A96E] cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* TAB CONTENT 4: LIGHTING & AMBIENCE */}
                {activeTab === "lighting" && (
                  <div className="flex items-center gap-3 py-1">
                    {LIGHTING_MODES.map((mode) => {
                      const isSelected = lighting.id === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setLighting(mode)}
                          className={`px-4 py-2 rounded-xl border text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                            isSelected
                              ? "bg-[#C9A96E]/20 border-[#C9A96E] text-[#C9A96E]"
                              : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                          }`}
                        >
                          <FaSun className="text-xs" />
                          <span>{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Floating Pill to Restore Dock */
            <button
              onClick={() => setIsControlsVisible(true)}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-xl border border-white/20 text-white text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <FaSlidersH className="text-[#C9A96E]" />
              <span>Show Room & Frame Controls</span>
            </button>
          )}
        </>
      )}

      {/* ── 5. SWITCH ARTWORK DRAWER (Slide-Over Tray) ── */}
      {isArtworkDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex justify-end animate-fadeIn"
          onClick={() => setIsArtworkDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md h-full bg-[#161514] border-l border-white/10 flex flex-col p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <span className="text-[0.6rem] uppercase tracking-[0.25em] text-[#C9A96E] font-semibold block">
                  Nancy Sikri Atelier
                </span>
                <h3 className="font-display text-lg text-white">Select Artwork</h3>
              </div>
              <button
                onClick={() => setIsArtworkDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {artworksList.map((art) => {
                const isSelected =
                  selectedArtwork?.id?.toString() === art.id?.toString() ||
                  selectedArtwork?._id === art._id ||
                  selectedArtwork?.title === art.title;
                return (
                  <div
                    key={art._id || art.id || art.title}
                    onClick={() => {
                      setSelectedArtwork(art);
                      setIsArtworkDrawerOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex items-center gap-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#C9A96E]/15 border-[#C9A96E] ring-1 ring-[#C9A96E]/40"
                        : "bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10"
                    }`}
                  >
                    <div className="relative w-16 h-20 rounded-md overflow-hidden bg-black/40 flex-shrink-0">
                      <img
                        src={art.src}
                        alt={art.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-sm text-white truncate">
                        {art.title}
                      </h4>
                      <p className="text-[0.68rem] text-white/50 truncate mt-0.5">
                        {art.medium || "Acrylic on Canvas"}
                      </p>
                      <p className="text-[0.62rem] text-[#C9A96E] tracking-wider uppercase mt-1">
                        {art.size || "Original Size"}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#C9A96E] text-black flex items-center justify-center text-[10px]">
                        <FaCheck />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ViewOnWallPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-[#0F0E0E] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-white/50 font-sans">
              Opening Studio Room Visualizer...
            </p>
          </div>
        </div>
      }
    >
      <RoomVisualizerContent />
    </Suspense>
  );
}
