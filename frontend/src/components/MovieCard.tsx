import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Play, Ticket } from 'lucide-react'
import { Movie } from '../data/movies'
import { useLanguage } from '../context/LanguageContext'
import { formatRelativeTime } from '../utils/time'
import SmartImage from './SmartImage'

type Props = {
  movie: Movie
}

export default function MovieCard({ movie }: Props) {
  const navigate = useNavigate()
  const { t, lang } = useLanguage()
  const totalEpisodes = movie.episodeTotal ?? 1
  const isSeries = totalEpisodes > 1
  const hasParts = !!movie.parts?.length
  const genreTag = movie.category.toUpperCase()
  // Shown as a badge over the poster — a quick "2 Parts" / "7 Episodes"
  // count rather than the detailed season/ep text, right before the title.
  const countBadge = hasParts
    ? t.card_parts_count(movie.parts!.length)
    : isSeries
    ? t.card_episodes_count(totalEpisodes)
    : null

  const handleDownload = (e: MouseEvent) => {
    e.stopPropagation()
    // Demo-only: no backend/video file exists yet, so this opens the poster art.
    // Once a real video source is wired up, point this at that file instead.
    window.open(movie.poster, '_blank', 'noopener')
  }

  const handlePlay = (e: MouseEvent) => {
    e.stopPropagation()
    navigate(`/watch/${movie.id}`)
  }

  return (
    <div
      onClick={() => navigate(`/watch/${movie.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/watch/${movie.id}`)}
      // Cards stay quiet at rest — poster, count, title. The rest (genre
      // tag, download, play, the sprocket flourish) surfaces on hover so
      // browsing feels calm and the reveal feels earned, not cluttered.
      className="group/card relative shrink-0 w-[220px] sm:w-[260px] lg:w-[300px] text-left cursor-pointer hover:z-10"
    >
      <div className="relative rounded-lg overflow-hidden border border-reel-line transition-all duration-300 group-hover/card:border-amber/70 group-hover/card:shadow-glow group-hover/card:-translate-y-1">
        <SmartImage
          src={movie.poster}
          alt={movie.title}
          fallbackLabel={movie.title}
          wrapperClassName="aspect-[2/3]"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/5 to-void/25 opacity-70 group-hover/card:opacity-100 transition-opacity duration-300" />

        {/* Top-left: genre tag(s) — revealed on hover only */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 opacity-0 -translate-y-1 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300">
          <span className="bg-ember text-parchment text-[10px] sm:text-[11px] font-bold tracking-wide px-2 py-1 rounded">
            {genreTag}
          </span>
          {isSeries && !hasParts && (
            <span className="bg-amber text-void text-[10px] sm:text-[11px] font-bold tracking-wide px-2 py-1 rounded">
              {t.card_season.toUpperCase()}
            </span>
          )}
        </div>

        {/* Top-right: download — revealed on hover only */}
        <button
          onClick={handleDownload}
          aria-label={`Download ${movie.title}`}
          className="absolute top-2.5 right-2.5 w-8 h-8 grid place-items-center rounded-full bg-void/70 border border-parchment/20 text-parchment hover:text-amber hover:border-amber transition-colors backdrop-blur-sm opacity-0 -translate-y-1 group-hover/card:opacity-100 group-hover/card:translate-y-0 duration-300"
        >
          <Download size={15} />
        </button>

        {/* Center: play, revealed on hover */}
        <button
          onClick={handlePlay}
          aria-label={`Play ${movie.title}`}
          className="absolute inset-0 grid place-items-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
        >
          <span className="w-14 h-14 rounded-full bg-amber text-void grid place-items-center shadow-glow scale-90 group-hover/card:scale-100 transition-transform duration-300">
            <Play size={22} fill="currentColor" />
          </span>
        </button>

        {/* Signature flourish: a sprocket-hole strip along the bottom edge,
            echoing the film-reel identity used elsewhere on the site —
            only appears once the card is engaged with. */}
        <div className="sprocket-rule absolute bottom-0 left-0 right-0 opacity-0 group-hover/card:opacity-90 transition-opacity duration-300" />

        {/* Bottom-of-poster: total episode/part count, always visible — the
            one piece of chrome that stays put so browsing keeps its scent */}
        {countBadge && (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 bg-void/75 border border-parchment/15 text-parchment text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
            <Ticket size={13} className="text-amber" /> {countBadge}
          </span>
        )}
      </div>

      <div className="mt-2.5 px-0.5">
        <h3 className="text-base sm:text-lg text-parchment font-semibold leading-snug line-clamp-1 transition-colors duration-300 group-hover/card:text-amber-soft">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-fog mt-1">
          <span className="truncate">{movie.uploadedBy || t.card_uploader_fallback}</span>
          <span className="shrink-0 ml-2">{formatRelativeTime(movie.uploadedAt, lang)}</span>
        </div>
      </div>
    </div>
  )
}
