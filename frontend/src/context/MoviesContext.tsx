import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { Movie, Category, Narrator } from '../data/movies'
import { repository } from '../lib/repository'

type MoviesContextType = {
  movies: Movie[]
  categories: Category[]
  narrators: Narrator[]
  // True only during the very first load. Every page can show a skeleton
  // instead of an empty flash, which is also exactly how this will behave
  // once `repository` is backed by a real network call.
  isLoading: boolean
  addMovie: (m: Movie) => void
  updateMovie: (id: string, patch: Partial<Movie>) => void
  removeMovie: (id: string) => void
  addCategory: (c: Category) => void
  removeCategory: (id: string) => void
  addNarrator: (n: Narrator) => void
  removeNarrator: (id: string) => void
}

const MoviesContext = createContext<MoviesContextType | null>(null)

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [narrators, setNarrators] = useState<Narrator[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([repository.getMovies(), repository.getCategories(), repository.getNarrators()]).then(
      ([m, c, n]) => {
        if (cancelled) return
        setMovies(m)
        setCategories(c)
        setNarrators(n)
        setIsLoading(false)
      },
    )
    return () => {
      cancelled = true
    }
  }, [])

  // Persist on every change, but skip the very first render (isLoading
  // still true / data just arrived) so we don't immediately re-write the
  // exact data we just read.
  useEffect(() => {
    if (isLoading) return
    repository.saveMovies(movies)
  }, [movies, isLoading])

  useEffect(() => {
    if (isLoading) return
    repository.saveCategories(categories)
  }, [categories, isLoading])

  useEffect(() => {
    if (isLoading) return
    repository.saveNarrators(narrators)
  }, [narrators, isLoading])

  const value = useMemo<MoviesContextType>(
    () => ({
      movies,
      categories,
      narrators,
      isLoading,
      addMovie: (m) => setMovies((prev) => [m, ...prev]),
      updateMovie: (id, patch) =>
        setMovies((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m))),
      removeMovie: (id) => setMovies((prev) => prev.filter((m) => m.id !== id)),
      addCategory: (c) => setCategories((prev) => [...prev, c]),
      removeCategory: (id) => setCategories((prev) => prev.filter((c) => c.id !== id)),
      addNarrator: (n) => setNarrators((prev) => (prev.some((x) => x.id === n.id) ? prev : [...prev, n])),
      removeNarrator: (id) => setNarrators((prev) => prev.filter((n) => n.id !== id)),
    }),
    [movies, categories, narrators, isLoading],
  )

  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>
}

export function useMovies() {
  const ctx = useContext(MoviesContext)
  if (!ctx) throw new Error('useMovies must be used within MoviesProvider')
  return ctx
}
