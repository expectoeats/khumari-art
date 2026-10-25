"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import LensZoom from "../../../components/LensZoom";
import ArtCard from "../../../components/ArtCard";
import { allWorks } from "../../../components/data";
import { useArtModal } from "../../../components/ArtModalContext";
import { FaArrowLeft, FaWhatsapp, FaShieldAlt, FaAward, FaTruck, FaArrowRight } from "react-icons/fa";

export default function ArtworkDetailPage() {
  const params = useParams();
  const rawId = params?.id ? decodeURIComponent(params.id) : "";

  // 1. Initial fallback search in static allWorks
  const staticFound = allWorks.find(
    (w) => w.id?.toString() === rawId || w._id === rawId || (parseInt(rawId, 10) && w.id === parseInt(rawId, 10))
  );

  const [artwork, setArtwork] = useState(staticFound || null);
  const [loading, setLoading] = useState(!staticFound);
  const [allDbWorks, setAllDbWorks] = useState(allWorks);
  const [whatsappNumber, setWhatsappNumber] = useState("919818817291");
  const { openInquiry } = useArtModal();

  useEffect(() => {
    // Fetch WhatsApp number from CMS content
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.content?.contact?.whatsappNumber) {
          setWhatsappNumber(data.content.contact.whatsappNumber.replace(/[^0-9]/g, ""));
        }
      })
      .catch(() => {});

    // Fetch artwork from DB
    let isMounted = true;
    const fetchArtwork = async () => {
      try {
        const res = await fetch(`/api/artworks/${rawId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.artwork && isMounted) {
            const dbArt = data.artwork;
            const normalized = {
              id: dbArt._id,
              _id: dbArt._id,
              title: dbArt.title,
              artist: dbArt.artist || "Nancy Sikri",
              medium: dbArt.medium || "Mixed Media on Canvas",
              size: dbArt.dimensions || dbArt.size || "Original Size",
              year: dbArt.year || new Date().getFullYear(),
              color: dbArt.color || "Amber",
              category: dbArt.category?.name || dbArt.category || "Paintings",
              src: dbArt.images?.[0] || dbArt.image || staticFound?.src || "/art/placeholder.jpg",
              story: dbArt.story || dbArt.description || "Original Studio Work by Nancy Sikri.",
              featured: dbArt.featured || false,
            };
            setArtwork(normalized);
          }
        }
      } catch (err) {
        console.warn("[ARTWORK DETAIL] Fallback to static archive", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArtwork();

    // Fetch full catalogue for curated pairings
    fetch("/api/artworks")
      .then((r) => r.json())
      .then((d) => {
        if (d.artworks && d.artworks.length > 0 && isMounted) {
          const formatted = d.artworks.map((a) => ({
            id: a._id,
            _id: a._id,
            title: a.title,
            artist: a.artist || "Nancy Sikri",
            medium: a.medium || "Mixed Media on Canvas",
            size: a.dimensions || a.size || "",
            year: a.year || new Date().getFullYear(),
            color: a.color || "Neutral",
            category: a.category?.name || a.category || "Paintings",
            src: a.images?.[0] || a.image || "/art/placeholder.jpg",
          }));
          setAllDbWorks(formatted);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [rawId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFAF5]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="w-12 h-12 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs uppercase tracking-widest text-brand-muted font-sans">
            Opening Artwork Archive...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const currentWork = artwork || staticFound || allWorks[0];
  if (!currentWork) {
    return notFound();
  }

  const relatedWorks = allDbWorks
    .filter(
      (w) =>
        (w.id?.toString() !== currentWork.id?.toString() && w._id !== currentWork._id) &&
        (w.category === currentWork.category || w.color === currentWork.color)
    )
    .slice(0, 4);

  const archiveCode = `KS-${currentWork.year || 2024}-${(currentWork.id?.toString() || "01").slice(-2).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-[#FDFAF5]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-14">
        {/* Breadcrumb & Navigation Back */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EAE2D5]">
          <Link
            href="/collect"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-muted hover:text-brand-dark transition-colors font-sans"
          >
            <FaArrowLeft className="text-[10px]" />
            <span>Back to Collection</span>
          </Link>

          <span className="text-[0.65rem] uppercase tracking-widest text-brand-accent font-sans font-semibold">
            Provenance Archive · {archiveCode}
          </span>
        </div>

        {/* Main Artwork Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Lens Zoom Viewer (7 cols) */}
          <div className="lg:col-span-7">
            <LensZoom
              src={currentWork.src}
              alt={currentWork.title}
              title={currentWork.title}
            />
          </div>

          {/* Right Column: Artwork Narrative & Acquisition Box (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[0.68rem] tracking-[0.25em] uppercase text-brand-accent font-sans font-semibold block mb-1">
                Original Studio Work · {currentWork.artist || "Nancy Sikri"}
              </span>
              <h1 className="font-display text-3xl md:text-4xl text-brand-dark leading-tight">
                {currentWork.title}
              </h1>
              <p className="text-sm text-brand-warm font-sans mt-1">
                New Delhi Atelier · Created {currentWork.year}
              </p>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-[#EBE4D8] shadow-sm">
              <div>
                <span className="text-[0.62rem] uppercase tracking-wider text-brand-muted font-sans block">
                  Medium
                </span>
                <p className="text-xs font-semibold text-brand-dark font-sans mt-0.5 truncate">
                  {currentWork.medium || "Acrylic on Canvas"}
                </p>
              </div>
              <div>
                <span className="text-[0.62rem] uppercase tracking-wider text-brand-muted font-sans block">
                  Dimensions
                </span>
                <p className="text-xs font-semibold text-brand-dark font-sans mt-0.5">
                  {currentWork.size || "Original Size"}
                </p>
              </div>
              <div>
                <span className="text-[0.62rem] uppercase tracking-wider text-brand-muted font-sans block">
                  Dominant Palette
                </span>
                <p className="text-xs font-semibold text-brand-dark font-sans mt-0.5">
                  {currentWork.color || "Neutral"}
                </p>
              </div>
            </div>

            {/* Curatorial Text */}
            <div className="text-sm text-[#4E443B] font-sans font-light leading-relaxed space-y-3">
              <p>
                {currentWork.story ||
                  "This work explores emotional presence through layered textures, raw pigments, and intuitive gesture. No preliminary sketch was made; every line and surface builds upon previous states of paint, creating a tangible dialogue with light and physical space."}
              </p>
              <p className="text-xs text-brand-muted italic font-display">
                "Paintings are conversations that never end. Each piece is placed directly with the person who feels drawn to its rhythm."
              </p>
            </div>

            {/* Acquisition Action Box */}
            <div className="bg-white p-6 rounded-xl border border-[#E7DFD2] shadow-sm space-y-4">
              <div>
                <span className="text-[0.62rem] uppercase tracking-widest text-brand-accent font-sans font-semibold block mb-1">
                  Availability by Inquiry
                </span>
                <h3 className="font-display text-xl text-brand-dark">
                  Acquire This Original Piece
                </h3>
                <p className="text-xs text-brand-muted font-sans leading-relaxed mt-1">
                  All works are sold without retail checkout carts or middleman markups. Inquire below for pricing, framing options, and secure crated delivery.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => openInquiry(currentWork)}
                  className="w-full py-3.5 px-6 bg-brand-dark hover:bg-brand-warm text-brand-cream rounded-lg text-xs tracking-widest uppercase font-sans font-medium transition-all shadow hover:shadow-md flex items-center justify-center gap-2"
                >
                  <span>Inquire for Quote</span>
                  <FaArrowRight className="text-[10px] text-brand-accent" />
                </button>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `Hello Nancy, I am inquiring for quote on the painting: "${currentWork.title}" (Provenance: ${archiveCode})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg text-xs tracking-wider uppercase font-sans font-medium transition-all flex items-center justify-center gap-2 shadow"
                >
                  <FaWhatsapp className="text-base" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Authenticity Guarantee */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-brand-muted font-sans">
                <FaAward className="text-brand-accent text-sm flex-shrink-0" />
                <span>100% Original Studio Work</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-muted font-sans">
                <FaShieldAlt className="text-brand-accent text-sm flex-shrink-0" />
                <span>Signed Certificate</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-muted font-sans">
                <FaTruck className="text-brand-accent text-sm flex-shrink-0" />
                <span>Insured Global Crating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Works Grid */}
        {relatedWorks.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#EAE2D5]">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-title mb-1">Curated Pairings</p>
                <h3 className="font-display text-2xl md:text-3xl text-brand-dark">
                  Works in Similar Spirit
                </h3>
              </div>
              <Link
                href="/collect"
                className="text-xs uppercase tracking-widest text-brand-accent hover:text-brand-dark border-b border-brand-accent pb-0.5 font-sans"
              >
                View Full Catalogue →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedWorks.map((work) => (
                <ArtCard key={work.id || work._id} {...work} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
