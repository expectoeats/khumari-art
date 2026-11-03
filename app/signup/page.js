"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useToast } from "../../components/ToastProvider";
import { markSessionUnknown } from "../../components/UserContext";

export default function SignupPage() {
  const [step, setStep]         = useState("form"); // "form" | "otp"
  const [form, setForm]         = useState({ name: "", email: "", password: "" });
  const [otp, setOtp]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();

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
        style={{ width: "100%", background: "transparent", border: "1px solid #E8DDD0", color: "#1C1C1C", fontSize: "0.95rem", padding: "0.75rem 1rem", outline: "none", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', transition: "border-color 0.2s" }}
        onFocus={e => (e.target.style.borderColor = "#C9A96E")}
        onBlur={e  => (e.target.style.borderColor = "#E8DDD0")}
      />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      <Navbar />

      <section className="min-h-[80vh] flex items-center justify-center px-6 py-16">
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Header */}
          <div className="mb-10 text-center sm:text-left">
            <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.5rem" }}>
              {step === "form" ? "Join the studio" : "Security Verification"}
            </p>
            <h1 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontWeight: 400, fontSize: "2.2rem", color: "#1C1C1C", lineHeight: 1.1 }}>
              {step === "form" ? (
                <>Create your<br /><em style={{ color: "#C9A96E" }}>account.</em></>
              ) : (
                <>Verify your<br /><em style={{ color: "#C9A96E" }}>email address.</em></>
              )}
            </h1>
            {step === "otp" && (
              <p className="mt-3 text-xs text-[#6B5F55] leading-relaxed">
                We have sent an authentication passcode to{" "}
                <span className="font-semibold text-[#1C1C1C]">{form.email}</span>. Please enter the 6-digit code below.
              </p>
            )}
          </div>

          {/* Step 1: Initial Form */}
          {step === "form" ? (
            <form onSubmit={handleRequestOtp} className="flex flex-col gap-5">
              {field("name",     "Your name",  "text",     "Nancy Collector")}
              {field("email",    "Email",      "email",    "you@example.com")}
              {field("password", "Password",   "password", "At least 6 characters")}

              <button
                type="submit" disabled={loading}
                className="btn-dark py-4 mt-2"
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
                    fontSize: "1.6rem",
                    letterSpacing: "0.45em",
                    textAlign: "center",
                    fontWeight: "600",
                    padding: "0.75rem 1rem",
                    outline: "none",
                    fontFamily: "monospace",
                    boxShadow: "0 2px 10px rgba(201,169,110,0.15)",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>

              <button
                type="submit" disabled={loading || otp.length !== 6}
                className="btn-dark py-4 mt-1"
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
          <div className="divider my-8" />

          {/* Switch */}
          <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontStyle: "italic", fontSize: "0.95rem", color: "#6B5F55", textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#C9A96E", textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
