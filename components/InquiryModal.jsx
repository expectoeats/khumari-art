"use client";

import { useState } from "react";
import Image from "next/image";
import { FaTimes, FaEnvelope, FaWhatsapp, FaCheckCircle, FaShieldAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function InquiryModal({ isOpen, onClose, artwork }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !artwork) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Nancy / Khumari Art Studio,\n\nI am interested in inquiring about the original artwork:\n*${artwork.title}*\nArtist: ${artwork.artist || "Nancy Sikri"}\nMedium: ${artwork.medium || "Painting"}\nDimensions: ${artwork.size || "Original Canvas"}\n\nCould you please share details on availability, pricing, and crating/delivery?`
  );

  const whatsappUrl = `https://wa.me/919818817291?text=${whatsappMessage}`;
  const mailtoUrl = `mailto:ratulm28@gmail.com?subject=Inquiry for Quote: ${encodeURIComponent(artwork.title)}&body=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#FDFAF5] rounded-xl shadow-2xl border border-[#E8DDD0] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE2D5] bg-[#F5EFE6]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <p className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-brand-dark">
              Acquisition & Quote Inquiry
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-brand-muted hover:text-brand-dark hover:bg-white/80 transition-all"
            aria-label="Close Inquiry Dialog"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {/* Artwork Summary Snippet */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-white border border-[#E8E1D5] mb-6">
            <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded overflow-hidden flex-shrink-0 bg-neutral-200 border border-[#DFD6C9]">
              <Image
                src={artwork.src}
                alt={artwork.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[0.62rem] uppercase tracking-widest text-brand-accent font-sans block mb-0.5">
                Original Studio Work
              </span>
              <h3 className="font-display text-lg sm:text-xl text-brand-dark truncate leading-tight">
                {artwork.title}
              </h3>
              <p className="text-xs text-brand-muted font-sans mt-0.5">
                {artwork.artist || "Nancy Sikri"} · {artwork.medium || "Acrylic on Canvas"}
              </p>
              {artwork.size && (
                <p className="text-[0.7rem] text-brand-warm font-sans mt-0.5">
                  Dimensions: {artwork.size} {artwork.year ? `(${artwork.year})` : ""}
                </p>
              )}
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-8 px-4 bg-emerald-50/70 border border-emerald-200 rounded-lg">
              <FaCheckCircle className="text-4xl text-emerald-600 mx-auto mb-3" />
              <h4 className="font-display text-2xl text-brand-dark mb-1">
                Inquiry Received
              </h4>
              <p className="text-sm text-brand-muted font-sans max-w-md mx-auto leading-relaxed mb-6">
                Thank you for your interest in <em>"{artwork.title}"</em>. Studio Khumari / Nancy Sikri will review your request and get back to you directly within 24 hours.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs tracking-wider uppercase font-sans font-medium transition-all"
                >
                  <FaWhatsapp className="text-sm" />
                  Fast-Track on WhatsApp
                </a>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="px-5 py-2.5 bg-white border border-[#DDD3C4] text-brand-dark rounded text-xs tracking-wider uppercase font-sans hover:bg-neutral-50 transition-all"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.68rem] tracking-wider uppercase text-brand-dark font-sans font-medium mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adarsh Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded border border-[#DFD6C8] bg-white focus:outline-none focus:border-brand-accent text-sm text-brand-dark font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[0.68rem] tracking-wider uppercase text-brand-dark font-sans font-medium mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. adarsh@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded border border-[#DFD6C8] bg-white focus:outline-none focus:border-brand-accent text-sm text-brand-dark font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.68rem] tracking-wider uppercase text-brand-dark font-sans font-medium mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded border border-[#DFD6C8] bg-white focus:outline-none focus:border-brand-accent text-sm text-brand-dark font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[0.68rem] tracking-wider uppercase text-brand-dark font-sans font-medium mb-1">
                    City / Country
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. New Delhi, India"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded border border-[#DFD6C8] bg-white focus:outline-none focus:border-brand-accent text-sm text-brand-dark font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.68rem] tracking-wider uppercase text-brand-dark font-sans font-medium mb-1">
                  Message / Inquiries regarding space or framing
                </label>
                <textarea
                  rows={3}
                  placeholder="I am interested in acquiring this piece. Please share price quote, certificate of authenticity details, and delivery timelines..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded border border-[#DFD6C8] bg-white focus:outline-none focus:border-brand-accent text-sm text-brand-dark font-sans"
                />
              </div>

              {/* Provenance Promise Badge */}
              <div className="flex items-center gap-2 text-[0.7rem] text-brand-muted font-sans bg-[#F7F3EB] p-2.5 rounded border border-[#E9E1D4]">
                <FaShieldAlt className="text-brand-accent text-xs flex-shrink-0" />
                <span>
                  All acquisitions include a Certificate of Authenticity signed by Nancy Sikri and insured studio crating.
                </span>
              </div>

              {/* Submit Button & Direct Instant Links */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-brand-dark hover:bg-brand-warm text-brand-cream rounded text-xs tracking-widest uppercase font-sans font-medium transition-all shadow hover:shadow-md"
                >
                  Send Inquiry for Quote
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded text-xs tracking-wider uppercase font-sans font-medium transition-all shadow hover:shadow-md"
                  title="Inquire directly on WhatsApp"
                >
                  <FaWhatsapp className="text-base" />
                  <span>WhatsApp Quote</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
