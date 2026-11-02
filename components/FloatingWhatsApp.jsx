"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp, FaTimes } from "react-icons/fa";
import { useSiteContent } from "./SiteContentContext";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(true);
  const { content } = useSiteContent();
  const whatsappNumber = (
    content?.announcement?.whatsappNumber ||
    content?.contact?.whatsappNumber ||
    "919818817291"
  ).replace(/[^0-9]/g, "");

  // Do not show on any admin panel page or view-on-wall studio visualizer
  if (pathname && (pathname.startsWith("/admin") || pathname.startsWith("/view-on-wall"))) {
    return null;
  }
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
        aria-label="Open WhatsApp conversation with Nancy Sikri"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group relative"
        style={{ width: "3.5rem", height: "3.5rem" }}
      >
        <FaWhatsapp className="text-2.5xl sm:text-3xl text-white group-hover:rotate-6 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-accent rounded-full border-2 border-white" />
      </a>
    </aside>
  );
}
