"use client";

import { createContext, useContext, useState } from "react";
import ArtworkDetailModal from "./ArtworkDetailModal";
import InquiryModal from "./InquiryModal";

const ArtModalContext = createContext({
  openArtwork: () => {},
  openInquiry: () => {},
  closeAll: () => {},
});

export function ArtModalProvider({ children }) {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [inquiryArtwork, setInquiryArtwork] = useState(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const openArtwork = (artwork) => {
    setSelectedArtwork(artwork);
    setIsArtworkModalOpen(true);
  };

  const openInquiry = (artwork) => {
    setInquiryArtwork(artwork);
    setIsInquiryModalOpen(true);
  };

  const closeAll = () => {
    setIsArtworkModalOpen(false);
    setIsInquiryModalOpen(false);
  };

  return (
    <ArtModalContext.Provider value={{ openArtwork, openInquiry, closeAll }}>
      {children}
      
      {/* Global Interactive Artwork Detail Viewer with Lens Zoom */}
      <ArtworkDetailModal
        isOpen={isArtworkModalOpen}
        artwork={selectedArtwork}
        onClose={() => setIsArtworkModalOpen(false)}
        onInquire={(art) => openInquiry(art || selectedArtwork)}
      />

      {/* Global Price Quote & Acquisition Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        artwork={inquiryArtwork}
        onClose={() => setIsInquiryModalOpen(false)}
      />
    </ArtModalContext.Provider>
  );
}

export function useArtModal() {
  const context = useContext(ArtModalContext);
  if (!context) {
    throw new Error("useArtModal must be used within an ArtModalProvider");
  }
  return context;
}
