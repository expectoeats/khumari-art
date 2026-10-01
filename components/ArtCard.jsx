"use client";

import Image from "next/image";
import { FaSearchPlus } from "react-icons/fa";
import { useArtModal } from "./ArtModalContext";

export default function ArtCard(props) {
  const { src, artist, title, medium, size, year } = props;
  const { openArtwork, openInquiry } = useArtModal();

  const handleCardClick = () => {
    openArtwork(props);
  };

  const handleInquireClick = (e) => {
    e.stopPropagation();
    openInquiry(props);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group hover-lift cursor-pointer flex flex-col transition-all duration-300"
    >
      {/* Image Container */}
      <div className="art-card-img relative aspect-[3/4] overflow-hidden mb-0 bg-[#EFECE6] rounded-sm">
        <Image 
          src={src} 
          alt={title} 
          fill 
          className="object-cover img-zoom" 
        />
        
        {/* Interactive Hover Zoom Pill */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 text-brand-dark text-[0.65rem] tracking-wider uppercase font-sans font-medium shadow backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <FaSearchPlus className="text-brand-accent text-xs" />
            Inspect & Zoom
          </span>
        </div>
      </div>

      {/* Info Block */}
      <div className="px-3 pt-3.5 pb-4 flex-1 flex flex-col justify-between">
        <div>
          <p
            className="text-brand-dark text-xs font-semibold tracking-widest uppercase mb-0.5 truncate"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {artist}
          </p>
          <p
            className="text-brand-charcoal text-sm italic mb-1 line-clamp-1"
            style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}
          >
            {title}
          </p>
          <p className="section-title text-[0.65rem]">
            {medium} {size ? `· ${size}` : ""}
          </p>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            onClick={handleInquireClick}
            className="mt-3 text-brand-accent hover:text-brand-dark transition-colors text-[0.68rem] tracking-widest uppercase border-b border-brand-accent/40 hover:border-brand-dark pb-0.5 font-medium"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Inquire for Quote →
          </button>
        </div>
      </div>
    </div>
  );
}
