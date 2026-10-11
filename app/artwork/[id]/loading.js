// Artwork detail page loading skeleton
import { SkeletonBlock } from "../../../components/Skeleton";

export default function ArtworkLoading() {
  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>

      {/* Breadcrumb bar */}
      <div
        className="px-4 md:px-10 py-5 flex items-center justify-between border-b"
        style={{ borderColor: "#EAE2D5" }}
      >
        <SkeletonBlock className="h-3 w-32" />
        <SkeletonBlock className="h-3 w-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left — image viewer */}
          <div className="lg:col-span-7">
            <div className="skeleton w-full aspect-[4/3] rounded-sm" />
            <div className="flex gap-3 mt-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton w-16 h-16 rounded-sm" />
              ))}
            </div>
          </div>

          {/* Right — details */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <SkeletonBlock className="h-3 w-40" />
            <SkeletonBlock className="h-10 w-full" />
            <SkeletonBlock className="h-10 w-3/4" />
            <SkeletonBlock className="h-3 w-32" />

            {/* Spec matrix */}
            <div
              className="grid grid-cols-3 gap-3 p-4 rounded-xl"
              style={{ background: "#fff", border: "1px solid #EBE4D8" }}
            >
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col gap-1.5">
                  <SkeletonBlock className="h-2.5 w-14" />
                  <SkeletonBlock className="h-3.5 w-20" />
                </div>
              ))}
            </div>

            {/* Text */}
            <div className="flex flex-col gap-2">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-5/6" />
              <SkeletonBlock className="h-4 w-4/6" />
            </div>

            {/* Action box */}
            <div
              className="p-6 rounded-xl flex flex-col gap-4"
              style={{ background: "#fff", border: "1px solid #E7DFD2" }}
            >
              <SkeletonBlock className="h-3 w-32" />
              <SkeletonBlock className="h-6 w-48" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-4/5" />
              <SkeletonBlock className="h-12 w-full rounded-lg mt-2" />
              <SkeletonBlock className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Related works */}
        <div className="mt-20 pt-12 border-t" style={{ borderColor: "#EAE2D5" }}>
          <div className="flex items-end justify-between mb-8">
            <div className="flex flex-col gap-2">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-7 w-48" />
            </div>
            <SkeletonBlock className="h-3 w-32" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col gap-2">
                <div className="skeleton w-full aspect-[3/4]" />
                <SkeletonBlock className="h-3 w-3/4" />
                <SkeletonBlock className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
