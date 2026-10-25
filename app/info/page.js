"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaArrowRight, FaInstagram, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

// ── Inline contact form ───────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm]     = useState({ name: "", email: "", message: "" });
  const [sent, setSent]     = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Please enter your name.";
    if (!form.email.includes("@")) e.email = "Please enter a valid email.";
    if (!form.message.trim()) e.message = "Please write a message.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      await fetch("/api/inquiries", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    form.name,
          email:   form.email,
          message: form.message,
          source:  "contact_form",
        }),
      });
    } catch (err) {
      console.error("[CONTACT FORM]", err);
    }
    // Also open mail client as fallback
    const subject = encodeURIComponent(`Studio Inquiry from ${form.name}`);
    const body    = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:ratulm28@gmail.com?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
  };

  const field = (id, label, type = "text", rows) => (
    <div key={id}>
      <label
        htmlFor={id}
        style={{
          fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: "0.58rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(245,240,232,0.35)",
          display: "block",
          marginBottom: "0.5rem",
        }}
      >
        {label}
      </label>
      {rows ? (
        <textarea
          id={id}
          rows={rows}
          value={form[id]}
          onChange={(e) => { setForm(f => ({ ...f, [id]: e.target.value })); setErrors(er => ({ ...er, [id]: "" })); }}
          style={{
            width: "100%",
            background: "rgba(245,240,232,0.05)",
            border: `1px solid ${errors[id] ? "#C9A96E" : "rgba(245,240,232,0.1)"}`,
            color: "#F5F0E8",
            fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: "1rem",
            padding: "0.8rem 1rem",
            outline: "none",
            resize: "vertical",
            lineHeight: 1.7,
          }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={form[id]}
          onChange={(e) => { setForm(f => ({ ...f, [id]: e.target.value })); setErrors(er => ({ ...er, [id]: "" })); }}
          style={{
            width: "100%",
            background: "rgba(245,240,232,0.05)",
            border: `1px solid ${errors[id] ? "#C9A96E" : "rgba(245,240,232,0.1)"}`,
            color: "#F5F0E8",
            fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: "1rem",
            padding: "0.8rem 1rem",
            outline: "none",
          }}
        />
      )}
      {errors[id] && (
        <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontStyle: "italic", fontSize: "0.8rem", color: "rgba(201,169,110,0.7)", marginTop: "0.35rem" }}>
          {errors[id]}
        </p>
      )}
    </div>
  );

  if (sent) {
    return (
      <div style={{ border: "1px solid rgba(201,169,110,0.2)", padding: "2.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontStyle: "italic", fontSize: "1.2rem", color: "#C9A96E", marginBottom: "0.5rem" }}>
          Message sent.
        </p>
        <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "0.9rem", color: "rgba(245,240,232,0.35)" }}>
          Your mail client will open to complete delivery. Nancy usually responds within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {field("name",    "Your name")}
      {field("email",   "Your email", "email")}
      {field("message", "Your message", "text", 5)}
      <button
        type="submit"
        className="btn-dark inline-flex items-center justify-center gap-2 px-10 py-4 mt-2"
        style={{ background: "#C9A96E", color: "#111010" }}
      >
        Send message
        <FaArrowRight className="text-[10px]" />
      </button>
    </form>
  );
}

const faqs = [
  {
    q: "How do I inquire about purchasing a work?",
    a: "Send an email to ratulm28@gmail.com with the title of the piece you're interested in. All works are sold by inquiry — no cart, no checkout. Just a conversation.",
  },
  {
    q: "Are commissions available?",
    a: "Yes. Commissioned works are available year-round. The process begins with a conversation about scale, palette, and what you're hoping the piece will do in its space.",
  },
  {
    q: "Do you ship internationally?",
    a: "Paintings are shipped carefully rolled or stretched, depending on size. International shipping is available. Costs and timelines are discussed during the inquiry process.",
  },
  {
    q: "What materials do you work with?",
    a: "Primarily acrylic on canvas. Some works incorporate oil pastel, charcoal, and raw pigment. Materials are listed individually for each piece.",
  },
  {
    q: "Can I visit the studio?",
    a: "Studio visits in New Delhi are possible by appointment. Reach out via email to arrange.",
  },
];

const steps = [
  { n: "01", title: "Reach out", body: "Email ratulm28@gmail.com with the piece you're interested in, or describe what you have in mind for a commission." },
  { n: "02", title: "Conversation", body: "We'll talk — about the work, your space, what you want the piece to feel like. No pressure, no pitch." },
  { n: "03", title: "Agreement", body: "Pricing, timeline, and any commission specifics are agreed upon. A 50% deposit secures the work or begins the commission." },
  { n: "04", title: "Delivery", body: "The work is carefully packed and shipped. Original works come with a certificate of authenticity and care instructions." },
];

export default function InfoPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "340px", height: "42vh" }}
      >
        <Image
          src="/art/813661180_18115305131070803_8784916059366770496_n.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(10, 8, 6, 0.55)" }}
        />
        <div className="absolute bottom-8 left-8 md:left-12 z-10">
          <h1
            style={{
              fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif',
              fontWeight: 400,
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              color: "#F5F0E8",
              letterSpacing: "0.02em",
              lineHeight: 1.1,
            }}
          >
            Info
          </h1>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="process" className="py-16 md:py-24 px-6 md:px-10 scroll-mt-20" style={{ background: "#F5F0E8" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16">
            <p className="section-title mb-2">Process</p>
            <h2 style={{
              fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif',
              fontWeight: 300,
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "#1C1C1C",
              letterSpacing: "0.03em",
            }}>
              How collecting works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {steps.map((step, i) => (
              <div
                key={step.n}
                className={`group relative px-0 md:px-8 py-8 
                  ${i > 0 ? "border-t border-[#E8DDD0] md:border-t-0 md:border-l md:border-[#E8DDD0]" : ""}`}
              >
                <p style={{
                  fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 300,
                  fontSize: "3rem",
                  color: "rgba(201,169,110,0.25)",
                  lineHeight: 1,
                  marginBottom: "1.2rem",
                }}>
                  {step.n}
                </p>
                <h3 style={{
                  fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif',
                  fontWeight: 500,
                  fontSize: "1.15rem",
                  color: "#1C1C1C",
                  marginBottom: "0.6rem",
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: "0.95rem",
                  lineHeight: 1.75,
                  color: "#6B5F55",
                }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-16 md:py-24 px-6 md:px-10 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <p className="section-title mb-2 text-center">FAQ</p>
          <h2 className="text-center mb-12 md:mb-16" style={{
            fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif',
            fontWeight: 300,
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            color: "#1C1C1C",
          }}>
            Common questions
          </h2>

          <div style={{ borderTop: "1px solid #E8DDD0" }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{ borderBottom: "1px solid #E8DDD0" }}
              >
                <button
                  className="w-full text-left flex items-start justify-between gap-6 py-6"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <p style={{
                    fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: openFaq === i ? 500 : 400,
                    fontSize: "1.1rem",
                    color: openFaq === i ? "#1C1C1C" : "#2A2A2A",
                    lineHeight: 1.4,
                    transition: "color 0.2s ease",
                  }}>
                    {faq.q}
                  </p>
                  <span style={{
                    flexShrink: 0,
                    width: "1.4rem",
                    height: "1.4rem",
                    border: "1px solid #E8DDD0",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "0.15rem",
                    transition: "transform 0.3s ease, border-color 0.3s ease",
                    transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                    borderColor: openFaq === i ? "#C9A96E" : "#E8DDD0",
                  }}>
                    <FaArrowRight style={{
                      fontSize: "0.45rem",
                      color: openFaq === i ? "#C9A96E" : "#8B7355",
                      transform: openFaq === i ? "rotate(0deg)" : "rotate(-45deg)",
                      transition: "transform 0.3s ease, color 0.3s ease",
                    }} />
                  </span>
                </button>

                {openFaq === i && (
                  <p className="font-sans font-light text-[0.98rem] text-[#6B5F55] leading-[1.8] pb-6 pr-8">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-16 md:py-24 px-6 md:px-10 border-t border-brand-sand/50 scroll-mt-20" style={{ background: "#1C1C1C" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          <div>
            <p style={{
              fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: "0.62rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#8B7355",
              marginBottom: "1.2rem",
            }}>
              Get in touch
            </p>
            <h2 style={{
              fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif',
              fontWeight: 300,
              fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
              lineHeight: 1.1,
              color: "#F5F0E8",
              marginBottom: "2rem",
            }}>
              A painting is waiting<br />
              <em style={{ color: "#C9A96E" }}>for its right person.</em>
            </h2>

            <div className="flex flex-col gap-4">
              {[
                { Icon: FaEnvelope,     text: "ratulm28@gmail.com",  href: "mailto:ratulm28@gmail.com" },
                { Icon: FaInstagram,    text: "@kala_samputah",      href: "https://www.instagram.com/kala_samputah" },
                { Icon: FaMapMarkerAlt, text: "New Delhi, India",    href: null },
              ].map(({ Icon, text, href }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon style={{ color: "#C9A96E", fontSize: "0.8rem", flexShrink: 0 }} />
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: "1rem",
                        color: "rgba(245,240,232,0.5)",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = "#C9A96E"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(245,240,232,0.5)"}
                    >
                      {text}
                    </a>
                  ) : (
                    <span style={{
                      fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: "1rem",
                      color: "rgba(245,240,232,0.35)",
                    }}>
                      {text}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right — contact form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
