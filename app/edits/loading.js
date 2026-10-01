// Edits page loading skeleton
import { PanelsSkeleton, SkeletonBlock } from "../../components/Skeleton";

export default function EditsLoading() {
  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      <PanelsSkeleton />

      {/* Cards grid */}
      <div className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="overflow-hidden" style={{ borderRadius: "6px", background: "#F5F0E8" }}>
              <div className="skeleton w-full" style={{ aspectRatio: "16/9" }} />
              <div className="px-6 py-6 flex flex-col gap-3">
                <SkeletonBlock className="h-6 w-40" />
                <SkeletonBlock className="h-4 w-3/4" />
                <SkeletonBlock className="h-3 w-24 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
