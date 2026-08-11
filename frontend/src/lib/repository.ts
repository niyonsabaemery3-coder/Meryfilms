// Data access layer — every read/write to movies/categories/narrators goes
// through here. This now talks to the real MeryFilms backend instead of
// localStorage; the exported shape is unchanged so nothing in context/,
// pages/, or components/ needed to change.

import { api } from './api'
import { Movie, Category, Narrator } from '../data/movies'

type MoviesPage = { items: Movie[]; total: number; page: number; limit: number }

export const repository = {
  async getMovies(): Promise<Movie[]> {
    // limit=10000: the admin panel and MoviesContext both work with the
    // full catalog in memory (that's the bulk-sync pattern below), so we
    // fetch it all in one call rather than paginating here. If the catalog
    // grows past a few thousand titles, switch Home/rows to paged fetches.
    const page = await api.get<MoviesPage>('/api/movies?limit=10000')
    return page.items
  },
  async saveMovies(movies: Movie[]): Promise<void> {
    await api.put('/api/movies/bulk-sync', movies)
  },
  async getCategories(): Promise<Category[]> {
    return api.get<Category[]>('/api/categories')
  },
  async saveCategories(categories: Category[]): Promise<void> {
    await api.put('/api/categories/bulk-sync', categories)
  },
  async getNarrators(): Promise<Narrator[]> {
    return api.get<Narrator[]>('/api/narrators')
  },
  async saveNarrators(narrators: Narrator[]): Promise<void> {
    await api.put('/api/narrators/bulk-sync', narrators)
  },

  // Public engagement actions — call these directly from Watch.tsx; they
  // hit the backend immediately rather than waiting for the next bulk
  // saveMovies(), so a view/like/comment isn't lost if the tab closes.
  async recordView(id: string): Promise<{ views: number }> {
    return api.post(`/api/movies/${id}/view`)
  },
  async likeMovie(id: string): Promise<{ likes: number }> {
    return api.post(`/api/movies/${id}/like`)
  },
  async addComment(id: string, author: string, text: string) {
    return api.post(`/api/movies/${id}/comments`, { author, text })
  },
}
