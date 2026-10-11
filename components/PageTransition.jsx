"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Wraps page content with a subtle fade-in on every route change.
 * Uses a key-based remount trick so the animation re-fires on navigation.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname();
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    // Restart the animation every time the route changes
    ref.current.style.animation = "none";
    // Force reflow
    void ref.current.offsetHeight;
    ref.current.style.animation = "";
  }, [pathname]);

  return (
    <div
      ref={ref}
      style={{
        animation: "pageFadeIn 0.35s ease-out forwards",
      }}
    >
      {children}
    </div>
  );
}
