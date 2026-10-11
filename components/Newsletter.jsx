"use client";

import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export default function Newsletter() {
  const [email, setEmail]       = useState("");
  const [status, setStatus]     = useState("idle"); // idle | success | error

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    // Opens mail client with pre-filled subscription request
    window.location.href = `mailto:ratulm28@gmail.com?subject=Newsletter%20Subscription&body=Please%20add%20me%20to%20your%20mailing%20list.%0A%0AEmail%3A%20${encodeURIComponent(email)}`;
    setStatus("success");
    setEmail("");
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#1C1C1C" }}
    >
      {/* Faint large watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 400,
            fontSize: "clamp(8rem, 28vw, 22rem)",
            color: "rgba(245,240,232,0.025)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
          }}
        >
          Stay
        </span>
      </div>

      {/* Gold top rule */}
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(201,169,110,0.35), transparent)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Left */}
          <div>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.6rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#C9A96E",
                marginBottom: "1.2rem",
              }}
            >
              Studio Updates
            </p>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontWeight: 400,
                fontSize: "clamp(2rem, 5vw, 4rem)",
                lineHeight: 1.05,
                color: "#F5F0E8",
                letterSpacing: "0.01em",
              }}
            >
              New work, when it<br />
              <em style={{ color: "#C9A96E" }}>arrives.</em>
            </h2>
            <p
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: "1rem",
                color: "rgba(245,240,232,0.35)",
                marginTop: "1.2rem",
                lineHeight: 1.7,
                maxWidth: "36ch",
              }}
            >
              No newsletters for the sake of it. Only when something
              real comes out of the studio — new works, commissions opening,
              or a story worth telling.
            </p>
          </div>

          {/* Right — form */}
          <div>
            {status === "success" ? (
              <div
                style={{
                  border: "1px solid rgba(201,169,110,0.25)",
                  padding: "2.5rem",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    fontSize: "1.2rem",
                    color: "#C9A96E",
                    marginBottom: "0.5rem",
                  }}
                >
                  Thank you.
                </p>
                <p
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "0.9rem",
                    color: "rgba(245,240,232,0.4)",
                  }}
                >
                  Your mail client will open to complete the subscription.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <label
                  htmlFor="newsletter-email"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(245,240,232,0.3)",
                    display: "block",
                    marginBottom: "0.8rem",
                  }}
                >
                  Your email address
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setStatus("idle");
                    }}
                    placeholder="you@example.com"
                    required
                    style={{
                      flex: 1,
                      background: "rgba(245,240,232,0.05)",
                      border: `1px solid ${status === "error" ? "#C9A96E" : "rgba(245,240,232,0.12)"}`,
                      color: "#F5F0E8",
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: "1rem",
                      padding: "0.9rem 1.2rem",
                      outline: "none",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(201,169,110,0.5)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor =
                        status === "error"
                          ? "#C9A96E"
                          : "rgba(245,240,232,0.12)")
                    }
                  />
                  <button
                    type="submit"
                    className="btn-dark inline-flex items-center justify-center gap-2 px-8 py-3.5 flex-shrink-0"
                    style={{ background: "#C9A96E", color: "#111010" }}
                  >
                    Subscribe
                    <FaArrowRight className="text-[10px]" />
                  </button>
                </div>

                {status === "error" && (
                  <p
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontStyle: "italic",
                      fontSize: "0.82rem",
                      color: "rgba(201,169,110,0.7)",
                      marginTop: "0.6rem",
                    }}
                  >
                    Please enter a valid email address.
                  </p>
                )}

                <p
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    fontSize: "0.78rem",
                    color: "rgba(245,240,232,0.2)",
                    marginTop: "1rem",
                  }}
                >
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Gold bottom rule */}
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(201,169,110,0.35), transparent)",
        }}
      />
    </section>
  );
}
