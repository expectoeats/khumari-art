import Image from "next/image";
import { categories } from "./data";

export default function Collections() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-10 bg-brand-beige">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <div className="text-center mb-10 md:mb-14">
          <p className="section-title mb-3">Browse By</p>
          <h2
            className="text-brand-dark text-3xl md:text-5xl"
            style={{ fontFamily: "'Beausite Classic', serif", fontWeight: 300, letterSpacing: "0.1em" }}
          >
            COLLECTIONS
          </h2>
          <div className="divider w-24 mx-auto mt-4" />
        </div>

        {/* Grid — horizontal scroll on mobile, 3-col grid on desktop */}
        <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-4 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat, i) => (
            <div key={i} className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden group cursor-pointer flex-shrink-0 w-[75%] md:w-auto snap-start rounded-lg md:rounded-none">
              <Image src={cat.src} alt={cat.label} fill className="object-cover img-zoom" />

              {/* Overlays */}
              <div className="absolute inset-0 category-overlay transition-opacity duration-500 group-hover:opacity-80" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Label */}
              <div className="absolute inset-0 flex items-end justify-start p-6 md:p-8">
                <div>
                  <p
                    className="text-white tracking-[0.28em] uppercase mb-2"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.85rem" }}
                  >
                    {cat.label}
                  </p>
                  <div className="w-8 h-[1px] bg-white/60 group-hover:w-16 transition-all duration-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
