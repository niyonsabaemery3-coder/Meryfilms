import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircularGallery, GalleryItem } from './ui/circular-gallery'
import { Movie } from '../data/movies'
import { useLanguage } from '../context/LanguageContext'
import { formatLikes } from '../utils/time'

export default function FeaturedGallery({ movies }: { movies: Movie[] }) {
  const navigate = useNavigate()
  const { t, categoryLabel } = useLanguage()

  const items: GalleryItem[] = useMemo(
    () =>
      movies.map((m) => ({
        common: m.title,
        binomial: categoryLabel(m.category, m.category),
        photo: {
          url: m.poster,
          text: m.title,
          by: formatLikes(m.likes ?? 0, 'en'),
        },
      })),
    [movies, categoryLabel],
  )

  if (!items.length) return null

  return (
    <section className="relative h-[68vh] min-h-[460px] w-full overflow-hidden bg-void">
      <div className="absolute inset-0 bg-vignette pointer-events-none z-10" />

      <div className="absolute top-6 left-0 w-full text-center z-10 pointer-events-none px-4">
        <span className="inline-flex items-center gap-1.5 text-ember font-mono text-xs tracking-widest2 uppercase mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ember inline-block animate-pulse" />
          {t.home_trending_row}
        </span>
        <h2 className="font-display text-3xl sm:text-4xl text-parchment tracking-wide">MeryFilms Reel</h2>
      </div>

      <CircularGallery
        items={items}
        onItemClick={(i) => navigate(`/watch/${movies[i].id}`)}
        className="pt-16"
      />
    </section>
  )
}
