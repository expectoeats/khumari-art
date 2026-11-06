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
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaMobileAlt,
  FaSyncAlt,
  FaCamera,
  FaCloudUploadAlt,
  FaTrashAlt,
  FaRuler,
} from "react-icons/fa";

/**
 * Robustly parses artwork baseline dimensions string (e.g. "24 × 30 in", "36 x 48 in", "60 x 90 cm")
 * into numeric base width & base height in inches.
 */
function parseArtworkDimensions(sizeStr, fallbackRatio = null) {
  if (typeof sizeStr === "string") {
    const match = sizeStr.match(/(\d+(?:\.\d+)?)\s*(?:[x×*]|by)\s*(\d+(?:\.\d+)?)/i);
    if (match) {
      let w = parseFloat(match[1]);
      let h = parseFloat(match[2]);
      const isCm = /cm/i.test(sizeStr);
      if (isCm) {
        w = Math.round((w / 2.54) * 10) / 10;
        h = Math.round((h / 2.54) * 10) / 10;
      }
      return { baseW: w, baseH: h, unit: "in" };
    }
  }
  // Fallback to ratio or default 24 × 30 in
  const ratio = fallbackRatio && fallbackRatio > 0 ? fallbackRatio : 0.8;
  const baseH = 30;
  const baseW = Math.round(baseH * ratio * 10) / 10;
  return { baseW, baseH, unit: "in" };
}

function RoomVisualizerContent() {
  const searchParams = useSearchParams();
  const targetId = searchParams.get("id") || searchParams.get("artworkId") || "";

  // ── Mobile Device & Orientation Detection ──
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [dismissPortraitWarning, setDismissPortraitWarning] = useState(false);

  useEffect(() => {
    const handleViewportChange = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      const height = window.innerHeight;

      const hasTouch =
        navigator.maxTouchPoints > 0 ||
        (typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches) ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || "");

      // Landscape phone mode:
      // Mobile phones held horizontally strictly have height <= 560px and width > height.
      // Flagship phones like iPhone 14/15/16 Pro Max (~932x430) and Galaxy S24 Ultra (~915x412) are accounted for.
      const isLandscapePhone = height <= 560 && width > height && (hasTouch || width < 1100);

      // Mobile device: width < 850, landscape phone, or touch device under 1024px
      const mobile = width < 850 || isLandscapePhone || (hasTouch && width < 1024);

      setIsMobile(mobile);
      // Portrait mode check on mobile devices
      setIsPortrait(mobile && height > width);
    };

    handleViewportChange();
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("orientationchange", handleViewportChange);
    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
    };
  }, []);

  const isLandscapeMobile = isMobile && !isPortrait;

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

  // Natural Aspect Ratio of the active painting (prevents any stretching/distortion)
  const [artworkAspectRatio, setArtworkAspectRatio] = useState(null);

  useEffect(() => {
    setArtworkAspectRatio(null);
  }, [selectedArtwork]);

  const handleArtworkImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      setArtworkAspectRatio(naturalWidth / naturalHeight);
    }
  };

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

  // ── Custom User Wall Upload State ──
  const [customWallUrl, setCustomWallUrl] = useState(null);
  const [customWallName, setCustomWallName] = useState("My Room Wall");
  const fileInputRef = useRef(null);

  // Clean up Object URL on unmount or replace
  useEffect(() => {
    return () => {
      if (customWallUrl) {
        try {
          URL.revokeObjectURL(customWallUrl);
        } catch (_) {}
      }
    };
  }, [customWallUrl]);

  const handleCustomWallUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (customWallUrl) {
      try {
        URL.revokeObjectURL(customWallUrl);
      } catch (_) {}
    }

    const url = URL.createObjectURL(file);
    const fileName = file.name ? file.name.replace(/\.[^/.]+$/, "") : "My Room Wall";
    setCustomWallUrl(url);
    setCustomWallName(fileName);

    const customRoom = {
      id: "custom-user-wall",
      title: fileName || "Your Wall Photo",
      category: "custom",
      src: url,
      defaultPos: { x: 50, y: 38 },
      isCustom: true,
    };
    setSelectedRoom(customRoom);
    setPosOffset({ x: 0, y: 0 });
    if (isMobile) setIsMobileSheetOpen(false);

    // Reset input value so re-selecting same file works
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveCustomWall = (e) => {
    e?.stopPropagation?.();
    if (customWallUrl) {
      try {
        URL.revokeObjectURL(customWallUrl);
      } catch (_) {}
    }
    setCustomWallUrl(null);
    setSelectedRoom(ROOMS_DATA[0]);
    setPosOffset({ x: 0, y: 0 });
  };

  // ── Visualizer State ──
  const [selectedRoom, setSelectedRoom] = useState(ROOMS_DATA[0]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedFrame, setSelectedFrame] = useState(FRAME_STYLES[0]);
  const [scalePercent, setScalePercent] = useState(22); // Desktop scale percentage (baseline = 22)
  const [mobileScale, setMobileScale] = useState(48); // Mobile portrait scale percentage (baseline = 48)
  const [landscapeScale, setLandscapeScale] = useState(14); // Mobile landscape scale percentage (baseline = 14)
  const [posOffset, setPosOffset] = useState({ x: 0, y: 0 }); // offset from defaultPos
  const [showDimensions, setShowDimensions] = useState(false);
  const [lighting, setLighting] = useState(LIGHTING_MODES[0]);
  const [isArtworkDrawerOpen, setIsArtworkDrawerOpen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false); // TRUE HIDE: only room and painting
  const [zenControlsVisible, setZenControlsVisible] = useState(false);
  const zenHideTimerRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("rooms"); // "rooms" | "frames" | "scale" | "lighting"

  // ── Dynamic Mathematically Accurate Dimensions Calculation ──
  const baseDims = useMemo(() => {
    return parseArtworkDimensions(selectedArtwork?.size, artworkAspectRatio);
  }, [selectedArtwork?.size, artworkAspectRatio]);

  const liveDimensions = useMemo(() => {
    const baseScale = isMobile ? (isLandscapeMobile ? 14 : 48) : 22;
    const currentScale = isMobile ? (isLandscapeMobile ? landscapeScale : mobileScale) : scalePercent;
    const multiplier = currentScale / baseScale;

    const widthIn = Math.round(baseDims.baseW * multiplier * 10) / 10;
    const heightIn = Math.round(baseDims.baseH * multiplier * 10) / 10;
    const widthCm = Math.round(widthIn * 2.54);
    const heightCm = Math.round(heightIn * 2.54);

    const isOriginal = Math.abs(multiplier - 1.0) < 0.04;

    return {
      widthIn,
      heightIn,
      widthCm,
      heightCm,
      multiplier,
      isOriginal,
      displayIn: `${widthIn}″ × ${heightIn}″`,
      displayCm: `${widthCm} × ${heightCm} cm`,
    };
  }, [baseDims, isMobile, isLandscapeMobile, landscapeScale, mobileScale, scalePercent]);

  const { content } = useSiteContent();
  const rawWhatsApp =
    content?.contact?.whatsappNumber ||
    content?.announcement?.whatsappNumber ||
    "919818817291";
  const whatsappNumber = rawWhatsApp.replace(/[^0-9]/g, "");

  // Stage reference for snapshot
  const stageRef = useRef(null);
  const roomsScrollRef = useRef(null);

  const scrollRooms = (direction) => {
    if (roomsScrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      roomsScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // ── 1. Painting Drag & Reposition Logic ──
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ clientX: 0, clientY: 0, startPos: { x: 0, y: 0 } });

  const handlePointerDown = (e) => {
    if (e.target.closest(".resize-handle")) return;
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

  // ── 2. Interactive Direct Painting Resize Logic (Corner Handle) ──
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ clientX: 0, startScale: 22 });

  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    resizeStartRef.current = {
      clientX,
      startScale: isMobile
        ? (isLandscapeMobile ? landscapeScale : mobileScale)
        : scalePercent,
    };
  };

  const handleResizeMove = (e) => {
    if (!isResizing) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - resizeStartRef.current.clientX;
    const rect = stageRef.current ? stageRef.current.getBoundingClientRect() : { width: 1000 };
    const pctChange = (deltaX / rect.width) * 100;

    if (isMobile) {
      if (isLandscapeMobile) {
        // Landscape mobile: smoothly resize between 7% and 26%
        const newScale = Math.max(7, Math.min(26, resizeStartRef.current.startScale + pctChange * 1.1));
        setLandscapeScale(Math.round(newScale * 10) / 10);
      } else {
        // Portrait mobile: resize between 24% and 76%
        const newScale = Math.max(24, Math.min(76, resizeStartRef.current.startScale + pctChange * 1.5));
        setMobileScale(Math.round(newScale));
      }
    } else {
      const newScale = Math.max(10, Math.min(48, resizeStartRef.current.startScale + pctChange));
      setScalePercent(Math.round(newScale));
    }
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
  }, [isResizing, isMobile, isLandscapeMobile]);

  // ── 3. Zen Mode Auto-hide & Screen Tap Logic ──
  useEffect(() => {
    if (isZenMode) {
      setZenControlsVisible(true);
      if (zenHideTimerRef.current) clearTimeout(zenHideTimerRef.current);
      zenHideTimerRef.current = setTimeout(() => {
        setZenControlsVisible(false);
      }, 1000); // Auto-hide in 1 second
    } else {
      setZenControlsVisible(false);
      if (zenHideTimerRef.current) clearTimeout(zenHideTimerRef.current);
    }
    return () => {
      if (zenHideTimerRef.current) clearTimeout(zenHideTimerRef.current);
    };
  }, [isZenMode]);

  // Screen click handler for Zen Mode: click reveals button for 1s; click again/outside hides immediately
  const handleZenScreenClick = () => {
    if (!isZenMode) return;
    if (isDragging || isResizing) return;

    if (zenControlsVisible) {
      // User tapped screen while visible -> immediately hide so only room & painting are visible
      if (zenHideTimerRef.current) clearTimeout(zenHideTimerRef.current);
      setZenControlsVisible(false);
    } else {
      // User tapped screen while hidden -> reveal top-right controls and auto-hide in 1s
      setZenControlsVisible(true);
      if (zenHideTimerRef.current) clearTimeout(zenHideTimerRef.current);
      zenHideTimerRef.current = setTimeout(() => {
        setZenControlsVisible(false);
      }, 1000);
    }
  };

  useEffect(() => {
    // Only listen for mousemove on desktop pointer devices without touch
    if (isMobile) return;
    const hasTouch = typeof window !== "undefined" && (navigator.maxTouchPoints > 0 || ("ontouchstart" in window));
    if (hasTouch) return;

    const onMouseMove = (e) => {
      if (!isZenMode) return;
      if (e.clientY < 60) {
        setZenControlsVisible(true);
        if (zenHideTimerRef.current) clearTimeout(zenHideTimerRef.current);
      } else if (zenControlsVisible && !zenHideTimerRef.current) {
        zenHideTimerRef.current = setTimeout(() => {
          setZenControlsVisible(false);
          zenHideTimerRef.current = null;
        }, 1000);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [isZenMode, zenControlsVisible, isMobile]);

  // Escape key handler
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (isMobileSheetOpen) setIsMobileSheetOpen(false);
        else if (isZenMode) setIsZenMode(false);
        else if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
          setIsFullscreen(false);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isZenMode, isMobileSheetOpen]);

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
    if (isMobile) setIsMobileSheetOpen(false);
  };

  const visibleRooms = useMemo(() => {
    if (activeCategory === "all") return ROOMS_DATA;
    return ROOMS_DATA.filter((r) => r.category === activeCategory);
  }, [activeCategory]);

  // ── 4. Clean Studio Snapshot Download (ONLY Room & Painting, ZERO text) ──
  const handleDownloadSnapshot = async () => {
    if (!stageRef.current) return;
    setIsDownloading(true);
    // Wait for React to re-render so all text, badges, and handles are completely hidden
    await new Promise((resolve) => setTimeout(resolve, 80));
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(stageRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2, // 2x crisp studio resolution
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

  // WhatsApp inquiry URL pre-filling accurate live dimensions
  const customSizeNote = liveDimensions.isOriginal
    ? `in its original size (${liveDimensions.displayIn} / ${liveDimensions.displayCm})`
    : `customized to ${liveDimensions.displayIn} (${liveDimensions.displayCm})`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello Nancy, I am viewing your painting "${selectedArtwork?.title}" in the "${selectedRoom?.title}" with "${selectedFrame?.name}" on your Studio Room Visualizer.

I have customized the size to ${customSizeNote}.

Please share pricing and commissioning timeline for this specification.`
  )}`;

  // Calculated painting coordinates (% of stage)
  const calcLeft = (selectedRoom.defaultPos?.x || 50) + posOffset.x;
  const defaultBaseY = isMobile
    ? (isLandscapeMobile
        ? (selectedRoom.defaultPos?.y || 38) - 2   // landscape: slightly higher (room visible)
        : (selectedRoom.defaultPos?.y || 36) - 3)  // portrait: shifted up
    : (selectedRoom.defaultPos?.y || 38);
  const calcTop = defaultBaseY + posOffset.y;
  const currentRenderScale = isMobile
    ? (isLandscapeMobile ? landscapeScale : mobileScale)
    : scalePercent;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-[#F5F0E8] select-none font-sans">
      {/* Hidden File Input for Custom Room Wall Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleCustomWallUpload}
        className="hidden"
      />

      {/* ── PORTRAIT ORIENTATION SOFT HINT (Non-blocking overlay, 3-second auto-fade) ── */}
      {isPortrait && !dismissPortraitWarning && (
        <div
          className="fixed inset-0 z-[100] bg-[#0F0E0E]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-fadeIn select-none"
          onClick={() => setDismissPortraitWarning(true)}
        >
          {/* Phone rotation graphic */}
          <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#C9A96E]/15 animate-[ping_3s_ease-in-out_infinite]" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1A1816] to-[#2A2624] border border-[#C9A96E]/35 flex items-center justify-center shadow-[0_0_30px_rgba(201,169,110,0.12)]">
              <FaSyncAlt className="text-2xl text-[#C9A96E] animate-[spin_6s_linear_infinite]" />
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C9A96E] font-bold block">
              Better in Landscape
            </span>
            <h2 className="font-display text-xl text-white leading-tight">
              Rotate for Immersive View
            </h2>
            <p className="text-[0.68rem] text-white/45 max-w-[240px] mx-auto leading-relaxed font-sans font-light">
              Landscape mode gives you a fuller studio experience — but you can continue in portrait too.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 w-full max-w-[220px]">
            <button
              onClick={() => setDismissPortraitWarning(true)}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#C9A96E] to-[#D4B67D] text-black font-bold text-[0.7rem] uppercase tracking-widest shadow-[0_8px_20px_rgba(201,169,110,0.28)] active:scale-95 transition-transform"
            >
              Continue in Portrait
            </button>
            <p className="text-[0.58rem] text-white/25 uppercase tracking-widest">or rotate your device</p>
          </div>
        </div>
      )}

      {/* ── 1. FULL HEIGHT 100VH STAGE (Floor to Ceiling) ── */}
      <main
        className="absolute inset-0 w-full h-full overflow-hidden bg-black flex items-center justify-center z-0 cursor-default"
        onClick={handleZenScreenClick}
      >
        <div
          ref={stageRef}
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          style={{
            filter: lighting.filter,
            transition: "filter 0.4s ease",
          }}
        >
          {/* Room Background Image */}
          <img
            key={selectedRoom.src}
            src={selectedRoom.src}
            alt={selectedRoom.title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out pointer-events-none select-none"
            style={{
              objectPosition: isPortrait ? "center 42%" : "center 40%",
            }}
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
            onClick={(e) => e.stopPropagation()}
            className={`absolute transition-transform duration-75 ease-out select-none ${
              isDragging ? "cursor-grabbing ring-2 ring-[#C9A96E]/50" : "cursor-grab"
            }`}
            style={{
              left: `${calcLeft}%`,
              top: `${calcTop}%`,
              transform: "translate(-50%, -50%)",
              width: `${currentRenderScale}%`,
              aspectRatio: artworkAspectRatio ? String(artworkAspectRatio) : undefined,
              maxWidth: isMobile ? (isLandscapeMobile ? "32vw" : "80vw") : "540px",
              minWidth: isMobile ? (isLandscapeMobile ? "55px" : "90px") : "140px",
              touchAction: "none",
              zIndex: 20,
            }}
          >
            {/* Outer Frame Wrapper */}
            <div
              className="relative overflow-hidden transition-all duration-300 w-full h-full flex items-center justify-center"
              style={{
                boxShadow: selectedFrame.shadowCss,
                border: isMobile && selectedFrame.id !== "canvas"
                  ? (isLandscapeMobile ? "3px solid " : "5px solid ") + selectedFrame.frameColor
                  : selectedFrame.borderCss,
                padding: isMobile && selectedFrame.id !== "canvas" ? "1px" : selectedFrame.paddingCss,
                backgroundColor: selectedFrame.frameColor,
              }}
            >
              {/* Painting img — fills 100% of the frame with zero empty space on left or right */}
              <img
                src={selectedArtwork?.src}
                alt={selectedArtwork?.title || "Artwork"}
                onLoad={handleArtworkImageLoad}
                className="w-full h-full object-cover select-none pointer-events-none block"
                crossOrigin="anonymous"
                draggable={false}
              />
            </div>

            {/* Corner Resize Handle (Hidden in Zen Mode AND during Snapshot capture) */}
            {!isZenMode && !isDownloading && (
              <div
                onPointerDown={handleResizeStart}
                className={`resize-handle absolute ${
                  isLandscapeMobile
                    ? "-bottom-2.5 -right-2.5 w-6 h-6"
                    : "-bottom-3.5 -right-3.5 sm:-bottom-3 sm:-right-3 w-8 sm:w-7 h-8 sm:h-7"
                } rounded-full bg-[#C9A96E] text-black shadow-2xl flex items-center justify-center cursor-nwse-resize z-30 hover:scale-125 active:scale-110 transition-transform border-2 border-white select-none touch-manipulation group`}
                title="Drag corner to scale painting"
              >
                <FaExpand className={isLandscapeMobile ? "text-[8px] pointer-events-none" : "text-[10px] pointer-events-none"} />
                <span className="hidden sm:block absolute -top-7 right-0 opacity-0 group-hover:opacity-100 bg-black/90 text-[#F5F0E8] px-2 py-0.5 rounded text-[9px] whitespace-nowrap pointer-events-none transition-opacity font-mono border border-white/10">
                  {liveDimensions.displayIn} ({liveDimensions.displayCm})
                </span>
              </div>
            )}

            {/* ── ACCURATE DYNAMIC DIMENSIONS BADGE ── */}
            {/* Visible whenever showDimensions is toggled ON or actively dragging/resizing, stripped during snapshot download & Zen mode */}
            {(showDimensions || isResizing) && !isZenMode && !isDownloading && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#C9A96E]/50 text-[0.6rem] sm:text-[0.65rem] text-[#F5F0E8] font-sans pointer-events-none shadow-xl flex items-center gap-1.5 animate-fadeIn z-30">
                <span className="text-[#C9A96E] font-medium tracking-wide">
                  {liveDimensions.displayIn}
                </span>
                <span className="text-white/30">|</span>
                <span className="text-white/70">
                  {liveDimensions.displayCm}
                </span>
                {liveDimensions.isOriginal ? (
                  <span className="ml-1 text-[0.52rem] px-1.5 py-0.5 rounded bg-white/15 text-white/90 font-semibold tracking-wider uppercase">
                    Original
                  </span>
                ) : (
                  <span className="ml-1 text-[0.52rem] px-1.5 py-0.5 rounded bg-[#C9A96E]/30 text-[#C9A96E] font-semibold tracking-wider uppercase">
                    Custom
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Reposition Drag Hint (Hidden in Zen Mode AND during Snapshot capture) */}
          {!isZenMode && !isDownloading && (
            <div className={`absolute z-10 pointer-events-none opacity-75 left-1/2 -translate-x-1/2 ${isMobile ? "top-14" : "top-16 sm:top-20"}`}>
              <span className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md text-[0.55rem] sm:text-[0.62rem] uppercase tracking-widest text-white/65 border border-white/10 font-sans shadow-lg whitespace-nowrap">
                {isMobile ? "Drag • Corner to scale" : "Drag to move • Grab corner to scale"}
              </span>
            </div>
          )}

          {/* Room Label Tag (Hidden in Zen Mode AND during Snapshot capture) */}
          {!isZenMode && !isDownloading && (
            <div className="absolute top-20 left-6 z-10 hidden md:block pointer-events-none">
              <span className="text-[0.55rem] uppercase tracking-[0.25em] text-[#C9A96E] block font-semibold drop-shadow">
                {selectedRoom.isCustom ? "Your Custom Wall" : "Current Setting"}
              </span>
              <p className="font-display text-sm md:text-base text-white/90 drop-shadow-md">
                {selectedRoom.title}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ── 2. TOP FLOATING GLASS HEADER ── */}
      <header
        className={`absolute top-0 inset-x-0 z-30 transition-all duration-300 ${
          isMobile
            ? `px-3 ${isLandscapeMobile ? "py-1 bg-black/50" : "py-2 bg-gradient-to-b from-black/88 via-black/55 to-transparent"}`
            : "px-6 md:px-8 py-3.5 bg-gradient-to-b from-black/85 via-black/50 to-transparent"
        } backdrop-blur-sm ${
          isZenMode ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        }`}
        style={{
          paddingTop: isMobile ? `max(${isLandscapeMobile ? "0.35rem" : "0.55rem"}, env(safe-area-inset-top))` : undefined,
          paddingLeft: isMobile ? "max(0.75rem, env(safe-area-inset-left))" : undefined,
          paddingRight: isMobile ? "max(0.75rem, env(safe-area-inset-right))" : undefined,
        }}
      >
        {/* ── MOBILE HEADER: state-driven, landscape-optimized, no overflow ── */}
        {isMobile ? (
          <div className="flex items-center w-full gap-2 min-w-0">
            {/* Left: Back + Artwork title pill */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Link
                href={targetId ? `/artwork/${targetId}` : "/collect"}
                className={`flex-shrink-0 ${isLandscapeMobile ? "w-9 h-9" : "w-9 h-9"} rounded-full bg-black/65 border border-white/20 flex items-center justify-center text-white/90 active:scale-95`}
                title="Exit"
              >
                <FaArrowLeft className="text-[13px]" />
              </Link>

              {/* Artwork title pill — never overflows */}
              <button
                onClick={() => setIsArtworkDrawerOpen(true)}
                className={`flex items-center gap-1.5 px-3 rounded-full bg-black/65 border border-white/20 active:scale-95 min-w-0 overflow-hidden ${isLandscapeMobile ? "py-1.5 max-w-[160px]" : "py-2 max-w-[145px]"}`}
              >
                <span className={`truncate font-medium text-white/90 leading-none ${isLandscapeMobile ? "text-[0.65rem]" : "text-[0.65rem]"}`}>
                  {selectedArtwork?.title || "Select Artwork"}
                </span>
                <FaChevronDown className="text-[8px] text-[#C9A96E] flex-shrink-0" />
              </button>
            </div>

            {/* Right: icon buttons — bigger tap targets in landscape */}
            <div className={`flex items-center flex-shrink-0 ${isLandscapeMobile ? "gap-2" : "gap-1.5"}`}>
              {/* Upload Wall */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`flex-shrink-0 w-9 h-9 rounded-full bg-black/65 border border-[#C9A96E]/50 flex items-center justify-center text-[#C9A96E] active:scale-95`}
                title="Upload Wall Photo"
              >
                <FaCamera className="text-[13px]" />
              </button>

              {/* Snapshot */}
              <button
                onClick={handleDownloadSnapshot}
                disabled={isDownloading}
                className={`flex-shrink-0 w-9 h-9 rounded-full bg-black/65 border border-white/20 flex items-center justify-center text-[#C9A96E] active:scale-95 disabled:opacity-40`}
                title="Download Snapshot"
              >
                <FaDownload className="text-[13px]" />
              </button>

              {/* Fullscreen — landscape mein especially important */}
              <button
                onClick={toggleFullscreen}
                className={`flex-shrink-0 w-9 h-9 rounded-full bg-black/65 border border-white/20 flex items-center justify-center text-white/80 active:scale-95`}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <FaCompress className="text-[13px]" /> : <FaExpand className="text-[13px]" />}
              </button>

              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-shrink-0 w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-md active:scale-95`}
                title="Inquire on WhatsApp"
              >
                <FaWhatsapp className="text-[14px]" />
              </a>

              {/* Zen Mode */}
              <button
                onClick={() => setIsZenMode(true)}
                className={`flex-shrink-0 w-9 h-9 rounded-full bg-[#C9A96E] flex items-center justify-center text-black active:scale-95 shadow`}
                title="Focus Mode"
              >
                <FaEyeSlash className="text-[13px]" />
              </button>
            </div>
          </div>
        ) : (
          /* ── DESKTOP HEADER ── */
          <div className="flex items-center justify-between w-full">
            {/* Left: Exit Link & Title */}
            <div className="flex items-center gap-4">
              <Link
                href={targetId ? `/artwork/${targetId}` : "/collect"}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors bg-black/40 hover:bg-black/60 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md"
              >
                <FaArrowLeft className="text-xs" />
                <span>Exit</span>
              </Link>
              <div className="h-4 w-px bg-white/20" />
              <div>
                <span className="text-[0.58rem] uppercase tracking-[0.25em] text-[#C9A96E] font-semibold block leading-none drop-shadow">
                  Atelier Studio View
                </span>
                <h1 className="font-display text-sm md:text-base text-white tracking-wide truncate max-w-sm md:max-w-md drop-shadow">
                  {selectedArtwork?.title || "Original Artwork"}
                </h1>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsArtworkDrawerOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 text-xs tracking-wider uppercase transition-all backdrop-blur-md"
              >
                <FaImages className="text-[#C9A96E] text-xs" />
                <span>Artwork</span>
                <span className="text-[0.65rem] opacity-60">({artworksList.length})</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/75 border border-[#C9A96E]/40 text-xs tracking-wider uppercase text-[#C9A96E] transition-all backdrop-blur-md"
                title="Upload your own wall photo"
              >
                <FaCamera className="text-xs" />
                <span>{customWallUrl ? "My Wall" : "Upload Wall"}</span>
              </button>

              {(posOffset.x !== 0 || posOffset.y !== 0) && (
                <button
                  onClick={() => setPosOffset({ x: 0, y: 0 })}
                  title="Reset Painting Position"
                  className="p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white/80 hover:text-white transition-all text-xs backdrop-blur-md"
                >
                  <FaRedoAlt />
                </button>
              )}

              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
                className="p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white/80 hover:text-white transition-all text-xs backdrop-blur-md"
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>

              <button
                onClick={handleDownloadSnapshot}
                disabled={isDownloading}
                title="Download Room & Painting"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-xs tracking-wider uppercase text-white transition-all disabled:opacity-40 backdrop-blur-md"
              >
                <FaDownload className="text-[#C9A96E] text-xs" />
                <span>{isDownloading ? "Saving..." : "Snapshot"}</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs tracking-wider uppercase font-medium transition-all shadow-lg backdrop-blur-md"
              >
                <FaWhatsapp className="text-sm" />
                <span>Inquire</span>
              </a>

              <button
                onClick={() => setIsZenMode(true)}
                title="Hide All UI (Pure Room & Painting Only)"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C9A96E] hover:bg-[#e0be7e] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-lg ml-1"
              >
                <FaEyeSlash className="text-xs" />
                <span>Hide All UI</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── 3. TOP-RIGHT CORNER CONTROLS IN ZEN MODE (Auto-hides in 1s, tap screen to reveal) ── */}
      {isZenMode && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`fixed z-50 transition-all duration-300 ${
            zenControlsVisible
              ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
              : "opacity-0 scale-95 pointer-events-none -translate-y-3"
          }`}
          style={{
            top: "max(0.75rem, env(safe-area-inset-top, 0.75rem))",
            right: "max(1rem, env(safe-area-inset-right, 1rem))",
            left: "auto",
          }}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-full bg-black/90 backdrop-blur-2xl border border-white/20 shadow-2xl">
            <Link
              href={targetId ? `/artwork/${targetId}` : "/collect"}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[0.65rem] uppercase tracking-wider transition-all active:scale-95"
            >
              <FaArrowLeft className="text-[9px]" />
              <span>Exit</span>
            </Link>
            <button
              onClick={() => {
                setIsZenMode(false);
                setZenControlsVisible(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A96E] hover:bg-[#e0be7e] text-black font-semibold text-[0.65rem] uppercase tracking-wider transition-all shadow active:scale-95"
            >
              <FaEye className="text-xs" />
              <span>Show Controls</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 4. MOBILE BOTTOM FLOATING DOCK & SLIDE-UP SHEET (state-driven, not CSS breakpoints) ── */}
      {!isZenMode && isMobile && (
        <>
          {/* Mobile Floating Tab Dock — centered, safe-area-aware, no overflow */}
          <div
            className="fixed left-0 right-0 z-30 flex justify-center"
            style={{
              bottom: `max(${isLandscapeMobile ? "0.5rem" : "1rem"}, env(safe-area-inset-bottom))`,
              paddingLeft: isLandscapeMobile ? "max(0.5rem, env(safe-area-inset-left))" : undefined,
              paddingRight: isLandscapeMobile ? "max(0.5rem, env(safe-area-inset-right))" : undefined,
            }}
          >
            <div className={`bg-[#141312]/96 backdrop-blur-2xl border border-white/15 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center gap-0.5 ${isLandscapeMobile ? "px-1 py-1" : "px-1.5 py-1.5"}`}>
              {[
                { id: "rooms", label: "Rooms", icon: FaImages },
                { id: "frames", label: "Frames", icon: FaExpand },
                { id: "scale", label: "Size", icon: FaRulerCombined },
                { id: "lighting", label: "Light", icon: FaSun },
              ].map((btn) => {
                const Icon = btn.icon;
                const isActive = isMobileSheetOpen && activeTab === btn.id;
                return (
                  <button
                    key={btn.id}
                    onClick={() => {
                      setActiveTab(btn.id);
                      setIsMobileSheetOpen(true);
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-full transition-all active:scale-90 ${
                      isLandscapeMobile
                        ? "flex-row px-3.5 py-1.5 text-[0.58rem]"
                        : "flex-col px-4 py-2 text-[0.55rem]"
                    } ${
                      isActive
                        ? "bg-gradient-to-r from-[#C9A96E] to-[#D4B67D] text-black shadow-[0_0_15px_rgba(201,169,110,0.4)]"
                        : "text-white/55 hover:text-white"
                    }`}
                  >
                    <Icon className={isActive ? "text-[11px]" : "text-[10px]"} />
                    <span className="uppercase tracking-[0.1em] font-bold leading-none">{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Slide-Up Bottom Sheet Drawer */}
          {isMobileSheetOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fadeIn"
              onClick={() => setIsMobileSheetOpen(false)}
            >
              <div
                className={`w-full bg-[#161514] border-t border-white/20 rounded-t-2xl shadow-2xl overflow-y-auto flex flex-col ${
                  isLandscapeMobile ? "max-h-[72vh] p-3" : "max-h-[60vh] p-4"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Pull Down Handle */}
                <div className="w-8 h-1 bg-white/25 rounded-full mx-auto mb-2" />

                {/* Sheet Header */}
                <div className={`flex items-center justify-between border-b border-white/10 ${isLandscapeMobile ? "pb-2 mb-2" : "pb-3 mb-3"}`}>
                  <span className="text-[0.62rem] uppercase tracking-[0.2em] text-[#C9A96E] font-semibold">
                    {activeTab === "rooms" && "Select Room"}
                    {activeTab === "frames" && "Frame Finish"}
                    {activeTab === "scale" && "Dimensions & Scale"}
                    {activeTab === "lighting" && "Room Ambience"}
                  </span>
                  <button
                    onClick={() => setIsMobileSheetOpen(false)}
                    className="w-6 h-6 rounded-full bg-white/10 text-white/70 flex items-center justify-center text-[10px]"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* SHEET CONTENT: ROOMS */}
                {activeTab === "rooms" && (
                  <div className={`space-y-2 pb-1 ${isLandscapeMobile ? "" : ""}`}>
                    {/* Upload Wall Button */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-1 rounded-xl bg-[#C9A96E] text-black border border-[#F3E2B8] flex items-center justify-center gap-2 font-bold tracking-wider uppercase active:scale-98 transition-all shadow ${isLandscapeMobile ? "py-2 px-3 text-[0.6rem]" : "py-2.5 px-3 text-xs"}`}
                      >
                        <FaCamera className="text-black" />
                        <span>{customWallUrl ? "Change Wall Photo" : "Upload Your Wall Photo"}</span>
                      </button>
                      {customWallUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveCustomWall}
                          className="p-2 rounded-xl bg-red-600/30 border border-red-500/50 text-red-200 text-xs flex-shrink-0"
                        >
                          <FaTrashAlt />
                        </button>
                      )}
                    </div>

                    {/* Category Pills */}
                    <div
                      className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
                      style={{ scrollbarWidth: "none" }}
                    >
                      {ROOM_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`px-2.5 py-0.5 rounded-full text-[0.58rem] tracking-wider uppercase font-semibold whitespace-nowrap transition-all ${
                            activeCategory === cat.id
                              ? "bg-white text-black"
                              : "bg-[#262422] text-[#E8DDD0] border border-white/20"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Room Cards — landscape: 3-col, portrait: 2-col; compact sizes */}
                    <div
                      className={`grid gap-2 overflow-y-auto no-scrollbar ${
                        isLandscapeMobile
                          ? "grid-cols-3 max-h-[38vh]"
                          : "grid-cols-2 max-h-[34vh]"
                      }`}
                      style={{ scrollbarWidth: "none" }}
                    >
                      {customWallUrl && (
                        <div
                          onClick={() => {
                            setSelectedRoom({
                              id: "custom-user-wall",
                              title: customWallName || "Your Wall Photo",
                              category: "custom",
                              src: customWallUrl,
                              defaultPos: { x: 50, y: 38 },
                              isCustom: true,
                            });
                            setPosOffset({ x: 0, y: 0 });
                            setIsMobileSheetOpen(false);
                          }}
                          className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 cursor-pointer ${
                            selectedRoom.id === "custom-user-wall"
                              ? "border-[#C9A96E] ring-1 ring-[#C9A96E]/40"
                              : "border-white/15"
                          }`}
                        >
                          <img src={customWallUrl} alt="Your Wall" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1.5">
                            <span className="text-[0.55rem] text-[#C9A96E] font-semibold truncate w-full">★ My Wall</span>
                          </div>
                          {selectedRoom.id === "custom-user-wall" && (
                            <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#C9A96E] text-black flex items-center justify-center text-[8px]">
                              <FaCheck />
                            </div>
                          )}
                        </div>
                      )}

                      {visibleRooms.map((room) => {
                        const isSelected = selectedRoom.id === room.id;
                        return (
                          <div
                            key={room.id}
                            onClick={() => switchRoom(room)}
                            className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                              isSelected
                                ? "border-[#C9A96E] ring-1 ring-[#C9A96E]/40"
                                : "border-white/15"
                            }`}
                          >
                            <img src={room.src} alt={room.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1.5">
                              <span className="text-[0.55rem] text-white truncate w-full leading-tight">{room.title}</span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#C9A96E] text-black flex items-center justify-center text-[8px]">
                                <FaCheck />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SHEET CONTENT: FRAMES */}
                {activeTab === "frames" && (
                  <div className={`space-y-2 pb-2 overflow-y-auto ${isLandscapeMobile ? "max-h-[45vh]" : "max-h-[38vh]"}`}>
                    {FRAME_STYLES.map((frame) => {
                      const isSelected = selectedFrame.id === frame.id;
                      return (
                        <div
                          key={frame.id}
                          onClick={() => {
                            setSelectedFrame(frame);
                            setIsMobileSheetOpen(false);
                          }}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#C9A96E]/20 border-[#C9A96E]"
                              : "bg-white/5 border-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-3">
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
                          </div>
                          {isSelected && <FaCheck className="text-[#C9A96E] text-xs" />}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* SHEET CONTENT: SIZE & DYNAMIC DIMENSIONS */}
                {activeTab === "scale" && (
                  <div className={`space-y-2.5 py-1 overflow-y-auto ${isLandscapeMobile ? "max-h-[50vh]" : ""}`}>
                    {/* Live Accurate Dimensions Card */}
                    <div className="bg-[#1C1A18] border border-[#C9A96E]/30 rounded-2xl p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[0.6rem] uppercase tracking-widest text-[#C9A96E] font-semibold flex items-center gap-1.5">
                          <FaRuler className="text-xs" />
                          <span>Exact Scaled Dimensions</span>
                        </span>
                        {liveDimensions.isOriginal ? (
                          <span className="text-[0.55rem] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-semibold tracking-wider uppercase">
                            Original Size
                          </span>
                        ) : (
                          <span className="text-[0.55rem] px-2 py-0.5 rounded-full bg-[#C9A96E]/20 text-[#C9A96E] font-semibold tracking-wider uppercase">
                            Custom Scaled
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline justify-between pt-1">
                        <div>
                          <span className="font-display text-base sm:text-lg text-white font-medium tracking-wide">
                            {liveDimensions.displayIn}
                          </span>
                          <span className="text-xs text-white/50 ml-2 font-mono">
                            ({liveDimensions.displayCm})
                          </span>
                        </div>
                        {!liveDimensions.isOriginal && (
                          <button
                            onClick={() => {
                              if (isLandscapeMobile) setLandscapeScale(14);
                              else setMobileScale(48);
                            }}
                            className="text-[0.62rem] text-[#C9A96E] underline uppercase tracking-wider"
                          >
                            Reset Original
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Dimension Tag Toggle */}
                    <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <div>
                        <p className="text-xs text-white font-medium">Show Dimensions Badge</p>
                        <p className="text-[0.6rem] text-white/50">Keep size badge visible under painting</p>
                      </div>
                      <button
                        onClick={() => setShowDimensions((v) => !v)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${
                          showDimensions ? "bg-[#C9A96E]" : "bg-white/20"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                            showDimensions ? "translate-x-5 bg-black" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Proportional Scale Presets */}
                    <div className="grid grid-cols-2 gap-2">
                      {(isLandscapeMobile
                        ? [
                            { label: "Original (100%)", val: 14 },
                            { label: "Compact (-25%)", val: 10.5 },
                            { label: "Statement (+25%)", val: 17.5 },
                            { label: "Grand (+50%)", val: 21 },
                          ]
                        : [
                            { label: "Original (100%)", val: 48 },
                            { label: "Compact (-25%)", val: 36 },
                            { label: "Statement (+25%)", val: 60 },
                            { label: "Grand Mural (+50%)", val: 72 },
                          ]
                      ).map((preset) => {
                        const currentVal = isLandscapeMobile ? landscapeScale : mobileScale;
                        const isSelected = Math.abs(currentVal - preset.val) < (isLandscapeMobile ? 1.5 : 4);
                        return (
                          <button
                            key={preset.label}
                            onClick={() => {
                              if (isLandscapeMobile) setLandscapeScale(preset.val);
                              else setMobileScale(preset.val);
                            }}
                            className={`py-2 px-2.5 rounded-xl border text-[0.65rem] tracking-wider uppercase transition-all ${
                              isSelected
                                ? "bg-[#C9A96E] text-black font-semibold border-[#C9A96E]"
                                : "bg-white/5 border-white/10 text-white/70"
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Touch Slider */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[0.65rem] text-white/60">
                        <span>Wall Proportion Slider</span>
                        <span className="text-[#C9A96E] font-mono">{liveDimensions.displayIn}</span>
                      </div>
                      <input
                        type="range"
                        min={isLandscapeMobile ? "7" : "26"}
                        max={isLandscapeMobile ? "27" : "74"}
                        step={isLandscapeMobile ? "0.5" : "1"}
                        value={isLandscapeMobile ? landscapeScale : mobileScale}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (isLandscapeMobile) setLandscapeScale(val);
                          else setMobileScale(val);
                        }}
                        className="w-full accent-[#C9A96E] h-2 bg-white/20 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* SHEET CONTENT: LIGHTING */}
                {activeTab === "lighting" && (
                  <div className="grid grid-cols-3 gap-2 py-2">
                    {LIGHTING_MODES.map((mode) => {
                      const isSelected = lighting.id === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => {
                            setLighting(mode);
                            setIsMobileSheetOpen(false);
                          }}
                          className={`p-3 rounded-xl border text-xs uppercase tracking-wider transition-all flex flex-col items-center gap-2 ${
                            isSelected
                              ? "bg-[#C9A96E]/20 border-[#C9A96E] text-[#C9A96E]"
                              : "bg-white/5 border-white/10 text-white/60"
                          }`}
                        >
                          <FaSun className="text-sm" />
                          <span className="text-[0.62rem] text-center leading-tight">{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── 5. DESKTOP FLOATING CONTROLS DOCK (Hidden on Mobile) ── */}
      {!isZenMode && !isMobile && (
        <>
          {isControlsVisible ? (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-5xl bg-[#141210] border border-white/25 rounded-2xl p-3 md:p-4 shadow-[0_12px_50px_rgba(0,0,0,0.95)] transition-all duration-300">
              <div className="flex flex-col gap-2.5">
                {/* Control Mode Tabs & Actions */}
                <div className="flex items-center justify-between border-b border-white/20 pb-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {[
                      { id: "rooms", label: "Rooms & Walls", icon: FaImages },
                      { id: "frames", label: "Frames", icon: FaExpand },
                      { id: "scale", label: "Size & Dimensions", icon: FaRulerCombined },
                      { id: "lighting", label: "Ambience", icon: FaSun },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider font-sans transition-all ${
                            isActive
                              ? "bg-[#C9A96E] text-black font-bold shadow-md border border-[#C9A96E]"
                              : "bg-[#221F1C] text-[#E8DDD0] hover:text-white hover:bg-[#2F2B27] border border-white/15 font-medium"
                          }`}
                        >
                          <Icon className={`text-xs ${isActive ? "text-black" : "text-[#C9A96E]"}`} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Live Dimension Readout */}
                    <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/90 border border-[#C9A96E]/50 text-xs font-sans shadow-inner">
                      <span className="text-[#C9A96E] font-bold tracking-wide">{liveDimensions.displayIn}</span>
                      <span className="text-white/40">|</span>
                      <span className="text-white font-mono font-medium">{liveDimensions.displayCm}</span>
                    </div>

                    {/* Dimension Tag Toggle */}
                    <button
                      onClick={() => setShowDimensions((v) => !v)}
                      className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.68rem] uppercase tracking-wider transition-all font-semibold ${
                        showDimensions
                          ? "bg-[#C9A96E] text-black border border-[#C9A96E] shadow-sm"
                          : "bg-[#221F1C] text-white hover:bg-[#2F2B27] border border-white/25"
                      }`}
                    >
                      <FaCheck className={`text-[10px] ${showDimensions ? "text-black opacity-100" : "text-white/40 opacity-0"}`} />
                      <span>Dimensions Tag</span>
                    </button>

                    {/* Minimize Dock Button */}
                    <button
                      onClick={() => setIsControlsVisible(false)}
                      className="p-2 rounded-lg bg-[#221F1C] hover:bg-white/20 text-white/80 hover:text-white text-xs border border-white/15"
                      title="Minimize Dock"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {/* TAB CONTENT 1: ROOMS & CUSTOM WALL SELECTOR */}
                {activeTab === "rooms" && (
                  <div className="space-y-2">
                    <div
                      className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pb-0.5"
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      <div className="flex items-center gap-2">
                        {ROOM_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-3 py-1 rounded-full text-[0.65rem] tracking-wider uppercase font-semibold whitespace-nowrap transition-all shadow-sm ${
                              activeCategory === cat.id
                                ? "bg-white text-black font-bold ring-1 ring-white"
                                : "bg-[#221F1C] text-[#E8DDD0] hover:text-white hover:bg-[#2E2A26] border border-white/20"
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {/* Desktop Wall Photo Upload Button */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A96E] hover:bg-[#D4B67D] text-black border border-[#F3E2B8] text-xs tracking-wider uppercase font-bold whitespace-nowrap transition-all shadow-md active:scale-95"
                        >
                          <FaCamera className="text-black text-xs" />
                          <span>{customWallUrl ? "Change Wall Photo" : "Upload Your Wall"}</span>
                        </button>
                        {customWallUrl && (
                          <button
                            onClick={handleRemoveCustomWall}
                            title="Remove Custom Wall"
                            className="p-1.5 rounded-full bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-red-200 hover:text-white transition-all text-xs"
                          >
                            <FaTrashAlt />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Rooms Horizontal Strip with Scroll Buttons and No Scrollbar */}
                    <div className="relative group/rooms flex items-center">
                      {/* Left Navigation Chevron */}
                      <button
                        type="button"
                        onClick={() => scrollRooms("left")}
                        className="absolute -left-2 z-20 w-6 h-6 rounded-full bg-black/80 hover:bg-[#C9A96E] hover:text-black border border-white/20 text-white/80 flex items-center justify-center text-[10px] shadow-xl transition-all active:scale-95 opacity-0 group-hover/rooms:opacity-100"
                        title="Scroll Left"
                      >
                        <FaChevronLeft />
                      </button>

                      {/* Horizontal Rooms Container */}
                      <div
                        ref={roomsScrollRef}
                        onWheel={(e) => {
                          if (e.deltaY !== 0) {
                            e.currentTarget.scrollLeft += e.deltaY;
                          }
                        }}
                        className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar w-full scroll-smooth"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {/* Upload Card / Active Custom Wall Card */}
                        {customWallUrl ? (
                          <div
                            onClick={() => {
                              setSelectedRoom({
                                id: "custom-user-wall",
                                title: customWallName || "Your Wall Photo",
                                category: "custom",
                                src: customWallUrl,
                                defaultPos: { x: 50, y: 38 },
                                isCustom: true,
                              });
                              setPosOffset({ x: 0, y: 0 });
                            }}
                            className={`group relative flex-shrink-0 w-24 sm:w-32 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                              selectedRoom.id === "custom-user-wall"
                                ? "border-[#C9A96E] ring-2 ring-[#C9A96E]/30 scale-[1.02]"
                                : "border-white/15 opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={customWallUrl}
                              alt="Custom Wall"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-1">
                              <span className="text-[0.58rem] text-[#C9A96E] font-semibold leading-tight font-sans truncate w-full text-left">
                                ★ {customWallName}
                              </span>
                            </div>
                            {selectedRoom.id === "custom-user-wall" && (
                              <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#C9A96E] text-black flex items-center justify-center text-[8px] shadow">
                                <FaCheck />
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-shrink-0 w-24 sm:w-32 aspect-[16/10] rounded-lg border-2 border-dashed border-[#C9A96E]/40 hover:border-[#C9A96E] bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center gap-1 text-center p-1.5 transition-all group"
                            title="Upload your room wall photo"
                          >
                            <FaCloudUploadAlt className="text-base text-[#C9A96E] group-hover:scale-110 transition-transform" />
                            <span className="text-[0.58rem] text-white/80 font-medium leading-tight">
                              + Your Wall
                            </span>
                          </button>
                        )}

                        {/* Preset Rooms */}
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

                      {/* Right Navigation Chevron */}
                      <button
                        type="button"
                        onClick={() => scrollRooms("right")}
                        className="absolute -right-2 z-20 w-6 h-6 rounded-full bg-black/80 hover:bg-[#C9A96E] hover:text-black border border-white/20 text-white/80 flex items-center justify-center text-[10px] shadow-xl transition-all active:scale-95 opacity-0 group-hover/rooms:opacity-100"
                        title="Scroll Right"
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT 2: FRAMES SELECTOR */}
                {activeTab === "frames" && (
                  <div
                    onWheel={(e) => {
                      if (e.deltaY !== 0) {
                        e.currentTarget.scrollLeft += e.deltaY;
                      }
                    }}
                    className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {FRAME_STYLES.map((frame) => {
                      const isSelected = selectedFrame.id === frame.id;
                      return (
                        <button
                          key={frame.id}
                          onClick={() => setSelectedFrame(frame)}
                          className={`flex-shrink-0 px-3.5 py-2 rounded-xl border transition-all text-left flex items-center gap-2.5 ${
                            isSelected
                              ? "bg-[#C9A96E] text-black border-[#C9A96E] ring-1 ring-[#C9A96E] font-semibold shadow-md"
                              : "bg-[#221F1C] border-white/20 hover:border-white/40 hover:bg-[#2E2A26] text-white"
                          }`}
                        >
                          <div
                            className="w-7 h-9 rounded border overflow-hidden flex-shrink-0"
                            style={{
                              borderColor: frame.id === "canvas" ? "rgba(255,255,255,0.4)" : frame.frameColor,
                              backgroundColor: frame.frameColor,
                              borderWidth: frame.id === "canvas" ? "1px" : "3px",
                            }}
                          >
                            <div className="w-full h-full bg-[#352F2B]" />
                          </div>
                          <div>
                            <p className={`text-xs font-semibold ${isSelected ? "text-black" : "text-white"}`}>{frame.name}</p>
                            <p className={`text-[0.65rem] ${isSelected ? "text-black/75" : "text-[#E8DDD0]"}`}>{frame.subtitle}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* TAB CONTENT 3: SIZE & DYNAMIC DIMENSIONS SELECTOR */}
                {activeTab === "scale" && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
                    {/* Live Dimension Pill & Reset */}
                    <div className="flex items-center gap-2">
                      <div className="px-3.5 py-1.5 rounded-lg bg-black/90 border border-[#C9A96E] flex items-center gap-2 shadow-inner">
                        <FaRuler className="text-[#C9A96E] text-xs" />
                        <span className="text-xs text-white font-bold tracking-wide">
                          {liveDimensions.displayIn}
                        </span>
                        <span className="text-[0.7rem] text-[#F3E2B8] font-mono font-medium">
                          ({liveDimensions.displayCm})
                        </span>
                      </div>

                      {/* Presets */}
                      {[
                        { label: "Original (100%)", pct: 22 },
                        { label: "Compact (75%)", pct: 17 },
                        { label: "Statement (125%)", pct: 28 },
                        { label: "Grand (150%)", pct: 34 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => setScalePercent(preset.pct)}
                          className={`px-3 py-1.5 rounded-lg text-xs tracking-wider uppercase font-semibold transition-all ${
                            Math.abs(scalePercent - preset.pct) < 2
                              ? "bg-[#C9A96E] text-black font-bold border border-[#C9A96E] shadow-sm"
                              : "bg-[#221F1C] border border-white/20 text-[#E8DDD0] hover:text-white hover:bg-[#2E2A26]"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Scale Range Slider */}
                    <div className="flex items-center gap-3 w-full sm:w-64">
                      <span className="text-xs uppercase tracking-wider text-white font-semibold whitespace-nowrap">
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
                          className={`px-4 py-2 rounded-xl border text-xs uppercase tracking-wider transition-all flex items-center gap-2 font-semibold ${
                            isSelected
                              ? "bg-[#C9A96E] text-black border-[#C9A96E] shadow-sm"
                              : "bg-[#221F1C] border-white/20 text-white hover:bg-[#2E2A26]"
                          }`}
                        >
                          <FaSun className={`text-xs ${isSelected ? "text-black" : "text-[#C9A96E]"}`} />
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
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-full bg-[#141210] hover:bg-black border border-white/30 text-white font-semibold text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <FaSlidersH className="text-[#C9A96E]" />
              <span>Show Room & Frame Controls</span>
            </button>
          )}
        </>
      )}

      {/* ── 6. SWITCH ARTWORK DRAWER (Slide-Over Tray) ── */}
      {isArtworkDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex justify-end animate-fadeIn"
          onClick={() => setIsArtworkDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md h-full bg-[#161514] border-l border-white/10 flex flex-col p-4 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <span className="text-[0.6rem] uppercase tracking-[0.25em] text-[#C9A96E] font-semibold block">
                  Nancy Sikri Atelier
                </span>
                <h3 className="font-display text-base sm:text-lg text-white">Select Artwork</h3>
              </div>
              <button
                onClick={() => setIsArtworkDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
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
                    className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#C9A96E]/15 border-[#C9A96E] ring-1 ring-[#C9A96E]/40"
                        : "bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10"
                    }`}
                  >
                    <div className="relative w-14 sm:w-16 h-18 sm:h-20 rounded-md overflow-hidden bg-black/40 flex-shrink-0">
                      <img
                        src={art.src}
                        alt={art.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-xs sm:text-sm text-white truncate">
                        {art.title}
                      </h4>
                      <p className="text-[0.65rem] text-white/50 truncate mt-0.5">
                        {art.medium || "Acrylic on Canvas"}
                      </p>
                      <p className="text-[0.6rem] text-[#C9A96E] tracking-wider uppercase mt-1">
                        {art.size || "Original Size"}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[#C9A96E] text-black flex items-center justify-center text-[9px]">
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
