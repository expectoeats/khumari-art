"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "../../components/Footer";
import ArtCollageSlider from "../../components/ArtCollageSlider";
import { useToast } from "../../components/ToastProvider";
import { markSessionUnknown } from "../../components/UserContext";

export default function LoginPage() {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { toast }             = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/login", {
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
      markSessionUnknown();
      window.location.href = "/profile";
    } catch {
      toast.error("Connection problem", "We couldn't reach the studio. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: "#FDFAF5" }}>
      {/* Minimal Brand Header — No marketing navbar or WhatsApp banner on Login */}
      <header className="w-full max-w-[1380px] mx-auto px-6 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-[#1C1C1C] tracking-[0.22em] uppercase font-light text-xs sm:text-sm hover:text-[#C9A96E] transition-colors"
        >
          Kala Samputah
        </Link>
        <Link
          href="/"
          className="text-[0.7rem] sm:text-[0.72rem] tracking-wider uppercase text-[#8C8276] hover:text-[#1C1C1C] transition-colors flex items-center gap-1.5"
        >
          <span>← Back to Gallery</span>
        </Link>
      </header>

      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12">
        <div className="w-full max-w-[1380px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          
          {/* Left Column: Studio Authentication Portal */}
          <div className="lg:col-span-5 xl:col-span-4 w-full max-w-[440px] mx-auto lg:mx-0">
            
            {/* Mobile Art Showcase (Shown on small screens above form) */}
            <div className="block lg:hidden w-full h-56 sm:h-64 mb-8 rounded-2xl overflow-hidden shadow-sm">
              <ArtCollageSlider />
            </div>

            {/* Header */}
            <div className="mb-8 sm:mb-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#C9A96E" }}>
                  Kala Samputah • Studio Portal
                </p>
              </div>
              <h1 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontWeight: 400, fontSize: "2.3rem", color: "#1C1C1C", lineHeight: 1.15 }}>
                Sign in to your<br /><em style={{ color: "#C9A96E" }}>collection.</em>
              </h1>
              <p className="mt-2 text-xs text-[#6B5F55] leading-relaxed">
                Access your private acquisitions, curated visualizer settings, and bespoke studio commissions.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
              {/* Email */}
              <div>
                <label style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B5F55", display: "block", marginBottom: "0.5rem" }}>
                  Registered Email
                </label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="collector@example.com"
                  style={{ width: "100%", background: "#FFFFFF", border: "1px solid #E8DDD0", color: "#1C1C1C", fontSize: "0.95rem", padding: "0.8rem 1.1rem", borderRadius: "10px", outline: "none", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', transition: "border-color 0.2s, box-shadow 0.2s" }}
                  onFocus={e => {
                    e.target.style.borderColor = "#C9A96E";
                    e.target.style.boxShadow = "0 0 0 3px rgba(201,169,110,0.15)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "#E8DDD0";
                    e.target.style.boxShadow = "none";
                  }}
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
                    className="hover:underline transition-all"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password" required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  style={{ width: "100%", background: "#FFFFFF", border: "1px solid #E8DDD0", color: "#1C1C1C", fontSize: "0.95rem", padding: "0.8rem 1.1rem", borderRadius: "10px", outline: "none", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', transition: "border-color 0.2s, box-shadow 0.2s" }}
                  onFocus={e => {
                    e.target.style.borderColor = "#C9A96E";
                    e.target.style.boxShadow = "0 0 0 3px rgba(201,169,110,0.15)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "#E8DDD0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="btn-dark py-4 mt-2 rounded-xl text-xs uppercase tracking-widest font-semibold"
                style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Authenticating…" : "Sign In to Collection"}
              </button>
            </form>

            {/* Divider */}
            <div className="divider my-7 sm:my-8" />

            {/* Switch */}
            <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontStyle: "italic", fontSize: "0.95rem", color: "#6B5F55", textAlign: "center" }}>
              New to Nancy Sikri Atelier?{" "}
              <Link href="/signup" style={{ color: "#C9A96E", textDecoration: "none", fontStyle: "normal", fontWeight: 600 }} className="hover:underline">
                Create Collector Account
              </Link>
            </p>
          </div>

          {/* Right Column: Mesmerizing Kinetic Art Collage (Desktop) */}
          <div className="hidden lg:block lg:col-span-7 xl:col-span-8 h-[720px] w-full">
            <ArtCollageSlider />
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
