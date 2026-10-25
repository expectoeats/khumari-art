"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Fetch profile once on mount
  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me");
        if (mounted && res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        } else if (mounted) {
          setUser(null);
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
