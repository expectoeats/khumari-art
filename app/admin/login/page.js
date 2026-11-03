"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "../../../components/ToastProvider";

export default function AdminLogin() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const from         = searchParams.get("from") || "/admin/dashboard";

  const [form, setForm]   = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Sign in unsuccessful", data.error || "Please check your email and password, then try again.");
        return;
      }
      toast.success("Welcome back", "Entering the studio dashboard…");
      // Hard redirect so middleware picks up the new cookie
      window.location.href = from;
    } catch {
      toast.error("Connection problem", "We couldn't reach the studio. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0F0F0F", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      <div style={{ width: "100%", maxWidth: "380px", padding: "0 1.5rem" }}>

        {/* Brand */}
        <div className="text-center mb-10">
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.4rem" }}>
            Kala Samputah
          </p>
          <h1 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontWeight: 400, fontSize: "1.8rem", color: "#F5F0E8" }}>
            Admin
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", display: "block", marginBottom: "0.5rem" }}>
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              style={{
                width: "100%",
                background: "rgba(245,240,232,0.05)",
                border: "1px solid rgba(245,240,232,0.1)",
                color: "#F5F0E8",
                fontSize: "0.9rem",
                padding: "0.75rem 1rem",
                outline: "none",
                borderRadius: "6px",
                fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", display: "block" }}>
                Password
              </label>
              <Link
                href="/forgot-password?role=admin"
                style={{ fontSize: "0.68rem", color: "#C9A96E", textDecoration: "none" }}
                className="hover:underline opacity-80 hover:opacity-100"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              style={{
                width: "100%",
                background: "rgba(245,240,232,0.05)",
                border: "1px solid rgba(245,240,232,0.1)",
                color: "#F5F0E8",
                fontSize: "0.9rem",
                padding: "0.75rem 1rem",
                outline: "none",
                borderRadius: "6px",
                fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.5rem",
              background: loading ? "rgba(201,169,110,0.4)" : "#C9A96E",
              color: "#111010",
              border: "none",
              borderRadius: "6px",
              padding: "0.8rem",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
              transition: "background 0.2s",
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
