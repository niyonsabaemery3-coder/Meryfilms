import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Play, Info } from 'lucide-react'
import { Movie } from '../data/movies'
import { useLanguage } from '../context/LanguageContext'
import { formatRelativeTime } from '../utils/time'
import FannedCardDeck from './ui/fanned-card-deck'
import SmartImage from './SmartImage'

export default function Hero({ backdropMovie, posterMovies = [] }: { backdropMovie: Movie; posterMovies?: Movie[] }) {
  const [centerIndex, setCenterIndex] = useState(0)
  const navigate = useNavigate()
  const { t, lang, categoryLabel } = useLanguage()

  // No auto-advance: the slide only changes when the person taps the
  // next(>) / back(<) arrows or a dot below — nothing moves on its own.

  if (!backdropMovie) return null
  const movie = posterMovies[centerIndex] ?? backdropMovie

  return (
    <section className="relative h-[68vh] min-h-[460px] w-full overflow-hidden">
      <SmartImage
        src={backdropMovie.backdrop}
        alt=""
        fallbackLabel={backdropMovie.title}
        wrapperClassName="absolute inset-0 h-full"
        className="object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-fade-up" />
      <div className="absolute inset-0 bg-fade-side" />

      {/* Right-side fanned card deck — its focused card drives the title/synopsis below */}
      {posterMovies.length > 0 && (
        <div className="absolute right-2 lg:right-6 top-1/2 -translate-y-1/2 hidden lg:block w-[640px] h-[420px] z-[6]">
          <FannedCardDeck movies={posterMovies} centerIndex={centerIndex} className="h-full" />
        </div>
      )}

      <div className="relative h-full flex items-end sm:items-center">
        <div className="px-4 sm:px-8 pb-10 sm:pb-0 max-w-xl animate-fadein" key={movie.id}>
          <span className="inline-flex items-center gap-1.5 text-ember font-mono text-xs tracking-widest2 uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-ember inline-block animate-pulse" />
            {t.hero_trending_badge}
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-wide text-parchment mb-4">
            {movie.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-fog font-mono mb-4">
            <span className="border border-reel-line rounded px-1.5 py-0.5 text-[11px]">
              {categoryLabel(movie.category, movie.category)}
            </span>
            <span>{formatRelativeTime(movie.uploadedAt, lang)}</span>
          </div>
          <p className="text-parchment-dim text-sm sm:text-base leading-relaxed mb-7 line-clamp-3">
            {movie.synopsis}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate(`/watch/${movie.id}`)}
              className="inline-flex items-center justify-center gap-2 w-[290px] max-w-full bg-amber text-void font-semibold px-6 py-3 rounded-md hover:bg-amber-soft transition-colors"
            >
              <Play size={18} fill="currentColor" /> {t.hero_watch_now}
            </button>
            <button
              onClick={() => navigate(`/watch/${movie.id}`)}
              className="inline-flex items-center justify-center gap-2 w-[290px] max-w-full border border-parchment/30 text-parchment px-6 py-3 rounded-md hover:border-amber hover:text-amber transition-colors backdrop-blur-sm"
            >
              <Info size={18} /> {t.hero_more_info}
            </button>
          </div>
        </div>
      </div>

      {/* Signature: sprocket-hole pagination — now steps through the same
          movies driving the deck and the text above */}
      {posterMovies.length > 1 && (
        <div className="absolute bottom-5 right-4 sm:right-8 flex items-center gap-3">
          <button
            aria-label="Previous"
            onClick={() => setCenterIndex((i) => (i - 1 + posterMovies.length) % posterMovies.length)}
            className="w-8 h-8 grid place-items-center rounded-full border border-parchment/25 text-parchment hover:border-amber hover:text-amber transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            {posterMovies.map((m, i) => (
              <button
                key={m.id}
                aria-label={`Show ${m.title}`}
                onClick={() => setCenterIndex(i)}
                className="relative w-6 h-6 grid place-items-center"
              >
                <span
                  className={`block rounded-full border-2 transition-all duration-300 ${
                    i === centerIndex ? 'w-2.5 h-2.5 border-amber bg-amber' : 'w-1.5 h-1.5 border-fog bg-transparent'
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            aria-label="Next"
            onClick={() => setCenterIndex((i) => (i + 1) % posterMovies.length)}
            className="w-8 h-8 grid place-items-center rounded-full border border-parchment/25 text-parchment hover:border-amber hover:text-amber transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  )
}
