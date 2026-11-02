"use client";

import { useState, useRef, useEffect } from "react";
import Image, { getImageProps } from "next/image";
import { FaSearchPlus, FaSearchMinus, FaExpand, FaTimes, FaCompress, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Resolve an optimized (webp/avif, correctly sized) URL via Next's image pipeline,
// so CSS background zoom panes don't download raw full-size files.
function optimizedSrc(src, width) {
  try {
    const props = getImageProps({ src, alt: "", width, height: Math.round(width * 1.25) });
    const matches = props.srcSet?.match(/\s(\d+)w/g) || [];
    const widths = matches.map((s) => parseInt(s.trim().slice(0, -1), 10));
    const best = widths.filter((x) => x >= width).sort((a, b) => a - b)[0] || widths[widths.length - 1];
    if (best) {
      const url = new URL(props.src, "http://localhost");
      url.searchParams.set("w", String(best));
      return url.pathname + url.search;
    }
    return props.src || src;
  } catch {
    return src;
  }
}

export default function LensZoom({ src, alt, title, views }) {
  const [zoomLevel, setZoomLevel] = useState(2.5); // 1.5x to 5x
  const [isHovering, setIsHovering] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, percentX: 50, percentY: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(2);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeIdx, setActiveIdx] = useState(0);

  const containerRef = useRef(null);
  const lightboxRef = useRef(null);
  const touchStartRef = useRef(null);
  const lbSwipeStartRef = useRef(null);
  const swipedRef = useRef(false);
  const LENS_SIZE = 120; // px

  // ── Multi-angle views: thumbnails / swipe / lightbox navigation ──────────
  const angleViewsList =
    Array.isArray(views) && views.filter((v) => v?.src).length > 0
      ? views.filter((v) => v?.src)
      : [{ src, label: alt || "Front View" }];
  const hasMultiple = angleViewsList.length > 1;
  const clampedIdx = Math.min(activeIdx, angleViewsList.length - 1);
  const active = angleViewsList[clampedIdx];
  const activeSrc = active.src;
  // Optimized variants for CSS-background surfaces (pane + lightbox)
  const isRemote = /^https?:\/\//.test(activeSrc);
  const paneBgSrc = isRemote ? activeSrc : optimizedSrc(activeSrc, 1200);
  const lightboxSrc = isRemote ? activeSrc : optimizedSrc(activeSrc, 1600);

  const selectView = (i) => {
    const next = (i + angleViewsList.length) % angleViewsList.length;
    setActiveIdx(next);
    setLensPos({ x: 0, y: 0, percentX: 50, percentY: 50 });
    setPanPos({ x: 0, y: 0 });
    setLightboxZoom(2);
  };

  // Arrow-key angle navigation while lightbox is open
  useEffect(() => {
    if (!isLightboxOpen || !hasMultiple) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") selectView(clampedIdx + 1);
      if (e.key === "ArrowLeft") selectView(clampedIdx - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLightboxOpen, clampedIdx, hasMultiple]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setLensPos({
      x: x - LENS_SIZE / 2,
      y: y - LENS_SIZE / 2,
      percentX,
      percentY,
    });
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();

    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;

    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    setLensPos({
      x: x - LENS_SIZE / 2,
      y: y - LENS_SIZE / 2,
      percentX: (x / rect.width) * 100,
      percentY: (y / rect.height) * 100,
    });
  };

  // Lightbox touch handlers
  const handleContainerTouchStart = (e) => {
    setIsHovering(true);
    swipedRef.current = false;
    if (hasMultiple && e.touches[0]) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleContainerTouchEnd = (e) => {
    setIsHovering(false);
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || !hasMultiple || !e.changedTouches?.[0]) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    // Horizontal swipe dominates → switch angle, suppress lightbox tap
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      swipedRef.current = true;
      selectView(clampedIdx + (dx < 0 ? 1 : -1));
    }
  };

  const handleLightboxTouchStart = (e) => {
    if (e.touches.length === 1) {
      lbSwipeStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panPos.x,
        y: e.touches[0].clientY - panPos.y,
      });
    }
  };

  const handleLightboxTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanPos({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleLightboxTouchEnd = (e) => {
    setIsDragging(false);
    // At 1x zoom, horizontal swipe switches angle instead of panning
    const start = lbSwipeStartRef.current;
    lbSwipeStartRef.current = null;
    if (!start || !hasMultiple || lightboxZoom > 1 || !e.changedTouches?.[0]) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      selectView(clampedIdx + (dx < 0 ? 1 : -1));
    }
  };

  // Mouse pan inside lightbox
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - panPos.x,
      y: e.clientY - panPos.y,
    });
  };

  const handleMouseDrag = (e) => {
    if (!isDragging) return;
    setPanPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ── Studio Lens Control Bar · Luxury Ink & Gold ── */}
      <div
        className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 px-5 py-3.5 rounded-xl border border-[#C9A96E]/25 shadow-[0_14px_36px_-16px_rgba(0,0,0,0.6)]"
        style={{ background: "linear-gradient(135deg, #171310 0%, #241C13 55%, #171310 100%)" }}
      >
        {/* Monogram label + live magnification */}
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-full border border-[#C9A96E]/40 flex items-center justify-center flex-shrink-0"
            style={{ background: "radial-gradient(circle at 35% 30%, rgba(201,169,110,0.28), transparent 72%)" }}
          >
            <FaSearchPlus className="text-[11px] text-[#C9A96E]" />
          </span>
          <div className="leading-tight">
            <p className="text-[0.56rem] uppercase tracking-[0.34em] text-[#C9A96E]/85 font-sans font-semibold">Studio Lens</p>
            <p className="font-display text-[0.95rem] text-[#F5F0E8]">
              {zoomLevel.toFixed(1)}×{" "}
              <span className="text-[0.56rem] tracking-[0.22em] text-[#F5F0E8]/40 uppercase font-sans">magnification</span>
            </p>
          </div>
        </div>

        {/* Zoom Slider + Presets */}
        <div className="flex items-center gap-3 w-full sm:w-auto order-3 sm:order-none">
          <button
            onClick={() => setZoomLevel((z) => Math.max(1.5, +(z - 0.5).toFixed(1)))}
            className="w-7 h-7 rounded-full border border-white/10 text-[#F5F0E8]/65 hover:text-[#C9A96E] hover:border-[#C9A96E]/50 flex items-center justify-center transition-colors disabled:opacity-25 flex-shrink-0"
            disabled={zoomLevel <= 1.5}
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <FaSearchMinus className="text-[10px]" />
          </button>

          <input
            type="range"
            min="1.5"
            max="5"
            step="0.25"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
            className="lux-range flex-1 sm:w-40"
            style={{ "--lux-fill": `${((zoomLevel - 1.5) / 3.5) * 100}%` }}
            aria-label="Adjust Zoom Level"
          />

          <button
            onClick={() => setZoomLevel((z) => Math.min(5, +(z + 0.5).toFixed(1)))}
            className="w-7 h-7 rounded-full border border-white/10 text-[#F5F0E8]/65 hover:text-[#C9A96E] hover:border-[#C9A96E]/50 flex items-center justify-center transition-colors disabled:opacity-25 flex-shrink-0"
            disabled={zoomLevel >= 5}
            title="Zoom In"
            aria-label="Zoom In"
          >
            <FaSearchPlus className="text-[10px]" />
          </button>

          {/* Quick preset buttons */}
          <div className="hidden sm:flex items-center gap-1.5 ml-1 pl-3.5 border-l border-white/10">
            {[1.5, 2.5, 4.0].map((val) => (
              <button
                key={val}
                onClick={() => setZoomLevel(val)}
                className={`text-[0.62rem] tracking-wider px-2.5 py-1 rounded-full transition-all font-sans border ${
                  zoomLevel === val
                    ? "bg-[#C9A96E] text-[#17130F] font-semibold border-[#C9A96E] shadow-[0_2px_12px_-2px_rgba(201,169,110,0.6)]"
                    : "text-[#F5F0E8]/50 border-white/10 hover:text-[#C9A96E] hover:border-[#C9A96E]/45"
                }`}
              >
                {val}×
              </button>
            ))}
          </div>
        </div>

        {/* Fullscreen Touch Lightbox trigger */}
        <button
          onClick={() => {
            setIsLightboxOpen(true);
            setPanPos({ x: 0, y: 0 });
          }}
          className="lux-btn-gold text-[0.62rem] tracking-[0.2em] uppercase px-5 py-2.5 rounded-full text-[#17130F] font-sans font-semibold flex items-center gap-2 shadow-[0_4px_18px_-6px_rgba(201,169,110,0.5)]"
          title="Open Fullscreen Lightbox"
        >
          <FaExpand className="text-[10px]" />
          <span className="hidden sm:inline">Inspect Fullscreen</span>
          <span className="sm:hidden">Touch Lightbox</span>
        </button>
      </div>

      {/* Main Showcase Grid (Amazon/Flipkart Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Artwork Container with Lens Box + Angle Thumbnail Rail */}
        <div className="lg:col-span-6 relative">
          <div className="flex flex-col-reverse lg:flex-row gap-3">
            {/* Thumbnail Rail (left on desktop, below canvas on mobile) */}
            {hasMultiple && (
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:max-h-none flex-shrink-0 pb-1 lg:pb-0 lg:w-[74px]">
                {angleViewsList.map((v, i) => (
                  <button
                    key={`${v.src}-${i}`}
                    onClick={() => selectView(i)}
                    title={v.label || `Angle ${i + 1}`}
                    aria-label={`View ${v.label || `angle ${i + 1}`}`}
                    className={`relative w-[58px] sm:w-[64px] aspect-[4/5] rounded-md overflow-hidden border transition-all flex-shrink-0 ${
                      i === clampedIdx
                        ? "border-brand-accent ring-2 ring-brand-accent/40 opacity-100"
                        : "border-[#E8DDD0] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={v.src}
                      alt={v.label || `${title || "Artwork"} angle ${i + 1}`}
                      fill
                      loading="lazy"
                      sizes="74px"
                      className="object-cover pointer-events-none"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 min-w-0">
          <div
            ref={containerRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={handleContainerTouchStart}
            onTouchEnd={handleContainerTouchEnd}
            onTouchMove={handleTouchMove}
            onClick={() => {
              if (swipedRef.current) {
                swipedRef.current = false;
                return;
              }
              setIsLightboxOpen(true);
              setPanPos({ x: 0, y: 0 });
            }}
            className="relative w-full aspect-[4/5] bg-[#EFECE6] rounded-lg overflow-hidden border border-[#E8DDD0] cursor-crosshair shadow-sm select-none"
          >
            <Image
              key={activeSrc}
              src={activeSrc}
              alt={`${active.label || alt || title || "Artwork"}`}
              fill
              priority
              className="object-cover pointer-events-none animate-fadeIn"
            />

            {/* Lens Guide Hint overlay */}
            {!isHovering && (
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[0.68rem] px-3 py-1.5 rounded-full font-sans tracking-wide pointer-events-none flex items-center gap-2">
                <FaSearchPlus className="text-brand-accent text-xs" />
                <span className="hidden sm:inline">Hover to inspect canvas texture · Tap for fullscreen</span>
                <span className="sm:hidden">Tap to zoom & touch-inspect texture</span>
              </div>
            )}

            {/* Magnifier Lens Box */}
            {isHovering && (
              <div
                className="absolute border-2 border-brand-accent/90 bg-brand-accent/20 pointer-events-none shadow-lg"
                style={{
                  width: `${LENS_SIZE}px`,
                  height: `${LENS_SIZE}px`,
                  left: `${lensPos.x}px`,
                  top: `${lensPos.y}px`,
                  backdropFilter: "contrast(115%)",
                }}
              />
            )}
          </div>

          {/* Active Angle Caption + Prev/Next */}
          {hasMultiple && (
            <div className="mt-2.5 flex items-center justify-center gap-3">
              <button
                onClick={() => selectView(clampedIdx - 1)}
                className="w-7 h-7 rounded-full bg-white border border-[#E2D8CB] text-brand-dark hover:text-brand-accent hover:border-brand-accent flex items-center justify-center transition-colors"
                aria-label="Previous angle"
              >
                <FaChevronLeft className="text-[10px]" />
              </button>
              <span className="text-[0.68rem] uppercase tracking-widest text-brand-warm font-sans font-medium text-center">
                {active.label} · {clampedIdx + 1}/{angleViewsList.length}
              </span>
              <button
                onClick={() => selectView(clampedIdx + 1)}
                className="w-7 h-7 rounded-full bg-white border border-[#E2D8CB] text-brand-dark hover:text-brand-accent hover:border-brand-accent flex items-center justify-center transition-colors"
                aria-label="Next angle"
              >
                <FaChevronRight className="text-[10px]" />
              </button>
            </div>
          )}
            </div>
          </div>
        </div>

        {/* Magnified Zoom Result Pane (Desktop Side Pane) · Ink & Gold Frame */}
        <div
          className="hidden lg:block lg:col-span-6 relative aspect-[4/5] w-full rounded-xl overflow-hidden border border-[#C9A96E]/30 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] bg-[#14100C]"
        >
          {isHovering ? (
            <div
              className="w-full h-full transition-[background-position] duration-75 ease-out"
              style={{
                backgroundImage: `url(${paneBgSrc})`,
                backgroundPosition: `${lensPos.percentX}% ${lensPos.percentY}%`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center text-center p-10"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 38%, rgba(201,169,110,0.10) 0%, transparent 62%), linear-gradient(160deg, #171310 0%, #1E1812 55%, #120E0A 100%)",
              }}
            >
              {/* Gold corner brackets — gallery plate framing */}
              {["top-4 left-4 border-t border-l", "top-4 right-4 border-t border-r", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((pos) => (
                <span key={pos} className={`absolute ${pos} border-[#C9A96E]/35 w-6 h-6 pointer-events-none`} />
              ))}
              <div
                className="w-16 h-16 rounded-full border border-[#C9A96E]/40 flex items-center justify-center mb-5"
                style={{ background: "radial-gradient(circle at 35% 30%, rgba(201,169,110,0.3), transparent 72%)" }}
              >
                <FaSearchPlus className="text-2xl text-[#C9A96E]" />
              </div>
              <p className="text-[0.56rem] uppercase tracking-[0.34em] text-[#C9A96E]/80 font-sans font-semibold mb-2">
                Studio Macro Lens
              </p>
              <h4 className="font-display text-xl text-[#F5F0E8] mb-2 leading-snug">
                Examine the Canvas<br className="hidden" /> in Full Detail
              </h4>
              <p className="text-[0.8rem] text-[#F5F0E8]/45 font-sans max-w-[30ch] leading-relaxed">
                Hover over the artwork to study brushwork, pigment saturation, and raw canvas grain — rendered live at your chosen magnification.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="h-px w-10 bg-[#C9A96E]/30" />
                <span className="text-[0.62rem] uppercase tracking-[0.26em] text-[#C9A96E]/70 font-sans">
                  {zoomLevel.toFixed(1)}× magnification primed
                </span>
                <span className="h-px w-10 bg-[#C9A96E]/30" />
              </div>
            </div>
          )}

          {isHovering && (
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-[#C9A96E]/35 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse" />
              <span className="text-[0.62rem] font-sans tracking-[0.22em] uppercase text-[#C9A96E] font-semibold">
                Live · {zoomLevel.toFixed(1)}×
              </span>
            </div>
          )}
        </div>

        {/* Mobile Inline Lens Peek (When touching mobile canvas) */}
        {isHovering && (
          <div className="lg:hidden col-span-1 relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#C9A96E]/35 shadow-[0_18px_44px_-18px_rgba(0,0,0,0.7)] bg-[#14100C] animate-fadeIn">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${paneBgSrc})`,
                backgroundPosition: `${lensPos.percentX}% ${lensPos.percentY}%`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-[#C9A96E]/35 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse" />
              <span className="text-[0.6rem] font-sans tracking-[0.22em] uppercase text-[#C9A96E] font-semibold">
                Live Macro · {zoomLevel.toFixed(1)}×
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Touch Pinch / Pan Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-2 sm:p-6 backdrop-blur-md animate-fadeIn"
          style={{ touchAction: "none" }}
        >
          {/* Top Controls Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between px-4 py-3 text-white border-b border-white/10 z-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C9A96E] font-sans font-semibold">
                Canvas Texture Inspector{hasMultiple ? ` · ${active.label}` : ""}
              </p>
              <p className="text-sm font-medium font-sans truncate max-w-[200px] sm:max-w-md text-white/90">
                {title || "Artwork Detail"}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setLightboxZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))}
                disabled={lightboxZoom <= 1}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 transition-all"
                aria-label="Zoom Out"
              >
                <FaSearchMinus className="text-xs" />
              </button>
              <span className="text-xs font-mono px-2 py-1 bg-white/10 rounded">
                {lightboxZoom.toFixed(1)}x
              </span>
              <button
                onClick={() => setLightboxZoom((z) => Math.min(5, +(z + 0.5).toFixed(1)))}
                disabled={lightboxZoom >= 5}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 transition-all"
                aria-label="Zoom In"
              >
                <FaSearchPlus className="text-xs" />
              </button>
              <button
                onClick={() => {
                  setLightboxZoom(1);
                  setPanPos({ x: 0, y: 0 });
                }}
                className="text-[0.68rem] uppercase tracking-wider px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded font-sans hidden sm:inline"
              >
                Reset Pan
              </button>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center ml-2 transition-all"
                aria-label="Close Lightbox"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          </div>

          {/* Canvas Pan Container */}
          <div
            ref={lightboxRef}
            className="relative flex-1 w-full max-w-5xl flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
            onTouchStart={handleLightboxTouchStart}
            onTouchMove={handleLightboxTouchMove}
            onTouchEnd={handleLightboxTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseDrag}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            {/* Angle navigation inside fullscreen */}
            {hasMultiple && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); selectView(clampedIdx - 1); }}
                  className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white flex items-center justify-center transition-all"
                  aria-label="Previous angle"
                >
                  <FaChevronLeft className="text-sm" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); selectView(clampedIdx + 1); }}
                  className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white flex items-center justify-center transition-all"
                  aria-label="Next angle"
                >
                  <FaChevronRight className="text-sm" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 bg-black/60 text-white/80 px-3 py-1 rounded-full text-[0.65rem] uppercase tracking-widest font-sans">
                  {clampedIdx + 1} / {angleViewsList.length} · Swipe or ← → to change angle
                </div>
              </>
            )}
            <div
              className="relative max-w-full max-h-[80vh] transition-transform duration-100 ease-out"
              style={{
                transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${lightboxZoom})`,
                transformOrigin: "center center",
              }}
            >
              <img
                key={activeSrc}
                src={lightboxSrc}
                alt={`${active.label || alt || title || "Artwork"}`}
                className="max-h-[75vh] max-w-[90vw] object-contain rounded pointer-events-none shadow-2xl"
                draggable={false}
              />
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="py-2 text-center text-white/50 text-[0.7rem] font-sans">
            Drag with finger or mouse to pan · Use + / - to zoom up to 5x
          </div>
        </div>
      )}
    </div>
  );
}
