"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const UserContext = createContext(null);

// Session cache: avoids a /api/user/me round-trip on every page navigation.
// The cache is explicitly cleared/refreshed on login, logout and profile saves.
const USER_KEY = "ks_cached_user";
const SKIP_KEY = "ks_session_none";

function readCachedUser() {
  try {
    if (typeof window === "undefined") return null; // SSR-safe guard
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function markSessionUnknown() {
  try { sessionStorage.removeItem(SKIP_KEY); sessionStorage.removeItem(USER_KEY); } catch {}
}

function cacheUser(user) {
  try {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user || null));
    if (user) sessionStorage.removeItem(SKIP_KEY);
    else sessionStorage.setItem(SKIP_KEY, "1");
  } catch {}
}

export function UserProvider({ children }) {
  // Always start with null/false on first render (SSR-safe — sessionStorage not available on server)
  // Cache is applied in useEffect (client-only) to avoid hydration mismatch.
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Fetch profile once on mount (skipped when this tab already knows the answer)
  useEffect(() => {
    let mounted = true;

    // Check cache first (client-only)
    const cachedUser = readCachedUser();
    let skipFetch = false;
    try {
      skipFetch = !!cachedUser || sessionStorage.getItem(SKIP_KEY) === "1";
    } catch {}

    if (skipFetch) {
      if (cachedUser) setUser(cachedUser);
      setLoaded(true);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me");
        if (mounted && res.ok) {
          const data = await res.json();
          const u = data.user || null;
          setUser(u);
          cacheUser(u);
        } else if (mounted) {
          setUser(null);
          cacheUser(null);
        }
      } catch { if (mounted) setUser(null); } finally { if (mounted) setLoaded(true); }
    };
    fetchUser();
    return () => { mounted = false; };
  }, []);

  // Update profile fields on server + local state
  const updateProfile = useCallback(async (fields) => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      setUser(data.user);
      cacheUser(data.user);
      return { ok: true, user: data.user };
    } catch (err) {
      console.error("[updateProfile]", err);
      return { ok: false, error: err.message || "Update failed" };
    }
  }, []);

  const value = { user, loaded, updateProfile };
  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
