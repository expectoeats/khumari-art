// ── Reusable skeleton primitives ─────────────────────────────────────────────

/** Bare block — pass className for size, dark prop for dark-bg pages */
export function SkeletonBlock({ className = "", dark = false }) {
  return <div className={`${dark ? "skeleton-dark" : "skeleton"} ${className}`} />;
}

/** Navbar skeleton */
export function NavbarSkeleton() {
  return (
    <div
      className="w-full flex items-center justify-between px-6 md:px-10"
      style={{ height: "80px", background: "#FDFAF5", borderBottom: "1px solid #EEEBE5" }}
    >
      <SkeletonBlock className="h-4 w-28" />
      <div className="hidden md:flex gap-8">
        {[72, 56, 80, 64, 48].map((w, i) => (
          <SkeletonBlock key={i} className="h-3" style={{ width: w }} />
        ))}
      </div>
      <div className="flex gap-4">
        <SkeletonBlock className="h-4 w-4 rounded-full" />
        <SkeletonBlock className="h-4 w-4 rounded-full" />
      </div>
    </div>
  );
}

/** Full-width dark hero skeleton (artists, edits, journal, info) */
export function HeroSkeleton({ dark = true, height = "72vh" }) {
  return (
    <div
      className="w-full"
      style={{
        height,
        minHeight: "400px",
        background: dark ? "#111010" : "#EEEBE5",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: dark
            ? "linear-gradient(90deg, #1e1c1a 0px, #2a2825 300px, #1e1c1a 600px)"
            : "linear-gradient(90deg, #EEEBE5 0px, #F5F2ED 300px, #EEEBE5 600px)",
          backgroundSize: "600px 100%",
          animation: "shimmer 1.4s ease-in-out infinite",
        }}
      />
      {/* Bottom-left text placeholder */}
      <div className="absolute bottom-10 left-8 md:left-14 flex flex-col gap-3">
        <SkeletonBlock dark={dark} className="h-4 w-24" />
        <SkeletonBlock dark={dark} className="h-12 w-72" />
        <SkeletonBlock dark={dark} className="h-12 w-56" />
      </div>
    </div>
  );
}

/** 3-col or 4-col art card grid skeleton */
export function GridSkeleton({ cols = 4, count = 8, dark = false }) {
  const colClass =
    cols === 3
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 md:grid-cols-4";

  return (
    <div className={`grid ${colClass} gap-4 md:gap-8`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <SkeletonBlock dark={dark} className="w-full aspect-[3/4]" />
          <SkeletonBlock dark={dark} className="h-3 w-3/4" />
          <SkeletonBlock dark={dark} className="h-3 w-1/2" />
          <SkeletonBlock dark={dark} className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

/** Section heading skeleton */
export function SectionHeadingSkeleton({ dark = false }) {
  return (
    <div className="flex flex-col items-center gap-3 mb-12">
      <SkeletonBlock dark={dark} className="h-3 w-20" />
      <SkeletonBlock dark={dark} className="h-10 w-64" />
      <SkeletonBlock dark={dark} className="h-[1px] w-24" />
    </div>
  );
}

/** Split hero skeleton (artists page) */
export function SplitHeroSkeleton() {
  return (
    <div className="w-full grid md:grid-cols-2" style={{ minHeight: "92vh" }}>
      {/* Left dark panel */}
      <div
        className="flex flex-col justify-between px-8 md:px-14 py-14"
        style={{ background: "#111010" }}
      >
        <SkeletonBlock dark className="h-3 w-20" />
        <div className="flex flex-col gap-4">
          <SkeletonBlock dark className="h-20 w-4/5" />
          <SkeletonBlock dark className="h-20 w-3/5" />
          <SkeletonBlock dark className="h-4 w-48 mt-4" />
        </div>
        <SkeletonBlock dark className="h-3 w-32" />
      </div>
      {/* Right image */}
      <div className="relative" style={{ minHeight: "55vw", background: "#1e1c1a" }}>
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
      </div>
    </div>
  );
}

/** Expanding panels skeleton (edits page) */
export function PanelsSkeleton() {
  return (
    <div className="w-full flex" style={{ height: "88vh", minHeight: "500px" }}>
      {[1, 2, 3, 4].map((_, i) => (
        <div
          key={i}
          className="flex-1 relative"
          style={{
            borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
            background: "#111010",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, #1e1c1a 0px, #2a2825 300px, #1e1c1a 600px)",
              backgroundSize: "600px 100%",
              animation: `shimmer 1.4s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
          <div className="absolute bottom-8 left-5 flex flex-col gap-2">
            <SkeletonBlock dark className="h-3 w-16" />
            <SkeletonBlock dark className="h-6 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Journal post list skeleton */
export function PostListSkeleton() {
  return (
    <div className="flex flex-col divide-y" style={{ borderTop: "1px solid #E8E4DE" }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-6 py-7">
          <SkeletonBlock className="w-20 h-20 rounded flex-shrink-0 hidden md:block" />
          <div className="flex-1 flex flex-col gap-2">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-6 w-3/4" />
            <SkeletonBlock className="h-3 w-1/2" />
          </div>
          <SkeletonBlock className="w-8 h-8 rounded-full flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
