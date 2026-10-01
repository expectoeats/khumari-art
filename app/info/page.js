"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaArrowRight, FaInstagram, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

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
              fontFamily: "'DM Serif Display', serif",
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
              fontFamily: "'DM Serif Display', serif",
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
                className="group relative px-0 md:px-8 py-8"
                style={{ borderLeft: i > 0 ? "1px solid #E8DDD0" : "none" }}
              >
                <p style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontWeight: 300,
                  fontSize: "3rem",
                  color: "rgba(201,169,110,0.25)",
                  lineHeight: 1,
                  marginBottom: "1.2rem",
                }}>
                  {step.n}
                </p>
                <h3 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontWeight: 500,
                  fontSize: "1.15rem",
                  color: "#1C1C1C",
                  marginBottom: "0.6rem",
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontFamily: "'DM Serif Display', serif",
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
            fontFamily: "'DM Serif Display', serif",
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
                    fontFamily: "'DM Serif Display', serif",
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
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#8B7355",
              marginBottom: "1.2rem",
            }}>
              Get in touch
            </p>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
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
                        fontFamily: "'DM Serif Display', serif",
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
                      fontFamily: "'DM Serif Display', serif",
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

          {/* Right — image */}
          <div className="relative overflow-hidden hidden md:block"
            style={{ borderRadius: "6px", aspectRatio: "4/3" }}>
            <Image
              src="/art/818988016_18116134361070803_5613175907062480033_n.jpg"
              alt="Studio"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, rgba(20,18,16,0.3) 0%, transparent 60%)" }} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
