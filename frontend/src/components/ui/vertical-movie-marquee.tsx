import { Movie } from '../../data/movies'
import { cn } from '@/lib/utils'
import SmartImage from '../SmartImage'

interface VerticalMovieMarqueeProps {
  /** Each inner array is one scrolling column. */
  columns: Movie[][]
  className?: string
}

// Column 2 (index 1) is intentionally faster than its neighbors — a deliberate
// accent so the eye catches movement at different rhythms across the reel.
const speedClasses = ['animate-scroll-up-slow', 'animate-scroll-up-fast', 'animate-scroll-up-slow']

export default function VerticalMovieMarquee({ columns, className = '' }: VerticalMovieMarqueeProps) {
  const activeColumns = columns.filter((c) => c.length > 0)
  if (!activeColumns.length) return null

  return (
    <div className={cn('flex gap-5 h-full', className)}>
      {activeColumns.map((col, ci) => {
        // Duplicate the list so the loop is seamless (translateY(-50%) lines up perfectly).
        const doubled = [...col, ...col]
        return (
          <div
            key={ci}
            className="relative w-[130px] sm:w-[150px] lg:w-[160px] h-full overflow-hidden rounded-lg shrink-0"
          >
            <div className={cn('flex flex-col gap-5 will-change-transform', speedClasses[ci % speedClasses.length])}>
              {doubled.map((m, i) => (
                <div
                  key={`${m.id}-${i}`}
                  className="w-full aspect-[2/3] rounded-lg overflow-hidden border border-reel-line shadow-2xl shrink-0 bg-reel"
                >
                  <SmartImage src={m.poster} alt={m.title} fallbackLabel={m.title} wrapperClassName="h-full" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
