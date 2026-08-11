import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Movie } from '../data/movies'
import MovieCard from './MovieCard'

export default function MovieRow({ title, movies }: { title: string; movies: Movie[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  if (!movies.length) return null

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 640, behavior: 'smooth' })
  }

  return (
    <section className="mb-10 group/row">
      <div className="flex items-center justify-between px-4 sm:px-8 mb-3">
        <h2 className="font-display text-xl sm:text-2xl tracking-wide text-parchment">{title}</h2>
        <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Subira inyuma"
            className="w-8 h-8 grid place-items-center rounded-full border border-reel-line text-fog hover:text-amber hover:border-amber transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Komeza imbere"
            className="w-8 h-8 grid place-items-center rounded-full border border-reel-line text-fog hover:text-amber hover:border-amber transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar px-4 sm:px-8 pb-2"
      >
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  )
}
