"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaArrowRight, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaCheckCircle, FaWhatsapp } from "react-icons/fa";

// ── Inline contact form ───────────────────────────────────────────────────────
function ContactForm({ studioEmail, whatsappNumber }) {
  const [form, setForm]         = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent]         = useState(false);
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.includes("@")) e.email = "Please enter a valid email address.";
    if (!form.message.trim()) e.message = "Please write a message or inquiry detail.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    form.name.trim(),
          email:   form.email.trim(),
          phone:   form.phone.trim(),
          message: form.message.trim(),
          source:  "contact_form",
        }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        setErrors({ general: "Unable to submit inquiry at this moment. Please try again or reach out on WhatsApp." });
      }
    } catch (err) {
      console.error("[CONTACT FORM]", err);
      setErrors({ general: "Network error. Please try again or reach out directly on WhatsApp." });
    } finally {
      setSubmitting(false);
    }
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
          placeholder="Tell us about the artwork or commissioned piece you are interested in..."
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
            borderRadius: "6px",
          }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={form[id]}
          onChange={(e) => { setForm(f => ({ ...f, [id]: e.target.value })); setErrors(er => ({ ...er, [id]: "" })); }}
          placeholder={id === "name" ? "Your full name" : id === "email" ? "e.g. yourname@domain.com" : "+91..."}
          style={{
            width: "100%",
            background: "rgba(245,240,232,0.05)",
            border: `1px solid ${errors[id] ? "#C9A96E" : "rgba(245,240,232,0.1)"}`,
            color: "#F5F0E8",
            fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: "1rem",
            padding: "0.8rem 1rem",
            outline: "none",
            borderRadius: "6px",
          }}
        />
      )}
      {errors[id] && (
        <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontStyle: "italic", fontSize: "0.8rem", color: "rgba(201,169,110,0.9)", marginTop: "0.35rem" }}>
          {errors[id]}
        </p>
      )}
    </div>
  );

  if (sent) {
    const waText = encodeURIComponent(`Hello Nancy / Kala Samputah,\nI submitted a message through your website studio contact form.\n\nName: ${form.name}\nEmail: ${form.email}`);
    return (
      <div 
        className="rounded-xl p-8 sm:p-10 text-center"
        style={{
          background: "rgba(201, 169, 110, 0.08)",
          border: "1px solid rgba(201, 169, 110, 0.3)",
        }}
      >
        <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4" style={{ background: "rgba(201, 169, 110, 0.2)" }}>
          <FaCheckCircle className="text-2xl text-[#C9A96E]" />
        </div>
        <h3
          style={{
            fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif',
            fontSize: "1.6rem",
            color: "#F5F0E8",
            marginBottom: "0.6rem",
          }}
        >
          Message Received
        </h3>
        <p
          style={{
            fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: "0.95rem",
            color: "rgba(245,240,232,0.7)",
            lineHeight: 1.6,
            maxWidth: "36ch",
            margin: "0 auto 1.5rem auto",
          }}
        >
          Thank you, <strong className="text-white">{form.name}</strong>. Nancy Sikri reviews studio inquiries personally and usually responds within 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all"
            style={{ background: "#25D366", color: "#FFFFFF" }}
          >
            <FaWhatsapp className="text-sm" />
            Connect Instantly on WhatsApp
          </a>
          <button
            onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
            className="text-xs uppercase tracking-widest text-[#C9A96E]/70 hover:text-[#C9A96E] py-2 px-4 transition-colors"
          >
            Send another inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {errors.general && (
        <div className="p-3 bg-red-900/30 border border-red-500/40 text-red-200 text-xs rounded">
          {errors.general}
        </div>
      )}
      {field("name",    "Your name")}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("email",   "Your email", "email")}
        {field("phone",   "Phone / WhatsApp (Optional)", "tel")}
      </div>
      {field("message", "Your message or acquisition inquiry", "text", 5)}
      <button
        type="submit"
        disabled={submitting}
        className="btn-dark inline-flex items-center justify-center gap-2 px-10 py-4 mt-2 transition-all disabled:opacity-50"
        style={{ background: "#C9A96E", color: "#111010", fontWeight: 500 }}
      >
        {submitting ? "Sending..." : "Send Message"}
        <FaArrowRight className="text-[10px]" />
      </button>
    </form>
  );
}

export default function InfoPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [studioEmail, setStudioEmail] = useState("contact@kalasamputah.com");
  const [whatsappNumber, setWhatsappNumber] = useState("919818817291");

  useEffect(() => {
    fetch("/api/content")
      .then(res => res.json())
      .then(data => {
        if (data.content?.contact?.studioEmail) setStudioEmail(data.content.contact.studioEmail);
        if (data.content?.contact?.whatsappNumber) setWhatsappNumber(data.content.contact.whatsappNumber.replace(/[^0-9]/g, ""));
      })
      .catch(() => {});
  }, []);

  const faqs = [
    {
      q: "How do I inquire about purchasing a work?",
      a: `Inquire directly on any artwork card, or use the studio contact form below or reach out to ${studioEmail}. All works are original studio pieces sold directly by conversation.`,
    },
    {
      q: "Are commissions available?",
      a: "Yes. Commissioned works are available year-round. The process begins with a conversation about scale, palette, and what you're hoping the piece will do in its space.",
    },
    {
      q: "Do you ship internationally?",
      a: "Paintings are shipped carefully rolled or stretched, depending on size. Domestic & international museum-grade shipping is arranged with tracking and insurance.",
    },
    {
      q: "What materials do you work with?",
      a: "Primarily acrylic on canvas. Some works incorporate oil pastel, charcoal, and raw pigment. Materials are listed individually for each piece.",
    },
    {
      q: "Can I visit the studio?",
      a: "Studio visits in New Delhi are possible by appointment. Reach out via the form below or WhatsApp to arrange.",
    },
  ];

  const steps = [
    { n: "01", title: "Reach out", body: `Reach out via the artwork inquiry modal, contact form, or direct WhatsApp with the piece you love.` },
    { n: "02", title: "Conversation", body: "We'll talk — about the work, your space, what you want the piece to feel like. No pressure, no pitch." },
    { n: "03", title: "Agreement", body: "Pricing, timeline, and any commission specifics are agreed upon. A 50% deposit secures the work or begins the commission." },
    { n: "04", title: "Delivery", body: "The work is carefully packed and shipped. Original works come with a certificate of authenticity and care instructions." },
  ];

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
          alt="Studio Background"
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
            Info & Inquiries
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
      <section className="py-16 md:py-24 px-6 md:px-10" style={{ background: "#FDFAF5" }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="section-title mb-2">Questions</p>
            <h2 style={{
              fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif',
              fontWeight: 300,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "#1C1C1C",
              letterSpacing: "0.03em",
            }}>
              Frequently asked
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-[#E8DDD0]">
            {faqs.map((faq, i) => (
              <div key={i} className="py-6">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <span style={{
                    fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif',
                    fontSize: "1.1rem",
                    color: "#1C1C1C",
                  }}>
                    {faq.q}
                  </span>
                  <span style={{
                    color: "#C9A96E",
                    fontSize: "1.2rem",
                    lineHeight: 1,
                    transform: openFaq === i ? "rotate(45deg)" : "none",
                    transition: "transform 0.2s ease",
                  }}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <p style={{
                    fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: "0.95rem",
                    lineHeight: 1.75,
                    color: "#6B5F55",
                    marginTop: "0.8rem",
                    maxWidth: "65ch",
                  }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section id="contact" className="py-20 md:py-28 px-6 md:px-12" style={{ background: "#111010" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* Left info */}
          <div>
            <p className="section-title mb-4" style={{ color: "#C9A96E" }}>Studio Contact</p>
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
                { Icon: FaEnvelope,     text: studioEmail,           href: `mailto:${studioEmail}` },
                { Icon: FaWhatsapp,     text: `+${whatsappNumber} (Direct Studio Chat)`, href: `https://wa.me/${whatsappNumber}` },
                { Icon: FaInstagram,    text: "@kala_samputah",       href: "https://www.instagram.com/kala_samputah" },
                { Icon: FaMapMarkerAlt, text: "New Delhi, India",     href: null },
              ].map(({ Icon, text, href }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon style={{ color: "#C9A96E", fontSize: "0.9rem", flexShrink: 0 }} />
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: "1rem",
                        color: "rgba(245,240,232,0.6)",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = "#C9A96E"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(245,240,232,0.6)"}
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
            <ContactForm studioEmail={studioEmail} whatsappNumber={whatsappNumber} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
