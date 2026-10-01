// Artists page loading skeleton
import { SplitHeroSkeleton } from "../../components/Skeleton";

export default function ArtistsLoading() {
  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      {/* No NavbarSkeleton here — Navbar is sticky from layout, already visible */}
      <SplitHeroSkeleton />

      {/* Statement section */}
      <div className="py-20 md:py-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
          <div className="flex flex-col gap-3">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-1 w-8 mt-2" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-5/6" />
            <div className="skeleton h-12 w-4/6" />
            <div className="skeleton h-1 w-full mt-4" />
            <div className="grid grid-cols-2 gap-6 mt-2">
              {[1, 2].map(i => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-5/6" />
                  <div className="skeleton h-4 w-4/6" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-3/6" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Process section */}
      <div className="py-16 md:py-24 px-6 md:px-10" style={{ background: "#F5F0E8" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-0">
          {[1, 2, 3].map(i => (
            <div key={i} className="px-8 py-10 flex flex-col gap-4">
              <div className="skeleton h-14 w-12" />
              <div className="skeleton h-6 w-32" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
              <div className="skeleton h-4 w-4/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
