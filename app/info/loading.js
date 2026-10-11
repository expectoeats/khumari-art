// Info page loading skeleton
import { SkeletonBlock } from "../../components/Skeleton";

export default function InfoLoading() {
  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>

      {/* Dark hero */}
      <div
        className="w-full relative overflow-hidden"
        style={{ minHeight: "52vh", background: "#111010" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, #1e1c1a 0px, #2a2825 300px, #1e1c1a 600px)",
            backgroundSize: "600px 100%",
            animation: "shimmer 1.4s ease-in-out infinite",
          }}
        />
        <div
          className="relative z-10 flex flex-col justify-between px-8 md:px-14 py-12 md:py-16"
          style={{ minHeight: "52vh" }}
        >
          <SkeletonBlock dark className="h-3 w-28" />
          <div className="flex flex-col gap-5">
            <SkeletonBlock dark className="h-1 w-12" />
            <SkeletonBlock dark className="h-16 w-64 md:w-80" />
            <SkeletonBlock dark className="h-16 w-48 md:w-64" />
            <SkeletonBlock dark className="h-4 w-full max-w-md mt-4" />
            <SkeletonBlock dark className="h-4 w-4/5 max-w-sm" />
          </div>
        </div>
      </div>

      {/* Process steps */}
      <div className="py-16 md:py-24 px-6 md:px-10" style={{ background: "#F5F0E8" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-2 mb-12">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-8 w-56" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="px-0 md:px-8 py-8 flex flex-col gap-3">
                <SkeletonBlock className="h-12 w-10" />
                <SkeletonBlock className="h-5 w-28" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5/6" />
                <SkeletonBlock className="h-4 w-4/6" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-3 mb-14">
            <SkeletonBlock className="h-3 w-16" />
            <SkeletonBlock className="h-8 w-48" />
          </div>
          <div style={{ borderTop: "1px solid #E8DDD0" }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="flex items-center justify-between py-6 gap-6"
                style={{ borderBottom: "1px solid #E8DDD0" }}
              >
                <SkeletonBlock className="h-5 flex-1" />
                <SkeletonBlock className="h-5 w-5 rounded-full flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
