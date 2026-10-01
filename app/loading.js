// Root (homepage) loading skeleton
import { NavbarSkeleton, HeroSkeleton, SectionHeadingSkeleton, GridSkeleton } from "../components/Skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <NavbarSkeleton />

      {/* Hero */}
      <HeroSkeleton dark height="88vh" />

      {/* New Arrivals */}
      <div className="py-16 md:py-24 px-4 md:px-10 bg-brand-cream">
        <div className="max-w-7xl mx-auto">
          <SectionHeadingSkeleton />
          <GridSkeleton cols={4} count={4} />
        </div>
      </div>

      {/* Collections */}
      <div className="py-16 md:py-20 px-4 md:px-10 bg-brand-beige">
        <div className="max-w-7xl mx-auto">
          <SectionHeadingSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton aspect-[3/4] rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* Paintings */}
      <div className="py-16 md:py-24 px-4 md:px-10 bg-brand-cream">
        <div className="max-w-7xl mx-auto">
          <SectionHeadingSkeleton />
          <GridSkeleton cols={4} count={4} />
        </div>
      </div>
    </div>
  );
}
