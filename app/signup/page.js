"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function SignupPage() {
  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res  = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Signup failed"); return; }
      window.location.href = "/profile";
    } catch { setError("Network error. Please try again."); }
    finally   { setLoading(false); }
  };

  const field = (key, label, type = "text", placeholder = "") => (
    <div>
      <label style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B5F55", display: "block", marginBottom: "0.5rem" }}>
        {label}
      </label>
      <input
        type={type} required
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        style={{ width: "100%", background: "transparent", border: "1px solid #E8DDD0", color: "#1C1C1C", fontSize: "0.95rem", padding: "0.75rem 1rem", outline: "none", fontFamily: "'Beausite Classic', serif", transition: "border-color 0.2s" }}
        onFocus={e => (e.target.style.borderColor = "#C9A96E")}
        onBlur={e  => (e.target.style.borderColor = "#E8DDD0")}
      />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      <Navbar />

      <section className="min-h-[80vh] flex items-center justify-center px-6 py-16">
        <div style={{ width: "100%", maxWidth: "400px" }}>

          {/* Header */}
          <div className="mb-10">
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.5rem" }}>
              Join the studio
            </p>
            <h1 style={{ fontFamily: "'Beausite Classic', serif", fontWeight: 400, fontSize: "2.2rem", color: "#1C1C1C", lineHeight: 1.1 }}>
              Create your<br /><em style={{ color: "#C9A96E" }}>account.</em>
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {field("name",     "Your name",  "text",     "Nancy Collector")}
            {field("email",    "Email",      "email",    "you@example.com")}
            {field("password", "Password",   "password", "At least 6 characters")}

            {error && (
              <p style={{ fontFamily: "'Beausite Classic', serif", fontStyle: "italic", fontSize: "0.88rem", color: "#c0392b", padding: "0.6rem 0.8rem", background: "rgba(192,57,43,0.05)", border: "1px solid rgba(192,57,43,0.15)" }}>
                {error}
              </p>
            )}

            <button
              type="submit" disabled={loading}
              className="btn-dark py-4 mt-1"
              style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-8" />

          {/* Switch */}
          <p style={{ fontFamily: "'Beausite Classic', serif", fontStyle: "italic", fontSize: "0.95rem", color: "#6B5F55", textAlign: "center" }}>
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
