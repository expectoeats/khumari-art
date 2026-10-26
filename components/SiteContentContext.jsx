"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { heroSlides } from "./data";

const DEFAULT_CONTENT = {
  hero: {
    slides: heroSlides,
  },
  artist: {
    name: "Nancy Sikri",
    title: "Abstract Painter · New Delhi, India",
    photo: "/art/811266960_18115098530070803_4087374646249167423_n.jpg",
    quote: "I don't paint what I see. I paint what I feel.",
    bio1: "Art chose Nancy long before she chose it. Growing up surrounded by creative energy, she found her voice in abstract expression — a language beyond words.",
    bio2: "Every canvas she creates is an invitation: to pause, feel, and discover something honest within yourself. Her work lives in the space between emotion and instinct.",
    stats: [
      { value: "256", label: "Original Works" },
      { value: "6.9k", label: "Followers" },
      { value: "7+", label: "Years Creating" },
    ],
    instagram: "https://www.instagram.com/kala_samputah",
  },
  announcement: {
    text: "New collection available — Inquire for pricing",
    whatsappNumber: "919818817291",
    studioEmail: "contact@kalasamputah.com",
    isVisible: true,
  },
  contact: {
    whatsappNumber: "919818817291",
    studioEmail: "contact@kalasamputah.com",
  },
  story: {
    title: "The Art of Raw Emotion",
    subtitle: "Story of the day",
    quote: "Every painting is a quiet conversation between the canvas and whatever cannot be put into words.",
    artworkTitle: "Embracing the Void Within",
    src: "/art/823606039_18116134385070803_3865341406544213906_n.jpg",
  },
};

const SiteContentContext = createContext({
  content: DEFAULT_CONTENT,
  loaded: false,
  refreshContent: () => {},
});

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setContent(prev => ({
            ...prev,
            ...data.content,
            contact: {
              whatsappNumber: data.content.announcement?.whatsappNumber || data.content.contact?.whatsappNumber || prev.contact.whatsappNumber,
              studioEmail: data.content.announcement?.studioEmail || data.content.contact?.studioEmail || prev.contact.studioEmail,
            },
          }));
        }
      }
    } catch {
      // Silently fall back to DEFAULT_CONTENT
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return (
    <SiteContentContext.Provider value={{ content, loaded, refreshContent: fetchContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
