import { FaArrowRight } from "react-icons/fa";
import ArtCard from "./ArtCard";
import { paintings } from "./data";

export default function Paintings() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-10 bg-brand-cream">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <div className="text-center mb-10 md:mb-14">
          <p className="section-title mb-3">Explore</p>
          <h2
            className="text-brand-dark text-3xl md:text-5xl"
            style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 300, letterSpacing: "0.1em" }}
          >
            PAINTINGS
          </h2>
          <div className="divider w-24 mx-auto mt-4" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {paintings.map((art, i) => (
            <ArtCard key={i} {...art} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="btn-outline inline-flex items-center gap-3 px-10 py-4">
            VIEW ALL
            <FaArrowRight className="text-[10px]" />
          </button>
        </div>

      </div>
    </section>
  );
}
