import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import MovieRow from '../components/MovieRow'
import Footer from '../components/Footer'
import { HomeSkeleton } from '../components/Skeletons'
import { useMovies } from '../context/MoviesContext'
import { useLanguage } from '../context/LanguageContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { SearchX } from 'lucide-react'

// Netflix-style cap: the homepage shows a taste of each category, not the
// entire catalog rendered into the DOM at once. Tapping a category chip in
// the nav still shows that category's full list (unbounded) — only the
// homepage's side-by-side rows are capped, so the first paint stays fast
// no matter how large the catalog grows.
const HOME_ROW_LIMIT = 20

export default function Home() {
  const { movies, categories, isLoading } = useMovies()
  const { t, categoryLabel } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 200)

  useDocumentMeta({
    title: 'MeryFilms — Reba Agasobanuye ku buntu',
    description: 'MeryFilms: reba filime n\'ibiganiro nyarwanda, agasobanuye, ku buntu — amashusho meza, umuvuduko mwiza.',
  })

  const heroSlides = useMemo(() => {
    if (!movies.length) return []
    const featured = movies.filter((m) => m.featured)
    const base = featured.length ? featured : movies.slice(0, 1)
    const rest = movies.filter((m) => !base.includes(m)).slice(0, 3)
    return [...base, ...rest].slice(0, 4)
  }, [movies])

  const galleryMovies = useMemo(() => {
    const pool = movies.filter((m) => m.trending || m.featured)
    return (pool.length ? pool : movies).slice(0, 8)
  }, [movies])

  const filtered = useMemo(() => {
    let list = movies
    if (activeCategory !== 'all') list = list.filter((m) => m.category === activeCategory)
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.trim().toLowerCase()
      // Search matches the title, and also the narrator/uploader's name so
      // a viewer can look up everything by a specific "umusobanuzi".
      list = list.filter(
        (m) => m.title.toLowerCase().includes(q) || (m.uploadedBy ?? '').toLowerCase().includes(q),
      )
    }
    return list
  }, [movies, activeCategory, debouncedQuery])

  const isFiltering = activeCategory !== 'all' || debouncedQuery.trim().length > 0
  const activeCategoryData = categories.find((c) => c.id === activeCategory)

  if (isLoading) return <HomeSkeleton />

  return (
    <div className="min-h-screen">
      <Navbar
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onSearch={setQuery}
      />

      {!isFiltering && heroSlides.length > 0 && (
        <Hero backdropMovie={heroSlides[0]} posterMovies={galleryMovies} />
      )}

      <main className={isFiltering ? 'pt-24' : 'pt-8'}>
        {isFiltering ? (
          filtered.length ? (
            <MovieRow
              title={
                query
                  ? t.home_results_for(query)
                  : activeCategoryData
                  ? categoryLabel(activeCategoryData.id, activeCategoryData.label)
                  : t.nav_all
              }
              movies={filtered}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-fog px-4 text-center">
              <SearchX size={36} className="mb-3 text-reel-line" />
              <p className="font-body">{t.home_no_results}</p>
            </div>
          )
        ) : (
          <>
            <MovieRow title={t.home_trending_row} movies={movies.filter((m) => m.trending).slice(0, HOME_ROW_LIMIT)} />
            {categories.map((c) => (
              <MovieRow
                key={c.id}
                title={categoryLabel(c.id, c.label)}
                movies={movies.filter((m) => m.category === c.id).slice(0, HOME_ROW_LIMIT)}
              />
            ))}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
