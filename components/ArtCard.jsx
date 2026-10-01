import Image from "next/image";

export default function ArtCard({ src, artist, title, medium }) {
  return (
    <div className="group hover-lift cursor-pointer">
      {/* Image */}
      <div className="art-card-img relative aspect-[3/4] overflow-hidden mb-0">
        <Image src={src} alt={title} fill className="object-cover img-zoom" />
      </div>

      {/* Info */}
      <div className="px-3 pt-4 pb-5">
        <p
          className="text-brand-dark text-xs font-semibold tracking-widest uppercase mb-0.5"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          {artist}
        </p>
        <p
          className="text-brand-charcoal text-sm italic mb-1"
          style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}
        >
          {title}
        </p>
        <p className="section-title text-[0.65rem]">{medium}</p>
        <button
          className="mt-3 text-brand-accent hover:text-brand-dark transition-colors text-[0.65rem] tracking-widest uppercase border-b border-brand-accent/40 hover:border-brand-dark pb-0.5"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          Inquire for Quote
        </button>
      </div>
    </div>
  );
}
