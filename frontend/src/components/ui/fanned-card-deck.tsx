import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react'
import { Movie } from '../../data/movies'
import { useLanguage } from '../../context/LanguageContext'

interface FannedCardDeckProps {
  movies: Movie[]
  /** Which movie index is in the focused center slot — controlled by the parent
      so the deck always stays in sync with the Hero text above it. */
  centerIndex: number
  className?: string
}

const SLOTS = [-2, -1, 0, 1, 2] as const

const SLOT_STYLE: Record<number, { x: number; y: number; rotate: number; scale: number; z: number; opacity: number; blur: string }> = {
  [-2]: { x: -186, y: 50, rotate: -16, scale: 0.76, z: 10, opacity: 0.6, blur: 'blur-[1px]' },
  [-1]: { x: -100, y: 18, rotate: -9, scale: 0.89, z: 20, opacity: 0.9, blur: '' },
  [0]: { x: 0, y: 0, rotate: 0, scale: 1, z: 40, opacity: 1, blur: '' },
  [1]: { x: 100, y: 18, rotate: 9, scale: 0.89, z: 20, opacity: 0.9, blur: '' },
  [2]: { x: 186, y: 50, rotate: 16, scale: 0.76, z: 10, opacity: 0.6, blur: 'blur-[1px]' },
}

export default function FannedCardDeck({ movies, centerIndex, className = '' }: FannedCardDeckProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const navigate = useNavigate()
  const { categoryLabel } = useLanguage()

  if (!movies.length) return null

  return (
    <div className={`relative ${className}`} style={{ perspective: '1400px' }}>
      {SLOTS.map((slot) => {
        const idx = ((centerIndex + slot) % movies.length + movies.length) % movies.length
        const movie = movies[idx]
        const style = SLOT_STYLE[slot]
        const isCenter = slot === 0
        const key = `${slot}-${movie.id}`
        const isHovered = hoveredKey === key

        return (
          <button
            key={key}
            type="button"
            onMouseEnter={() => setHoveredKey(key)}
            onMouseLeave={() => setHoveredKey(null)}
            onClick={() => navigate(`/watch/${movie.id}`)}
            aria-label={`Play ${movie.title}`}
            className={`group/fan absolute left-1/2 top-1/2 w-[290px] h-[410px] text-left transition-[opacity,filter,transform] duration-700 ease-out ${style.blur}`}
            style={{
              transform: `translate(-50%, -50%) translate(${style.x}px, ${style.y}px) rotate(${style.rotate}deg) scale(${style.scale})`,
              zIndex: isHovered ? 50 : style.z,
              opacity: style.opacity,
            }}
          >
            {/* Animated conic-gradient border "beam" — travels the edge, speeds up on hover */}
            <div className="relative w-full h-full rounded-2xl p-[2px] overflow-hidden bg-reel-line/50">
              <div
                className="absolute -inset-[60%] animate-[spin_4s_linear_infinite] group-hover/fan:animate-[spin_1s_linear_infinite]"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0%, transparent 78%, #F2C778 87%, #E8A33D 91%, #D65B3D 95%, transparent 100%)',
                }}
              />

              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-void">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/fan:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/15 to-transparent" />

                {/* Category pill, mirroring the reference layout */}
                <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-parchment text-void text-[10px] font-bold uppercase tracking-widest2 px-3 py-1.5 rounded-full whitespace-nowrap">
                  {categoryLabel(movie.category, movie.category)}
                </span>

                {/* Title + synopsis on the focused center card only */}
                {isCenter && (
                  <div className="absolute bottom-0 left-0 w-full p-4 transition-opacity duration-300 group-hover/fan:opacity-0">
                    <h3 className="font-display text-xl sm:text-2xl text-parchment tracking-wide leading-none mb-1.5">
                      {movie.title}
                    </h3>
                    <p className="text-parchment-dim text-xs leading-snug line-clamp-2">{movie.synopsis}</p>
                  </div>
                )}

                {/* Play icon on hover — same treatment as the standard MovieCard */}
                <span className="absolute inset-0 grid place-items-center opacity-0 group-hover/fan:opacity-100 transition-opacity duration-300">
                  <span className="w-11 h-11 rounded-full bg-amber text-void grid place-items-center shadow-glow scale-90 group-hover/fan:scale-100 transition-transform duration-300">
                    <Play size={18} fill="currentColor" />
                  </span>
                </span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
