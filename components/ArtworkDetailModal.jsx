"use client";

import { FaTimes, FaWhatsapp, FaArrowRight, FaShieldAlt, FaAward, FaTruck, FaBrush } from "react-icons/fa";
import LensZoom from "./LensZoom";

export default function ArtworkDetailModal({ isOpen, onClose, artwork, onInquire }) {
  if (!isOpen || !artwork) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-[#FDFAF5] rounded-xl shadow-2xl border border-[#E8DDD0] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE2D5] bg-[#F5EFE6] flex-shrink-0">
          <div>
            <span className="text-[0.6rem] uppercase tracking-[0.25em] text-brand-accent font-sans font-semibold block">
              Nancy Sikri Atelier · Provenance Archive
            </span>
            <h2 className="font-display text-lg sm:text-xl text-brand-dark leading-tight">
              {artwork.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-brand-muted hover:text-brand-dark hover:bg-white/80 transition-all"
            aria-label="Close Artwork Viewer"
          >
            <FaTimes className="text-base" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-8">
          
          {/* Amazon/Flipkart Lens Zoom Feature */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-brand-warm font-sans font-medium">
                Interactive Canvas Inspection
              </span>
              <span className="text-[0.7rem] text-brand-muted font-sans hidden sm:inline-block">
                Drag cursor or touch to inspect texture · Adjust zoom level
              </span>
            </div>

            <LensZoom
              src={artwork.src}
              alt={artwork.title}
              title={artwork.title}
            />
          </div>

          {/* Details & Inquire Panel */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 border-t border-[#EAE2D5] items-start">
            
            {/* Left Specs (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h3 className="font-display text-2xl md:text-3xl text-brand-dark">
                  {artwork.title}
                </h3>
                <p className="text-sm text-brand-warm font-sans mt-0.5">
                  By {artwork.artist || "Nancy Sikri"} · New Delhi Studio
                </p>
              </div>

              {/* Artwork Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-4 rounded-lg border border-[#EBE4D8]">
                <div>
                  <span className="text-[0.62rem] uppercase tracking-wider text-brand-muted font-sans block">
                    Medium
                  </span>
                  <p className="text-xs font-semibold text-brand-dark font-sans mt-0.5">
                    {artwork.medium || "Acrylic on Canvas"}
                  </p>
                </div>
                <div>
                  <span className="text-[0.62rem] uppercase tracking-wider text-brand-muted font-sans block">
                    Dimensions
                  </span>
                  <p className="text-xs font-semibold text-brand-dark font-sans mt-0.5">
                    {artwork.size || "24 × 30 in"}
                  </p>
                </div>
                <div>
                  <span className="text-[0.62rem] uppercase tracking-wider text-brand-muted font-sans block">
                    Creation Year
                  </span>
                  <p className="text-xs font-semibold text-brand-dark font-sans mt-0.5">
                    {artwork.year || 2024}
                  </p>
                </div>
              </div>

              {/* Curatorial Statement */}
              <div className="text-sm text-[#4E443B] font-sans font-light leading-relaxed space-y-2">
                <p>
                  Created using intuitive, physical layering of raw acrylic pigments, charcoal, and varnish on custom hand-stretched canvas. Every mark is placed without preliminary sketching, allowing visceral emotional rhythms to surface.
                </p>
                <p className="text-xs text-brand-muted italic font-display">
                  "The work is completed only when it no longer asks anything of the studio, ready to converse with its new space."
                </p>
              </div>

              {/* Value Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-brand-muted font-sans">
                  <FaAward className="text-brand-accent text-sm flex-shrink-0" />
                  <span>100% Original Studio Work</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-muted font-sans">
                  <FaShieldAlt className="text-brand-accent text-sm flex-shrink-0" />
                  <span>Signed Certificate</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-muted font-sans">
                  <FaTruck className="text-brand-accent text-sm flex-shrink-0" />
                  <span>Insured Global Crating</span>
                </div>
              </div>
            </div>

            {/* Right Action Box (5 cols) */}
            <div className="md:col-span-5 bg-white p-6 rounded-xl border border-[#E7DFD2] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[0.65rem] uppercase tracking-widest text-brand-accent font-sans font-semibold block mb-1">
                  Private Acquisition
                </span>
                <p className="font-display text-xl text-brand-dark mb-1">
                  Inquire for Pricing & Details
                </p>
                <p className="text-xs text-brand-muted font-sans leading-relaxed mb-6">
                  We place original works directly through private inquiry. No retail cart markups. Includes tailored framing options and shipping logistics.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    onClose();
                    onInquire(artwork);
                  }}
                  className="w-full py-3.5 px-6 bg-brand-dark hover:bg-brand-warm text-brand-cream rounded-lg text-xs tracking-widest uppercase font-sans font-medium transition-all shadow hover:shadow-md flex items-center justify-center gap-2"
                >
                  <span>Inquire for Quote</span>
                  <FaArrowRight className="text-[10px] text-brand-accent" />
                </button>

                <a
                  href={`https://wa.me/919818817291?text=${encodeURIComponent(
                    `Hello Nancy, I am inquiring about the painting: ${artwork.title}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg text-xs tracking-wider uppercase font-sans font-medium transition-all flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="text-base" />
                  <span>WhatsApp Studio Directly</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
