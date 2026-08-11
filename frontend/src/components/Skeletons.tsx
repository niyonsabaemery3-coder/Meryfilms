// Skeletons mirror the exact dimensions of the real components (MovieCard,
// MovieRow, Hero) so the layout doesn't jump once real data arrives — this
// is what makes the very first paint feel instant even before data loads.

export function MovieCardSkeleton() {
  return (
    <div className="shrink-0 w-[220px] sm:w-[260px] lg:w-[300px]">
      <div className="aspect-[2/3] rounded-lg bg-reel animate-pulse border border-reel-line" />
      <div className="mt-2.5 px-0.5 space-y-2">
        <div className="h-4 w-3/4 rounded bg-reel animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-reel animate-pulse" />
      </div>
    </div>
  )
}

export function MovieRowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="px-4 sm:px-8 py-4">
      <div className="h-5 w-40 rounded bg-reel animate-pulse mb-4" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[56vw] max-h-[640px] min-h-[380px] bg-gradient-to-b from-reel to-void animate-pulse" />
  )
}

export function HomeSkeleton() {
  return (
    <div className="min-h-screen">
      <HeroSkeleton />
      <div className="pt-8">
        <MovieRowSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />
      </div>
    </div>
  )
}
