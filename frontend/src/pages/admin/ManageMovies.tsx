import { useMemo, useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  UploadCloud,
  Film,
  ImagePlus,
  Loader2,
  ListOrdered,
  Layers,
  ChevronLeft,
  ChevronRight,
  Mic2,
} from 'lucide-react'
import { useMovies } from '../../context/MoviesContext'
import { Movie, SeriesStatus } from '../../data/movies'
import { useLanguage } from '../../context/LanguageContext'
import { formatRelativeTime, formatViews } from '../../utils/time'
import { loadSettings } from '../../utils/settings'
import SmartImage from '../../components/SmartImage'

type EpisodeSlot = { file: File | null; number: number }
type PartSlot = { file: File | null; label: string }

const nextLetter = (n: number) => {
  // A, B, C ... Z, AA, AB ... — simple base-26 letter sequence for default part labels
  let s = ''
  let x = n
  do {
    s = String.fromCharCode(65 + (x % 26)) + s
    x = Math.floor(x / 26) - 1
  } while (x >= 0)
  return s
}

const emptyDraft = () => ({
  title: '',
  category: '',
  synopsis: '',
  posterUrl: '', // manual override, optional
  trending: false,
  featured: false,
  seasonNumber: 1,
  status: 'ongoing' as SeriesStatus,
  uploadedBy: '',
})

// iTunes Search API is free, keyless, and CORS-friendly — used here as the
// public fallback source for cover art when no cover image was supplied.
async function fetchCoverFromPublicAPI(title: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(title)}&entity=movie&limit=1`,
    )
    if (!res.ok) return null
    const data = await res.json()
    const art: string | undefined = data?.results?.[0]?.artworkUrl100
    if (!art) return null
    return art.replace('100x100', '600x600')
  } catch {
    return null
  }
}

export default function ManageMovies() {
  const { movies, categories, narrators, addMovie, updateMovie, removeMovie, addNarrator } = useMovies()
  const { t, lang, categoryLabel } = useLanguage()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState(emptyDraft())
  const [isSeries, setIsSeries] = useState(false)
  const [moviePartSlots, setMoviePartSlots] = useState<PartSlot[]>([{ file: null, label: 'A' }])
  const [episodeSlots, setEpisodeSlots] = useState<EpisodeSlot[]>([{ file: null, number: 1 }])
  const [partSlots, setPartSlots] = useState<PartSlot[]>([{ file: null, label: 'Part 1' }])
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [newNarratorName, setNewNarratorName] = useState('')

  // Pagination — keeps the table usable once the admin has added a lot of
  // movies. Page size is the "Movies per page" value set on the Settings page.
  const [page, setPage] = useState(1)
  const pageSize = loadSettings().moviesPerPage
  const totalPages = Math.max(1, Math.ceil(movies.length / pageSize))
  // Clamp defensively (e.g. after removing movies leaves an empty last page)
  // without calling setState mid-render — just use the clamped value here.
  const currentPage = Math.min(page, totalPages)
  const pagedMovies = useMemo(
    () => movies.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [movies, currentPage, pageSize],
  )
  const goToPage = (p: number) => setPage(Math.min(totalPages, Math.max(1, p)))

  const openAdd = () => {
    setEditingId(null)
    setDraft({ ...emptyDraft(), category: categories[0]?.id ?? '' })
    setIsSeries(false)
    setMoviePartSlots([{ file: null, label: 'A' }])
    setEpisodeSlots([{ file: null, number: 1 }])
    setPartSlots([{ file: null, label: 'Part 1' }])
    setCoverFile(null)
    setCoverPreview('')
    setModalOpen(true)
  }

  const openEdit = (m: Movie) => {
    setEditingId(m.id)
    setDraft({
      title: m.title,
      category: m.category,
      synopsis: m.synopsis,
      posterUrl: m.poster,
      trending: !!m.trending,
      featured: !!m.featured,
      seasonNumber: m.seasonNumber ?? 1,
      status: m.status ?? 'ongoing',
      uploadedBy: m.uploadedBy ?? '',
    })
    setIsSeries((m.episodeTotal ?? 1) > 1)
    const isStandaloneWithParts = (m.episodeTotal ?? 1) <= 1 && !!m.parts?.length
    setMoviePartSlots(
      isStandaloneWithParts ? m.parts!.map((label) => ({ file: null, label })) : [{ file: null, label: 'A' }],
    )
    setEpisodeSlots(
      m.episodeFileNames?.length
        ? m.episodeFileNames.map((_, i) => ({ file: null, number: i + 1 }))
        : [{ file: null, number: 1 }],
    )
    setPartSlots(
      m.parts?.length ? m.parts.map((label) => ({ file: null, label })) : [{ file: null, label: 'Part 1' }],
    )
    setCoverFile(null)
    setCoverPreview(m.poster)
    setModalOpen(true)
  }

  const onCoverChosen = (file: File | null) => {
    setCoverFile(file)
    setCoverPreview(file ? URL.createObjectURL(file) : draft.posterUrl)
  }

  // Video parts for a standalone (non-series) movie — a single film can be
  // split into several files (A, B, C, D, E...), all uploaded together.
  const addMoviePartSlot = () =>
    setMoviePartSlots((prev) => [...prev, { file: null, label: nextLetter(prev.length) }])
  const removeMoviePartSlot = (idx: number) =>
    setMoviePartSlots((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev))
  const setMoviePartFile = (idx: number, file: File | null) =>
    setMoviePartSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, file } : s)))
  const setMoviePartLabel = (idx: number, label: string) =>
    setMoviePartSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, label } : s)))

  // Episodes (ongoing season) — admin can freely renumber each slot, which
  // covers bulk-editing multiple episodes at once (e.g. re-sequencing after
  // reordering, or jumping straight to EP 12 for a mid-season addition).
  const addEpisodeSlot = () =>
    setEpisodeSlots((prev) => [...prev, { file: null, number: prev.length ? prev[prev.length - 1].number + 1 : 1 }])
  const removeEpisodeSlot = (idx: number) =>
    setEpisodeSlots((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev))
  const setEpisodeFile = (idx: number, file: File | null) =>
    setEpisodeSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, file } : s)))
  const setEpisodeNumber = (idx: number, number: number) =>
    setEpisodeSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, number } : s)))
  const renumberEpisodes = () =>
    setEpisodeSlots((prev) => prev.map((s, i) => ({ ...s, number: i + 1 })))

  // Parts (finished season) — shown once the admin marks the season as done.
  const addPartSlot = () =>
    setPartSlots((prev) => [...prev, { file: null, label: `Part ${prev.length + 1}` }])
  const removePartSlot = (idx: number) =>
    setPartSlots((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev))
  const setPartFile = (idx: number, file: File | null) =>
    setPartSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, file } : s)))
  const setPartLabel = (idx: number, label: string) =>
    setPartSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, label } : s)))

  const save = async () => {
    if (!draft.title.trim() || !draft.category) return
    setSaving(true)

    const seed = draft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24) || Date.now().toString()

    let poster = coverFile ? URL.createObjectURL(coverFile) : draft.posterUrl.trim()
    if (!poster) {
      const found = await fetchCoverFromPublicAPI(draft.title.trim())
      poster = found || `https://picsum.photos/seed/${seed}/500/750`
    }
    const backdrop = `https://picsum.photos/seed/${seed}-wide/1600/900`

    const isFinished = isSeries && draft.status === 'finished'

    const episodeFileNames =
      isSeries && !isFinished
        ? episodeSlots.map((s) => s.file?.name).filter((n): n is string => !!n)
        : undefined
    const episodeTotal = isSeries && !isFinished ? Math.max(episodeSlots.length, 1) : 1
    const episodeCurrent =
      isSeries && !isFinished
        ? episodeSlots.reduce((max, s) => Math.max(max, s.number), 1)
        : 1

    const parts = isFinished
      ? partSlots.map((s) => s.label.trim()).filter(Boolean)
      : !isSeries
      ? moviePartSlots.map((s) => s.label.trim()).filter(Boolean)
      : undefined

    const existing = editingId ? movies.find((m) => m.id === editingId) : undefined

    const finalMovie: Movie = {
      id: editingId ?? `m-${Date.now()}`,
      title: draft.title.trim(),
      category: draft.category,
      synopsis: draft.synopsis,
      poster,
      backdrop,
      // Uploaded time and views are owned by the system, not editable here —
      // once a real backend exists, it will set/track these instead.
      uploadedAt: existing?.uploadedAt ?? Date.now(),
      views: existing?.views ?? 0,
      trending: draft.trending,
      featured: draft.featured,
      episodeCurrent,
      episodeTotal,
      videoFileName: !isSeries ? moviePartSlots[0]?.file?.name : undefined,
      episodeFileNames,
      seasonNumber: isSeries ? draft.seasonNumber : undefined,
      status: isSeries ? draft.status : undefined,
      parts,
      uploadedBy: draft.uploadedBy.trim() || undefined,
    }

    if (editingId) updateMovie(editingId, finalMovie)
    else addMovie(finalMovie)

    setSaving(false)
    setModalOpen(false)
  }

  // Quick-add a narrator right from this form, so the admin doesn't have to
  // jump to the Narrators page mid-upload — "adding a new narrator" (user).
  const addNarratorInline = () => {
    const trimmed = newNarratorName.trim()
    if (!trimmed) return
    const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24) || `n-${Date.now()}`
    addNarrator({ id, name: trimmed })
    setDraft((d) => ({ ...d, uploadedBy: trimmed }))
    setNewNarratorName('')
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-parchment mb-1">{t.movies_title}</h1>
          <p className="text-fog text-sm font-body">{t.movies_subtitle}</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-amber text-void font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-amber-soft transition-colors"
        >
          <Plus size={16} /> {t.movies_add}
        </button>
      </div>

      <div className="bg-reel border border-reel-line rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-reel-line text-fog font-mono text-xs uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-medium">{t.movies_table_movie}</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">{t.movies_table_category}</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">{t.movies_table_episodes}</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">{t.movies_table_uploaded}</th>
              <th className="text-left px-4 py-3 font-medium">{t.movies_table_views}</th>
              <th className="text-right px-4 py-3 font-medium">{t.movies_table_actions}</th>
            </tr>
          </thead>
          <tbody>
            {pagedMovies.map((m) => (
              <tr key={m.id} className="border-b border-reel-line/60 last:border-0 hover:bg-void/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <SmartImage src={m.poster} alt="" fallbackLabel={m.title} wrapperClassName="w-9 h-12 rounded shrink-0" className="object-cover" />
                    <div className="min-w-0">
                      <span className="text-parchment font-medium line-clamp-1 block">{m.title}</span>
                      {m.uploadedBy && (
                        <span className="text-[11px] font-mono text-fog inline-flex items-center gap-1">
                          <Mic2 size={10} className="text-amber" /> {m.uploadedBy}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-parchment-dim hidden sm:table-cell">
                  {categoryLabel(m.category, categories.find((c) => c.id === m.category)?.label ?? m.category)}
                </td>
                <td className="px-4 py-3 text-parchment-dim hidden sm:table-cell font-mono text-xs">
                  {(m.episodeTotal ?? 1) > 1 ? (
                    m.status === 'finished' ? (
                      <span className="text-amber">{m.parts?.length ?? 0} parts</span>
                    ) : (
                      <span>
                        S{m.seasonNumber ?? 1} · {m.episodeCurrent ?? 1}/{m.episodeTotal ?? 1}
                      </span>
                    )
                  ) : (
                    <span>{(m.episodeCurrent ?? 1)}/{(m.episodeTotal ?? 1)}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-parchment-dim hidden md:table-cell font-mono text-xs">
                  {formatRelativeTime(m.uploadedAt, lang)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-amber font-mono text-xs">
                    <Eye size={11} /> {formatViews(m.views, lang)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(m)}
                      aria-label={`${t.edit} ${m.title}`}
                      className="w-8 h-8 grid place-items-center rounded-lg border border-reel-line text-fog hover:text-amber hover:border-amber transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => removeMovie(m.id)}
                      aria-label={`${t.remove} ${m.title}`}
                      className="w-8 h-8 grid place-items-center rounded-lg border border-reel-line text-fog hover:text-ember hover:border-ember transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!movies.length && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-fog text-sm">
                  {t.movies_empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination — Previous/Next, sized by the "Movies per page" setting */}
      {movies.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs font-mono text-fog">{t.pagination_page_of(currentPage, totalPages)}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1 text-xs font-mono px-3 py-2 rounded-lg border border-reel-line text-parchment-dim hover:border-amber hover:text-amber transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-reel-line disabled:hover:text-parchment-dim"
            >
              <ChevronLeft size={14} /> {t.pagination_prev}
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1 text-xs font-mono px-3 py-2 rounded-lg border border-reel-line text-parchment-dim hover:border-amber hover:text-amber transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-reel-line disabled:hover:text-parchment-dim"
            >
              {t.pagination_next} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-void/80 backdrop-blur-sm px-4 py-8">
          <div className="bg-reel border border-reel-line rounded-xl w-full max-w-xl max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-reel-line sticky top-0 bg-reel z-10">
              <h2 className="font-display text-xl tracking-wide text-parchment">
                {editingId ? t.modal_edit_title : t.modal_add_title}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-fog hover:text-amber">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Movie title */}
              <div>
                <label className="block text-xs font-mono text-fog mb-1.5">{t.field_title}</label>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="w-full bg-void border border-reel-line rounded-lg px-3 py-2 text-sm text-parchment focus:border-amber outline-none"
                  placeholder="e.g. Umutima w'Ikirunga"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-mono text-fog mb-1.5">{t.field_category}</label>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  className="w-full bg-void border border-reel-line rounded-lg px-3 py-2 text-sm text-parchment focus:border-amber outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {categoryLabel(c.id, c.label)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Narrator (Umusobanuzi) — pick an existing one, or quick-add a new one right here */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono text-fog mb-1.5">
                  <Mic2 size={13} className="text-amber" /> {t.field_narrator}
                </label>
                <select
                  value={draft.uploadedBy}
                  onChange={(e) => setDraft({ ...draft, uploadedBy: e.target.value })}
                  className="w-full bg-void border border-reel-line rounded-lg px-3 py-2 text-sm text-parchment focus:border-amber outline-none mb-2"
                >
                  <option value="">{t.narrator_none}</option>
                  {narrators.map((n) => (
                    <option key={n.id} value={n.name}>
                      {n.name}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <input
                    value={newNarratorName}
                    onChange={(e) => setNewNarratorName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNarratorInline())}
                    placeholder={t.narrators_new_placeholder}
                    className="flex-1 bg-void border border-reel-line rounded-lg px-3 py-2 text-xs text-parchment focus:border-amber outline-none"
                  />
                  <button
                    type="button"
                    onClick={addNarratorInline}
                    className="inline-flex items-center gap-1 text-xs text-amber hover:text-amber-soft shrink-0"
                  >
                    <Plus size={13} /> {t.narrators_add}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono text-fog mb-1.5">{t.field_description}</label>
                <textarea
                  value={draft.synopsis}
                  onChange={(e) => setDraft({ ...draft, synopsis: e.target.value })}
                  rows={3}
                  className="w-full bg-void border border-reel-line rounded-lg px-3 py-2 text-sm text-parchment focus:border-amber outline-none resize-none"
                />
              </div>

              {/* Series toggle — selects whether this is a plain movie or a season */}
              <label className="flex items-center gap-2 text-sm text-parchment-dim bg-void border border-reel-line rounded-lg px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={isSeries}
                  onChange={(e) => setIsSeries(e.target.checked)}
                  className="accent-amber"
                />
                {t.is_series} — {t.is_series_hint}
              </label>

              {/* Season number + status, only relevant once it's a series */}
              {isSeries && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-fog mb-1.5">{t.field_season_number}</label>
                    <input
                      type="number"
                      min={1}
                      value={draft.seasonNumber}
                      onChange={(e) =>
                        setDraft({ ...draft, seasonNumber: Math.max(1, Number(e.target.value) || 1) })
                      }
                      className="w-full bg-void border border-reel-line rounded-lg px-3 py-2 text-sm text-parchment focus:border-amber outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-fog mb-1.5">{t.field_status}</label>
                    <select
                      value={draft.status}
                      onChange={(e) => setDraft({ ...draft, status: e.target.value as SeriesStatus })}
                      className="w-full bg-void border border-reel-line rounded-lg px-3 py-2 text-sm text-parchment focus:border-amber outline-none"
                    >
                      <option value="ongoing">{t.status_ongoing}</option>
                      <option value="finished">{t.status_finished}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Upload Movie — a standalone film can still be split into
                  several video parts (A, B, C, D...), all added at once */}
              {!isSeries ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono text-fog">{t.movie_parts_label}</label>
                    <button
                      onClick={addMoviePartSlot}
                      type="button"
                      className="inline-flex items-center gap-1 text-xs text-amber hover:text-amber-soft"
                    >
                      <Plus size={13} /> {t.add_part}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {moviePartSlots.map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          value={slot.label}
                          onChange={(e) => setMoviePartLabel(idx, e.target.value)}
                          placeholder={t.part_name_placeholder}
                          className="w-16 shrink-0 bg-void border border-reel-line rounded-lg px-2 py-2 text-xs text-parchment text-center focus:border-amber outline-none"
                        />
                        <label className="flex-1 flex items-center gap-2 border border-dashed border-reel-line rounded-lg px-3 py-2 cursor-pointer hover:border-amber transition-colors min-w-0">
                          <UploadCloud size={15} className="text-amber shrink-0" />
                          <span className="text-xs text-parchment-dim truncate">
                            {slot.file ? slot.file.name : t.upload_movie_placeholder}
                          </span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => setMoviePartFile(idx, e.target.files?.[0] ?? null)}
                          />
                        </label>
                        {moviePartSlots.length > 1 && (
                          <button
                            onClick={() => removeMoviePartSlot(idx)}
                            aria-label="Remove part"
                            className="w-8 h-8 shrink-0 grid place-items-center rounded-lg border border-reel-line text-fog hover:text-ember hover:border-ember transition-colors"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-fog mt-1.5 font-body">{t.parts_note(moviePartSlots.length)}</p>
                </div>
              ) : draft.status === 'ongoing' ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono text-fog">{t.episodes_label}</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={renumberEpisodes}
                        type="button"
                        className="inline-flex items-center gap-1 text-xs text-fog hover:text-amber"
                        title={t.renumber_episodes}
                      >
                        <ListOrdered size={13} /> {t.renumber_episodes}
                      </button>
                      <button
                        onClick={addEpisodeSlot}
                        type="button"
                        className="inline-flex items-center gap-1 text-xs text-amber hover:text-amber-soft"
                      >
                        <Plus size={13} /> {t.add_episode}
                      </button>
                    </div>
                  </div>
                  {/* Each slot's episode number is independently editable, so an
                      admin can bulk-adjust numbering across many episodes at once
                      (e.g. after inserting a special mid-season). */}
                  <div className="space-y-2">
                    {episodeSlots.map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-16 shrink-0 flex items-center gap-1 border border-reel-line rounded-lg px-1.5 py-1">
                          <span className="text-[10px] font-mono text-fog shrink-0">{t.episode_number_label}</span>
                          <input
                            type="number"
                            min={1}
                            value={slot.number}
                            onChange={(e) => setEpisodeNumber(idx, Math.max(1, Number(e.target.value) || 1))}
                            className="w-full bg-transparent text-xs font-mono text-parchment text-center outline-none"
                          />
                        </div>
                        <label className="flex-1 flex items-center gap-2 border border-dashed border-reel-line rounded-lg px-3 py-2 cursor-pointer hover:border-amber transition-colors min-w-0">
                          <Film size={15} className="text-amber shrink-0" />
                          <span className="text-xs text-parchment-dim truncate">
                            {slot.file ? slot.file.name : t.episode_placeholder(slot.number)}
                          </span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => setEpisodeFile(idx, e.target.files?.[0] ?? null)}
                          />
                        </label>
                        {episodeSlots.length > 1 && (
                          <button
                            onClick={() => removeEpisodeSlot(idx)}
                            aria-label="Remove episode"
                            className="w-8 h-8 shrink-0 grid place-items-center rounded-lg border border-reel-line text-fog hover:text-ember hover:border-ember transition-colors"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-fog mt-1.5 font-body">{t.episodes_note(episodeSlots.length)}</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-mono text-fog">
                      <Layers size={13} className="text-amber" /> {t.parts_label}
                    </label>
                    <button
                      onClick={addPartSlot}
                      type="button"
                      className="inline-flex items-center gap-1 text-xs text-amber hover:text-amber-soft"
                    >
                      <Plus size={13} /> {t.add_part}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {partSlots.map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          value={slot.label}
                          onChange={(e) => setPartLabel(idx, e.target.value)}
                          placeholder={t.part_name_placeholder}
                          className="w-28 shrink-0 bg-void border border-reel-line rounded-lg px-2 py-2 text-xs text-parchment focus:border-amber outline-none"
                        />
                        <label className="flex-1 flex items-center gap-2 border border-dashed border-reel-line rounded-lg px-3 py-2 cursor-pointer hover:border-amber transition-colors min-w-0">
                          <Film size={15} className="text-amber shrink-0" />
                          <span className="text-xs text-parchment-dim truncate">
                            {slot.file ? slot.file.name : t.part_file_placeholder(idx + 1)}
                          </span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => setPartFile(idx, e.target.files?.[0] ?? null)}
                          />
                        </label>
                        {partSlots.length > 1 && (
                          <button
                            onClick={() => removePartSlot(idx)}
                            aria-label="Remove part"
                            className="w-8 h-8 shrink-0 grid place-items-center rounded-lg border border-reel-line text-fog hover:text-ember hover:border-ember transition-colors"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-fog mt-1.5 font-body">{t.parts_note(partSlots.length)}</p>
                </div>
              )}

              {/* Cover image */}
              <div>
                <label className="block text-xs font-mono text-fog mb-1.5">{t.cover_label}</label>
                <div className="flex items-center gap-3">
                  {coverPreview ? (
                    <img src={coverPreview} alt="" className="w-14 h-20 object-cover rounded-lg border border-reel-line shrink-0" />
                  ) : (
                    <div className="w-14 h-20 rounded-lg border border-dashed border-reel-line shrink-0 grid place-items-center text-fog">
                      <ImagePlus size={16} />
                    </div>
                  )}
                  <div className="flex-1 space-y-2 min-w-0">
                    <label className="flex items-center gap-2 border border-dashed border-reel-line rounded-lg px-3 py-2 cursor-pointer hover:border-amber transition-colors">
                      <UploadCloud size={15} className="text-amber shrink-0" />
                      <span className="text-xs text-parchment-dim truncate">
                        {coverFile ? coverFile.name : t.cover_choose}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onCoverChosen(e.target.files?.[0] ?? null)}
                      />
                    </label>
                    <input
                      value={draft.posterUrl}
                      onChange={(e) => {
                        setDraft({ ...draft, posterUrl: e.target.value })
                        if (!coverFile) setCoverPreview(e.target.value)
                      }}
                      placeholder={t.cover_url_placeholder}
                      className="w-full bg-void border border-reel-line rounded-lg px-3 py-2 text-xs text-parchment focus:border-amber outline-none"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-fog mt-1.5 font-body">{t.cover_hint}</p>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-sm text-parchment-dim">
                  <input
                    type="checkbox"
                    checked={draft.trending}
                    onChange={(e) => setDraft({ ...draft, trending: e.target.checked })}
                    className="accent-amber"
                  />
                  {t.trending_checkbox}
                </label>
                <label className="flex items-center gap-2 text-sm text-parchment-dim">
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                    className="accent-amber"
                  />
                  {t.featured_checkbox}
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-reel-line sticky bottom-0 bg-reel">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-fog hover:text-parchment transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={save}
                disabled={!draft.title.trim() || !draft.category || saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-amber text-void hover:bg-amber-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? t.saving : t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
