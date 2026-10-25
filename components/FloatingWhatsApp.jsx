"use client";

import { useState } from "react";
import { FaWhatsapp, FaTimes } from "react-icons/fa";

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappNumber = "919818817291";
  const defaultMessage = encodeURIComponent(
    "Hello Nancy / Kala Samputah, I am visiting your website and would like to inquire about your original paintings & collections."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <aside 
      aria-label="WhatsApp Contact"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 select-none"
    >
      {/* Optional Speech Bubble Tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 text-brand-dark shadow-lg border border-[#E8DDD0] backdrop-blur-md animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-sans font-medium text-brand-dark hover:text-[#128C7E] transition-colors"
          >
            Chat with Nancy on WhatsApp
          </a>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-brand-muted hover:text-brand-dark ml-1 p-0.5"
            aria-label="Dismiss tooltip"
          >
            <FaTimes className="text-[10px]" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Chat on WhatsApp with Nancy Sikri"
      >
        {/* Subtle breathing ripple */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping -z-10" />

        <FaWhatsapp className="text-3xl text-white drop-shadow" />

        {/* Small tooltip on hover */}
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-brand-dark text-white text-xs font-sans whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md hidden sm:block">
          Direct WhatsApp Chat
        </span>
      </a>
    </aside>
  );
}
