"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useToast } from "../../components/ToastProvider";
import { markSessionUnknown } from "../../components/UserContext";

export default function LoginPage() {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res  = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Sign in unsuccessful", data.error || "Please check your email and password, then try again.");
        return;
      }
      toast.success("Welcome back", "Taking you to your collection…");
      markSessionUnknown(); // fresh session — force /api/user/me refetch after redirect
      window.location.href = "/profile";
    } catch { toast.error("Connection problem", "We couldn't reach the studio. Please check your connection and try again."); }
    finally   { setLoading(false); }
  };

  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      <Navbar />

      <section className="min-h-[80vh] flex items-center justify-center px-6 py-16">
        <div style={{ width: "100%", maxWidth: "400px" }}>

          {/* Header */}
          <div className="mb-10">
            <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.5rem" }}>
              Welcome back
            </p>
            <h1 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontWeight: 400, fontSize: "2.2rem", color: "#1C1C1C", lineHeight: 1.1 }}>
              Sign in to your<br /><em style={{ color: "#C9A96E" }}>account.</em>
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B5F55", display: "block", marginBottom: "0.5rem" }}>
                Email
              </label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                style={{ width: "100%", background: "transparent", border: "1px solid #E8DDD0", color: "#1C1C1C", fontSize: "0.95rem", padding: "0.75rem 1rem", outline: "none", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', transition: "border-color 0.2s" }}
                onFocus={e => (e.target.style.borderColor = "#C9A96E")}
                onBlur={e  => (e.target.style.borderColor = "#E8DDD0")}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B5F55", display: "block" }}>
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.68rem", color: "#C9A96E", textDecoration: "none" }}
                  className="hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                style={{ width: "100%", background: "transparent", border: "1px solid #E8DDD0", color: "#1C1C1C", fontSize: "0.95rem", padding: "0.75rem 1rem", outline: "none", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', transition: "border-color 0.2s" }}
                onFocus={e => (e.target.style.borderColor = "#C9A96E")}
                onBlur={e  => (e.target.style.borderColor = "#E8DDD0")}
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-dark py-4 mt-1"
              style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-8" />

          {/* Switch */}
          <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontStyle: "italic", fontSize: "0.95rem", color: "#6B5F55", textAlign: "center" }}>
            Don't have an account?{" "}
            <Link href="/signup" style={{ color: "#C9A96E", textDecoration: "none" }}>
              Create one
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
