// Shared centered skeleton card used by both the global PageLoader and the
// /loader-preview gallery's Loader4_SkeletonCard. Single source of truth so
// brand changes only need to update one file.
//
// Respects prefers-reduced-motion via Tailwind's `motion-safe:` /
// `motion-reduce:` variants — users with the OS-level "Reduce motion"
// setting see a static skeleton with no pulse animation.

export default function LoaderCard() {
  // motion-safe applies the pulse animation only when the user has NOT
  // enabled prefers-reduced-motion. motion-reduce hides the dot's pulse.
  return (
    <div className="w-64 rounded-2xl bg-white border border-gray-200 shadow-2xl shadow-blue-500/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-blue-500 motion-safe:animate-pulse" />
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
          Loading page
        </p>
      </div>

      {/* Header skeleton */}
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-gray-900 rounded motion-safe:animate-pulse" style={{ width: '60%' }} />
        <div className="h-2 bg-gray-300 rounded motion-safe:animate-pulse" style={{ width: '90%', animationDelay: '100ms' }} />
        <div className="h-2 bg-gray-300 rounded motion-safe:animate-pulse" style={{ width: '75%', animationDelay: '200ms' }} />
      </div>

      {/* Section heading */}
      <div className="h-2.5 bg-blue-500 rounded mb-2 motion-safe:animate-pulse" style={{ width: '40%' }} />

      {/* Body lines */}
      <div className="space-y-1.5 mb-3">
        <div className="h-2 bg-gray-300 rounded motion-safe:animate-pulse" style={{ width: '100%', animationDelay: '300ms' }} />
        <div className="h-2 bg-gray-300 rounded motion-safe:animate-pulse" style={{ width: '85%', animationDelay: '400ms' }} />
      </div>

      {/* Skill pills */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-3 bg-blue-100 rounded-full motion-safe:animate-pulse"
            style={{ width: `${24 + i * 8}px`, animationDelay: `${500 + i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
