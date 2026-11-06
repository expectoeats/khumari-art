"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "../../components/Footer";
import ArtCollageSlider from "../../components/ArtCollageSlider";
import { useToast } from "../../components/ToastProvider";
import { markSessionUnknown } from "../../components/UserContext";

export default function SignupPage() {
  const [step, setStep]                     = useState("form"); // "form" | "otp"
  const [form, setForm]                     = useState({ name: "", email: "", password: "" });
  const [otp, setOtp]                       = useState("");
  const [loading, setLoading]               = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast }                           = useToast();

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error("Incomplete Details", "Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request-otp",
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Could not register", data.error || "Please review your details and try again.");
        return;
      }
      toast.success("Verification Code Sent", `A 6-digit code has been sent to ${form.email.trim()}.`);
      setStep("otp");
      setResendCooldown(60);
    } catch {
      toast.error("Connection problem", "We couldn't reach the studio. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      toast.error("Invalid Code", "Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify-otp",
          email: form.email.trim(),
          otp: otp.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Verification failed", data.error || "Invalid or expired code.");
        return;
      }
      toast.success("Welcome to Kala Samputah", "Your account is verified and ready. Explore your collection…");
      markSessionUnknown();
      window.location.href = "/profile";
    } catch {
      toast.error("Connection problem", "We couldn't reach the studio. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, type = "text", placeholder = "") => (
    <div>
      <label style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B5F55", display: "block", marginBottom: "0.5rem" }}>
        {label}
      </label>
      <input
        type={type} required
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
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
  );

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: "#FDFAF5" }}>
      {/* Minimal Brand Header — No marketing navbar or WhatsApp banner on Signup */}
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

          {/* Left Column: Registration & Security Form */}
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
                  {step === "form" ? "Join The Atelier Studio" : "Security Verification"}
                </p>
              </div>
              <h1 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontWeight: 400, fontSize: "2.3rem", color: "#1C1C1C", lineHeight: 1.15 }}>
                {step === "form" ? (
                  <>Create your<br /><em style={{ color: "#C9A96E" }}>account.</em></>
                ) : (
                  <>Verify your<br /><em style={{ color: "#C9A96E" }}>email address.</em></>
                )}
              </h1>
              <p className="mt-2 text-xs text-[#6B5F55] leading-relaxed">
                {step === "form"
                  ? "Join our circle of collectors to access exclusive private viewings, tailored room visualizers, and artist commissions."
                  : (
                    <>
                      We have sent an authentication passcode to{" "}
                      <span className="font-semibold text-[#1C1C1C]">{form.email}</span>. Please enter the 6-digit code below.
                    </>
                  )}
              </p>
            </div>

            {/* Step 1: Initial Form */}
            {step === "form" ? (
              <form onSubmit={handleRequestOtp} className="flex flex-col gap-4 sm:gap-5">
                {field("name",     "Full name",  "text",     "Nancy Collector")}
                {field("email",    "Email address", "email",  "collector@example.com")}
                {field("password", "Password",   "password", "At least 6 characters")}

                <button
                  type="submit" disabled={loading}
                  className="btn-dark py-4 mt-2 rounded-xl text-xs uppercase tracking-widest font-semibold"
                  style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Sending verification code…" : "Continue with Email Verification"}
                </button>
              </form>
            ) : (
              /* Step 2: 6-digit OTP Verification */
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                <div>
                  <label style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B5F55", display: "block", marginBottom: "0.5rem" }}>
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    style={{
                      width: "100%",
                      background: "#FFFFFF",
                      border: "1.5px solid #C9A96E",
                      color: "#1C1C1C",
                      fontSize: "1.7rem",
                      letterSpacing: "0.45em",
                      textAlign: "center",
                      fontWeight: "600",
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      outline: "none",
                      fontFamily: "monospace",
                      boxShadow: "0 4px 14px rgba(201,169,110,0.18)",
                    }}
                  />
                </div>

                <button
                  type="submit" disabled={loading || otp.length !== 6}
                  className="btn-dark py-4 mt-1 rounded-xl text-xs uppercase tracking-widest font-semibold"
                  style={{
                    opacity: loading || otp.length !== 6 ? 0.6 : 1,
                    cursor: loading || otp.length !== 6 ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Verifying…" : "Verify & Activate Account"}
                </button>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="text-[#6B5F55] hover:text-[#1C1C1C] transition-colors underline underline-offset-4"
                  >
                    ← Edit details
                  </button>

                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={() => handleRequestOtp()}
                    className={`font-medium transition-colors ${
                      resendCooldown > 0
                        ? "text-[#A89F95] cursor-not-allowed"
                        : "text-[#C9A96E] hover:text-[#B39356]"
                    }`}
                  >
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
                  </button>
                </div>
              </form>
            )}

            {/* Divider */}
            <div className="divider my-7 sm:my-8" />

            {/* Switch */}
            <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontStyle: "italic", fontSize: "0.95rem", color: "#6B5F55", textAlign: "center" }}>
              Already a studio collector?{" "}
              <Link href="/login" style={{ color: "#C9A96E", textDecoration: "none", fontStyle: "normal", fontWeight: 600 }} className="hover:underline">
                Sign in
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
