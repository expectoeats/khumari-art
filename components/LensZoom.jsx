"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaSearchPlus, FaSearchMinus, FaExpand, FaTimes, FaCompress } from "react-icons/fa";

export default function LensZoom({ src, alt, title }) {
  const [zoomLevel, setZoomLevel] = useState(2.5); // 1.5x to 5x
  const [isHovering, setIsHovering] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, percentX: 50, percentY: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(2);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const lightboxRef = useRef(null);
  const LENS_SIZE = 120; // px

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
  const handleLightboxTouchStart = (e) => {
    if (e.touches.length === 1) {
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

  const handleLightboxTouchEnd = () => {
    setIsDragging(false);
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
      {/* Zoom Adjuster Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F4EFE6] px-4 py-2.5 rounded-lg border border-[#E8DDD0]">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-brand-warm font-medium flex items-center gap-1.5 font-sans">
            <FaSearchPlus className="text-brand-accent text-xs" />
            Lens Zoom:
          </span>
          <span className="text-xs font-semibold text-brand-dark font-sans px-2 py-0.5 bg-white rounded border border-[#E2D8CB]">
            {zoomLevel.toFixed(1)}x
          </span>
        </div>

        {/* Zoom Slider + Presets */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setZoomLevel((z) => Math.max(1.5, +(z - 0.5).toFixed(1)))}
            className="p-1.5 text-brand-dark hover:text-brand-accent transition-colors disabled:opacity-30"
            disabled={zoomLevel <= 1.5}
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <FaSearchMinus className="text-xs" />
          </button>

          <input
            type="range"
            min="1.5"
            max="5"
            step="0.25"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
            className="w-24 sm:w-32 accent-[#C9A96E] cursor-pointer"
            aria-label="Adjust Zoom Level"
          />

          <button
            onClick={() => setZoomLevel((z) => Math.min(5, +(z + 0.5).toFixed(1)))}
            className="p-1.5 text-brand-dark hover:text-brand-accent transition-colors disabled:opacity-30"
            disabled={zoomLevel >= 5}
            title="Zoom In"
            aria-label="Zoom In"
          >
            <FaSearchPlus className="text-xs" />
          </button>

          {/* Quick preset buttons */}
          <div className="hidden sm:flex items-center gap-1 ml-2 border-l border-[#E2D8CB] pl-2">
            {[1.5, 2.5, 4.0].map((val) => (
              <button
                key={val}
                onClick={() => setZoomLevel(val)}
                className={`text-[0.65rem] px-2 py-0.5 rounded transition-all font-sans ${
                  zoomLevel === val
                    ? "bg-brand-dark text-white font-medium"
                    : "bg-white/80 hover:bg-white text-brand-muted border border-[#E2D8CB]"
                }`}
              >
                {val}x
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
          className="text-xs px-3 py-1.5 bg-brand-dark hover:bg-brand-warm text-white rounded font-sans flex items-center gap-1.5 transition-colors shadow-sm"
          title="Open Fullscreen Lightbox"
        >
          <FaExpand className="text-[10px] text-brand-accent" />
          <span className="hidden sm:inline">Inspect Fullscreen</span>
          <span className="sm:hidden">Touch Lightbox</span>
        </button>
      </div>

      {/* Main Showcase Grid (Amazon/Flipkart Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Artwork Container with Lens Box */}
        <div className="lg:col-span-6 relative">
          <div
            ref={containerRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsHovering(true)}
            onTouchEnd={() => setIsHovering(false)}
            onTouchMove={handleTouchMove}
            onClick={() => setIsLightboxOpen(true)}
            className="relative w-full aspect-[4/5] bg-[#EFECE6] rounded-lg overflow-hidden border border-[#E8DDD0] cursor-crosshair shadow-sm select-none"
          >
            <Image
              src={src}
              alt={alt || title || "Artwork"}
              fill
              priority
              className="object-cover pointer-events-none"
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
        </div>

        {/* Magnified Zoom Result Pane (Desktop Side Pane) */}
        <div className="hidden lg:block lg:col-span-6 relative aspect-[4/5] w-full rounded-lg overflow-hidden border-2 border-brand-accent/40 shadow-2xl bg-[#1C1C1C]">
          {isHovering ? (
            <div
              className="w-full h-full transition-[background-position] duration-75 ease-out"
              style={{
                backgroundImage: `url(${src})`,
                backgroundPosition: `${lensPos.percentX}% ${lensPos.percentY}%`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-[#FAF7F2]">
              <div className="w-14 h-14 rounded-full bg-[#EAE2D5] flex items-center justify-center mb-4 text-brand-warm">
                <FaSearchPlus className="text-2xl text-brand-accent" />
              </div>
              <h4 className="font-display text-lg text-brand-dark mb-1">
                Studio Macro Lens View
              </h4>
              <p className="text-xs text-brand-muted font-sans max-w-xs leading-relaxed">
                Hover over the artwork on the left to examine high-resolution brushwork, pigment saturation, and raw canvas grain.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[0.7rem] text-brand-accent uppercase tracking-widest font-sans font-medium">
                <span>Current Magnification: {zoomLevel}x</span>
              </div>
            </div>
          )}

          {isHovering && (
            <div className="absolute top-3 right-3 bg-black/70 text-brand-accent px-2.5 py-1 rounded text-[0.65rem] font-sans tracking-widest uppercase backdrop-blur-md">
              Magnified {zoomLevel}x
            </div>
          )}
        </div>

        {/* Mobile Inline Lens Peek (When touching mobile canvas) */}
        {isHovering && (
          <div className="lg:hidden col-span-1 relative aspect-[16/10] w-full rounded-lg overflow-hidden border-2 border-brand-accent shadow-xl bg-[#1C1C1C] animate-fadeIn">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${src})`,
                backgroundPosition: `${lensPos.percentX}% ${lensPos.percentY}%`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className="absolute top-2 left-2 bg-black/80 text-brand-accent px-2.5 py-1 rounded text-[0.65rem] font-sans tracking-widest uppercase backdrop-blur-sm">
              Live Macro ({zoomLevel}x)
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
                Canvas Texture Inspector
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
            <div
              className="relative max-w-full max-h-[80vh] transition-transform duration-100 ease-out"
              style={{
                transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${lightboxZoom})`,
                transformOrigin: "center center",
              }}
            >
              <img
                src={src}
                alt={alt || title || "Artwork"}
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
