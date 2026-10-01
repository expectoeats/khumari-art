// Journal page loading skeleton
import { PostListSkeleton, SkeletonBlock } from "../../components/Skeleton";

export default function JournalLoading() {
  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>

      {/* Hero — dark masthead */}
      <div
        className="w-full relative overflow-hidden"
        style={{ height: "75vh", minHeight: "480px", background: "#111010" }}
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
        {/* Masthead title placeholder */}
        <div className="absolute inset-0 flex flex-col justify-between px-8 md:px-14 py-12">
          <SkeletonBlock dark className="h-3 w-24" />
          <div className="flex flex-col gap-2">
            <div className="skeleton-dark w-full" style={{ height: "1px" }} />
            <SkeletonBlock dark className="h-24 md:h-36 w-3/4" />
            <div className="skeleton-dark w-full" style={{ height: "1px", marginTop: "1rem" }} />
          </div>
          <div className="flex justify-between">
            <SkeletonBlock dark className="h-3 w-40" />
            <SkeletonBlock dark className="h-3 w-20" />
          </div>
        </div>
      </div>

      {/* Featured post */}
      <div className="py-12 md:py-16 px-6 md:px-10 border-b border-brand-sand/40">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div className="skeleton w-full aspect-[4/3] rounded" />
          <div className="flex flex-col gap-4">
            <SkeletonBlock className="h-3 w-32" />
            <SkeletonBlock className="h-10 w-5/6" />
            <SkeletonBlock className="h-10 w-4/6" />
            <SkeletonBlock className="h-4 w-full mt-2" />
            <SkeletonBlock className="h-4 w-5/6" />
            <SkeletonBlock className="h-4 w-3/4" />
            <SkeletonBlock className="h-3 w-16 mt-2" />
          </div>
        </div>
      </div>

      {/* Post list */}
      <div className="py-12 md:py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <SkeletonBlock className="h-3 w-24 mb-10" />
          <PostListSkeleton />
        </div>
      </div>
    </div>
  );
}
