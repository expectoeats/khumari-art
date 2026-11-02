"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { FaCheck, FaTimes, FaExclamation, FaInfo } from "react-icons/fa";

const ToastContext = createContext({ toast: null });

const TOAST_DURATION = 4800;

const VARIANTS = {
  success: {
    icon: FaCheck,
    label: "Success",
    tint: "#C9A96E",
    glow: "rgba(201,169,110,0.35)",
  },
  error: {
    icon: FaTimes,
    label: "Error",
    tint: "#E57373",
    glow: "rgba(229,115,115,0.32)",
  },
  warning: {
    icon: FaExclamation,
    label: "Notice",
    tint: "#E8B54D",
    glow: "rgba(232,181,77,0.32)",
  },
  info: {
    icon: FaInfo,
    label: "Info",
    tint: "#B9C6D4",
    glow: "rgba(185,198,212,0.28)",
  },
};

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const push = useCallback(
    (type, message, description = "") => {
      const id = ++idCounter;
      setToasts((prev) => [...prev.slice(-3), { id, type, message, description }]);
      timersRef.current[id] = setTimeout(() => dismiss(id), TOAST_DURATION);
    },
    [dismiss]
  );

  const toast = useRef({
    success: (msg, desc) => push("success", msg, desc),
    error: (msg, desc) => push("error", msg, desc),
    warning: (msg, desc) => push("warning", msg, desc),
    info: (msg, desc) => push("info", msg, desc),
  }).current;

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* ── Luxury Toast Overlay ── */}
      <style>{`
        @keyframes ksToastIn {
          from { opacity: 0; transform: translateX(28px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes ksToastProgress {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
        .ks-toast-card { animation: ksToastIn 0.45s cubic-bezier(0.21, 1.02, 0.73, 1) both; }
        .ks-toast-progress { animation: ksToastProgress ${TOAST_DURATION}ms linear both; transform-origin: left center; }
        @media (max-width: 480px) {
          @keyframes ksToastIn {
            from { opacity: 0; transform: translateY(-14px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        }
      `}</style>

      <div
        className="fixed top-4 sm:top-6 right-3 left-3 sm:left-auto z-[9999] flex flex-col gap-2.5 sm:w-[380px] pointer-events-none"
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((t) => {
          const v = VARIANTS[t.type] || VARIANTS.info;
          const Icon = v.icon;
          return (
            <div
              key={t.id}
              className="ks-toast-card pointer-events-auto relative overflow-hidden rounded-xl border border-[#C9A96E]/25 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.65)]"
              style={{
                background: "linear-gradient(150deg, #1D1813 0%, #241D15 55%, #1A150F 100%)",
              }}
            >
              {/* Gold hairline top edge */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${v.tint}, transparent)`,
                  opacity: 0.7,
                }}
              />

              <div className="flex items-start gap-3.5 p-4 pr-10">
                {/* Icon medallion */}
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${v.glow}, rgba(255,255,255,0.03) 70%)`,
                    border: `1px solid ${v.tint}55`,
                    boxShadow: `0 0 18px -4px ${v.glow}`,
                  }}
                >
                  <Icon className="text-[11px]" style={{ color: v.tint }} />
                </div>

                {/* Copy */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <p
                    className="text-[0.6rem] uppercase tracking-[0.3em] font-sans font-semibold mb-1"
                    style={{ color: v.tint }}
                  >
                    {v.label}
                  </p>
                  <p className="text-[0.83rem] leading-snug text-[#F5F0E8] font-sans font-medium break-words">
                    {t.message}
                  </p>
                  {t.description && (
                    <p className="text-[0.72rem] leading-relaxed text-[#F5F0E8]/55 font-sans mt-1 break-words">
                      {t.description}
                    </p>
                  )}
                </div>

                {/* Close */}
                <button
                  onClick={() => dismiss(t.id)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-[#F5F0E8]/35 hover:text-[#F5F0E8] hover:bg-white/10 transition-colors"
                  aria-label="Dismiss notification"
                >
                  <FaTimes className="text-[9px]" />
                </button>
              </div>

              {/* Draining progress hairline */}
              <div
                className="ks-toast-progress absolute bottom-0 left-0 right-0 h-[2px]"
                style={{
                  background: `linear-gradient(90deg, ${v.tint}, ${v.tint}40)`,
                  opacity: 0.8,
                }}
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context || !context.toast) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
