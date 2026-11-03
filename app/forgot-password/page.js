"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useToast } from "../../components/ToastProvider";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const roleParam    = searchParams.get("role") || "";

  const [step, setStep]                     = useState("email"); // "email" | "reset" | "complete"
  const [email, setEmail]                   = useState(initialEmail);
  const [otp, setOtp]                       = useState("");
  const [newPassword, setNewPassword]       = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRole, setUserRole]             = useState(roleParam || "user");
  const [loading, setLoading]               = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();

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
    if (!email.trim()) {
      toast.error("Email Required", "Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request-otp",
          email: email.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Request Failed", data.error || "No matching account was found with this email.");
        return;
      }

      if (data.role) setUserRole(data.role);
      toast.success("Security Code Dispatched", `A 6-digit verification code has been sent to ${email.trim()}.`);
      setStep("reset");
      setResendCooldown(60);
    } catch {
      toast.error("Connection problem", "We couldn't connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      toast.error("Invalid Code", "Please enter the 6-digit code received on your email.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("Weak Password", "New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Password Mismatch", "Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-password",
          email: email.trim(),
          otp: otp.trim(),
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Reset Failed", data.error || "Invalid or expired verification code.");
        return;
      }

      if (data.role) setUserRole(data.role);
      toast.success("Password Updated", "Your password has been reset successfully.");
      setStep("complete");
    } catch {
      toast.error("Connection problem", "Failed to communicate with the studio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loginRedirectPath = userRole === "admin" ? "/admin/login" : "/login";

  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      <Navbar />

      <section className="min-h-[80vh] flex items-center justify-center px-6 py-16">
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Header */}
          <div className="mb-10 text-center sm:text-left">
            <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.5rem" }}>
              {userRole === "admin" ? "Studio Atelier Recovery" : "Collector Security"}
            </p>
            <h1 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontWeight: 400, fontSize: "2.2rem", color: "#1C1C1C", lineHeight: 1.1 }}>
              {step === "complete" ? (
                <>Password<br /><em style={{ color: "#C9A96E" }}>restored.</em></>
              ) : step === "reset" ? (
                <>Set new<br /><em style={{ color: "#C9A96E" }}>password.</em></>
              ) : (
                <>Forgot your<br /><em style={{ color: "#C9A96E" }}>password?</em></>
              )}
            </h1>
            <p className="mt-3 text-xs text-[#6B5F55] leading-relaxed">
              {step === "complete"
                ? "Your credentials have been securely updated. You can now access your account with your new password."
                : step === "reset"
                ? `Enter the 6-digit code sent to ${email} and choose your new password.`
                : "Enter your registered email address. We will send you a 6-digit security code to verify and reset your access."}
            </p>
          </div>

          {/* Step 1: Request Reset Code */}
          {step === "email" && (
            <form onSubmit={handleRequestOtp} className="flex flex-col gap-5">
              <div>
                <label style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B5F55", display: "block", marginBottom: "0.5rem" }}>
                  Registered Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "1px solid #E8DDD0",
                    color: "#1C1C1C",
                    fontSize: "0.95rem",
                    padding: "0.75rem 1rem",
                    outline: "none",
                    fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#C9A96E")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8DDD0")}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-dark py-4 mt-2"
                style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Sending verification code…" : "Send Reset Code"}
              </button>

              <div className="pt-2 text-center">
                <Link
                  href={loginRedirectPath}
                  className="text-xs text-[#6B5F55] hover:text-[#1C1C1C] transition-colors underline underline-offset-4"
                >
                  ← Back to Sign In
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: Verification Code + New Password */}
          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
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

              <div>
                <label style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B5F55", display: "block", marginBottom: "0.5rem" }}>
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "1px solid #E8DDD0",
                    color: "#1C1C1C",
                    fontSize: "0.95rem",
                    padding: "0.75rem 1rem",
                    outline: "none",
                    fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#C9A96E")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8DDD0")}
                />
              </div>

              <div>
                <label style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B5F55", display: "block", marginBottom: "0.5rem" }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "1px solid #E8DDD0",
                    color: "#1C1C1C",
                    fontSize: "0.95rem",
                    padding: "0.75rem 1rem",
                    outline: "none",
                    fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#C9A96E")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8DDD0")}
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="btn-dark py-4 mt-2"
                style={{
                  opacity: loading || otp.length !== 6 ? 0.6 : 1,
                  cursor: loading || otp.length !== 6 ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Resetting password…" : "Confirm & Save Password"}
              </button>

              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-[#6B5F55] hover:text-[#1C1C1C] transition-colors underline underline-offset-4"
                >
                  ← Change email
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

          {/* Step 3: Success Screen */}
          {step === "complete" && (
            <div className="flex flex-col gap-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/30 flex items-center justify-center mx-auto text-[#C9A96E] text-2xl">
                ✓
              </div>
              <p className="text-sm text-[#4A4036] leading-relaxed">
                Your password has been safely updated. You can now use your new password to sign into the atelier.
              </p>
              <Link
                href={loginRedirectPath}
                className="btn-dark py-4 text-center block text-decoration-none"
              >
                Sign In Now →
              </Link>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFAF5]" />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
