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

// Per-tab cache of the merged site content, so in-tab page transitions don't
// refetch /api/content every time. Admin saves call refreshContent() explicitly.
const CONTENT_KEY = "ks_cached_content";

function mergeContent(prev, raw) {
  return {
    ...prev,
    ...raw,
    contact: {
      whatsappNumber: raw.announcement?.whatsappNumber || raw.contact?.whatsappNumber || prev.contact.whatsappNumber,
      studioEmail: raw.announcement?.studioEmail || raw.contact?.studioEmail || prev.contact.studioEmail,
    },
  };
}

function readCachedContent() {
  try {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(CONTENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function SiteContentProvider({ children }) {
  // Always start with DEFAULT_CONTENT on first render (same on server & client)
  // to avoid React hydration mismatch. Cache is applied in useEffect (client-only).
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setContent((prev) => {
            const merged = mergeContent(prev, data.content);
            try { sessionStorage.setItem(CONTENT_KEY, JSON.stringify(data.content)); } catch {}
            return merged;
          });
        }
      }
    } catch {
      // Silently fall back to DEFAULT_CONTENT (or the cached snapshot)
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    // On mount (client-only), first apply any sessionStorage cache
    const cached = readCachedContent();
    if (cached) {
      setContent((prev) => mergeContent(prev, cached));
      setLoaded(true);
      return; // already hydrated; skip network round-trip
    }
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
