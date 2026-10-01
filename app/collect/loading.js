// Collect page loading skeleton
import { NavbarSkeleton, SkeletonBlock } from "../../components/Skeleton";

export default function CollectLoading() {
  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      <NavbarSkeleton />

      {/* Hero dark strip */}
      <div
        className="w-full relative overflow-hidden"
        style={{ height: "38vh", minHeight: "280px", background: "#111010" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #1e1c1a 0px, #2a2825 300px, #1e1c1a 600px)",
            backgroundSize: "600px 100%",
            animation: "shimmer 1.4s ease-in-out infinite",
          }}
        />
        <div className="absolute bottom-8 left-8 md:left-12">
          <SkeletonBlock dark className="h-10 w-36" />
        </div>
      </div>

      {/* Filter bar */}
      <div
        className="w-full px-6 md:px-10 flex gap-6 py-4 border-b"
        style={{ borderColor: "#E8E4DE", background: "#FAFAF8" }}
      >
        {[60, 80, 50, 100].map((w, i) => (
          <SkeletonBlock key={i} className="h-3" style={{ width: w }} />
        ))}
      </div>

      {/* 3-col grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 md:gap-x-8 md:gap-y-14">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="skeleton w-full aspect-[3/4]" />
              <SkeletonBlock className="h-3 w-3/4 mx-auto" />
              <SkeletonBlock className="h-3 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
