import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Clapperboard,
  Heart,
  MessageCircle,
  Clock3,
  CornerDownRight,
  Play,
  Download,
} from 'lucide-react'
import { useMovies } from '../context/MoviesContext'
import { useLanguage } from '../context/LanguageContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { formatRelativeTime } from '../utils/time'
import { MovieComment } from '../data/movies'
import MovieCard from '../components/MovieCard'
import SmartImage from '../components/SmartImage'

// Public-domain sample video used as a stand-in player source for this
// database-free demo. Swap this for the real uploaded file once a backend
// exists to actually store and stream video.
const DEMO_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

// How many comments show before the rest are tucked away.
const COMMENT_LIMIT = 6

// Which movies the visitor has liked, in this browser only — there's no
// account system yet, so a like is just a local flag keyed by movie id.
const LIKED_KEY = 'meryfilms:liked'

function loadLiked(): Record<string, boolean> {
  try {
    return JSON.parse(window.localStorage.getItem(LIKED_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export default function Watch() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { movies, updateMovie } = useMovies()
  const { t, lang } = useLanguage()
  const [activeEpisode, setActiveEpisode] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const countedRef = useRef<string | null>(null)
  const playerRef = useRef<HTMLDivElement>(null)

  const [liked, setLiked] = useState<Record<string, boolean>>(() => loadLiked())
  const [commentName, setCommentName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [showAllComments, setShowAllComments] = useState(false)

  const movie = movies.find((m) => m.id === id)
  const totalEpisodes = movie?.episodeTotal ?? 1
  const isSeries = totalEpisodes > 1
  const hasParts = !!movie?.parts?.length
  const related = useMemo(
    () => (movie ? movies.filter((m) => m.category === movie.category && m.id !== movie.id) : []),
    [movie, movies],
  )

  // Reset the "poster + play button" state whenever a different title loads.
  useEffect(() => {
    setIsPlaying(false)
    setActiveEpisode(1)
    setShowAllComments(false)
  }, [id])

  // Count this as a view once per movie per visit — still tracked for the
  // admin dashboard, just no longer surfaced to viewers here.
  useEffect(() => {
    if (movie && countedRef.current !== movie.id) {
      countedRef.current = movie.id
      updateMovie(movie.id, { views: movie.views + 1 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie?.id])

  useDocumentMeta({
    title: movie ? `${movie.title} — MeryFilms` : 'MeryFilms',
    description: movie?.synopsis,
  })

  if (!movie) {
    return (
      <div className="min-h-screen grid place-items-center px-4 text-center">
        <div>
          <p className="text-parchment font-body mb-4">{t.watch_not_found}</p>
          <Link to="/" className="text-amber hover:text-amber-soft text-sm font-mono">
            {t.watch_back_home}
          </Link>
        </div>
      </div>
    )
  }

  const isLiked = !!liked[movie.id]
  const allComments = movie.comments ?? []
  const comments = showAllComments ? allComments : allComments.slice(0, COMMENT_LIMIT)
  const hiddenCount = allComments.length - comments.length

  // Rows for the "Watch / Download" list: episodes, parts, or a single
  // movie row — whichever applies to this title.
  const watchRows = hasParts
    ? movie.parts!.map((label, i) => ({ key: `part-${i}`, label, index: i + 1 }))
    : isSeries
    ? Array.from({ length: totalEpisodes }, (_, i) => ({
        key: `ep-${i + 1}`,
        label: `${t.watch_episode} ${i + 1}`,
        index: i + 1,
      }))
    : [{ key: 'movie', label: t.card_movie, index: 1 }]

  const startPlaying = (episodeIndex: number) => {
    setActiveEpisode(episodeIndex)
    setIsPlaying(true)
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const toggleLike = () => {
    const nextLiked = !isLiked
    setLiked((prev) => {
      const next = { ...prev, [movie.id]: nextLiked }
      window.localStorage.setItem(LIKED_KEY, JSON.stringify(next))
      return next
    })
    updateMovie(movie.id, { likes: Math.max(0, (movie.likes ?? 0) + (nextLiked ? 1 : -1)) })
  }

  const submitComment = () => {
    if (!commentText.trim()) return
    const newComment: MovieComment = {
      id: `c_${Date.now()}`,
      author: commentName.trim() || 'Anonymous',
      text: commentText.trim(),
      createdAt: Date.now(),
      replies: [],
    }
    updateMovie(movie.id, { comments: [newComment, ...allComments] })
    setCommentText('')
  }

  const submitReply = (parentId: string) => {
    if (!replyText.trim()) return
    const newReply: MovieComment = {
      id: `r_${Date.now()}`,
      author: commentName.trim() || 'Anonymous',
      text: replyText.trim(),
      createdAt: Date.now(),
    }
    updateMovie(movie.id, {
      comments: allComments.map((c) => (c.id === parentId ? { ...c, replies: [...(c.replies ?? []), newReply] } : c)),
    })
    setReplyText('')
    setReplyingTo(null)
  }

  return (
    <div className="min-h-screen">
      <header className="h-16 flex items-center gap-3 px-4 sm:px-8 border-b border-reel-line bg-void/80 backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          aria-label={t.watch_back}
          className="w-9 h-9 grid place-items-center rounded-full border border-reel-line text-parchment hover:border-amber hover:text-amber transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <Link to="/" className="flex items-center gap-2 select-none">
          <Clapperboard className="text-amber" size={19} />
          <span className="font-display text-xl tracking-wide text-parchment leading-none pt-0.5">
            MERY<span className="text-amber">FILMS</span>
          </span>
        </Link>
      </header>

      <div className="lg:flex lg:items-start lg:gap-8 px-0 lg:px-8 pt-0 lg:pt-6">
        {/* Left: player + details */}
        <div className="flex-1 min-w-0">
          {/* Player — shows the backdrop with a center play button until tapped */}
          <div ref={playerRef} className="relative w-full bg-black aspect-video max-h-[75vh] lg:rounded-xl overflow-hidden">
            {isPlaying ? (
              <video
                key={`${movie.id}-${activeEpisode}`}
                className="w-full h-full object-contain bg-black"
                poster={movie.backdrop}
                controls
                autoPlay
              >
                <source src={DEMO_VIDEO_URL} type="video/mp4" />
              </video>
            ) : (
              <button
                onClick={() => startPlaying(activeEpisode)}
                className="group relative w-full h-full block"
                aria-label={t.hero_watch_now}
              >
                <SmartImage
                  src={movie.backdrop}
                  alt=""
                  fallbackLabel={movie.title}
                  wrapperClassName="absolute inset-0 h-full"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-void/40 group-hover:bg-void/25 transition-colors" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-ember/90 text-parchment grid place-items-center shadow-glow scale-95 group-hover:scale-100 transition-transform duration-300">
                    <Play size={30} fill="currentColor" />
                  </span>
                </span>
              </button>
            )}
          </div>
          <p className="text-center text-[11px] font-mono text-fog/70 py-1.5 px-4">{t.watch_demo_notice}</p>

          <main className="px-4 sm:px-8 pt-4 pb-4">
            <div className="max-w-3xl">
              <h1 className="font-display text-3xl sm:text-4xl tracking-wide text-parchment mb-2">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-ember text-parchment text-[11px] font-bold tracking-wide px-2 py-1 rounded">
                  {movie.category.toUpperCase()}
                </span>
                {isSeries && !hasParts && (
                  <span className="bg-amber text-void text-[11px] font-bold tracking-wide px-2 py-1 rounded">
                    {t.card_season.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-fog font-mono mb-4">
                <span className="w-7 h-7 rounded-full bg-reel border border-reel-line grid place-items-center text-amber text-xs font-bold shrink-0">
                  {(movie.uploadedBy || t.card_uploader_fallback).charAt(0).toUpperCase()}
                </span>
                <span className="text-parchment-dim">{movie.uploadedBy || t.card_uploader_fallback}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-fog font-mono mb-4">
                <span className="inline-flex items-center gap-1">
                  <Clock3 size={12} /> {formatRelativeTime(movie.uploadedAt, lang)}
                </span>
                <button
                  onClick={toggleLike}
                  aria-pressed={isLiked}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors ${
                    isLiked
                      ? 'border-ember text-ember bg-ember/10'
                      : 'border-reel-line text-fog hover:border-ember hover:text-ember'
                  }`}
                >
                  <Heart size={12} fill={isLiked ? 'currentColor' : 'none'} />
                  {(movie.likes ?? 0).toLocaleString()} {isLiked ? t.watch_liked : t.watch_like}
                </button>
                <span className="inline-flex items-center gap-1 text-fog">
                  <MessageCircle size={12} /> {allComments.length}
                </span>
              </div>
              <p className="text-parchment-dim text-sm sm:text-base leading-relaxed">{movie.synopsis}</p>
            </div>

            {/* Watch / Download list */}
            <div className="mt-8 max-w-3xl">
              <h2 className="font-display text-xl tracking-wide text-parchment mb-3">{t.watch_download_section}</h2>
              <div className="flex flex-col gap-2">
                {watchRows.map((row) => (
                  <div
                    key={row.key}
                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border transition-colors ${
                      isPlaying && row.index === activeEpisode
                        ? 'bg-amber/10 border-amber'
                        : 'border-reel-line hover:border-amber/50'
                    }`}
                  >
                    <span className="text-parchment font-body text-sm sm:text-base truncate">{row.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => startPlaying(row.index)}
                        className="inline-flex items-center gap-1.5 bg-ember text-parchment font-semibold px-4 py-2 rounded-md hover:bg-ember-soft transition-colors text-sm"
                      >
                        <Play size={14} fill="currentColor" /> {t.watch_watch_btn}
                      </button>
                      <button
                        onClick={() => window.open(movie.poster, '_blank', 'noopener')}
                        className="inline-flex items-center gap-1.5 border border-reel-line text-parchment px-4 py-2 rounded-md hover:border-amber hover:text-amber transition-colors text-sm"
                      >
                        <Download size={14} /> {t.watch_download_btn}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments + replies, capped at COMMENT_LIMIT */}
            <div className="mt-10 max-w-3xl">
              <h2 className="font-display text-xl tracking-wide text-parchment mb-4 flex items-center gap-2">
                <MessageCircle size={18} className="text-amber" /> {t.watch_comments} ({allComments.length})
              </h2>

              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder={t.watch_comment_name_placeholder}
                  className="w-full sm:w-48 bg-reel border border-reel-line rounded-lg px-3 py-2 text-sm text-parchment placeholder:text-fog/60 focus:outline-none focus:border-amber"
                />
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                  placeholder={t.watch_comment_placeholder}
                  className="flex-1 bg-reel border border-reel-line rounded-lg px-3 py-2 text-sm text-parchment placeholder:text-fog/60 focus:outline-none focus:border-amber"
                />
                <button
                  onClick={submitComment}
                  className="bg-amber text-void font-semibold px-4 py-2 rounded-lg hover:bg-amber-soft transition-colors text-sm shrink-0"
                >
                  {t.watch_comment_submit}
                </button>
              </div>

              {allComments.length === 0 ? (
                <p className="text-fog text-sm font-body">{t.watch_comment_empty}</p>
              ) : (
                <>
                  <ul className="space-y-4">
                    {comments.map((c) => (
                      <li key={c.id} className="border border-reel-line rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm mb-1">
                          <span className="text-parchment font-medium">{c.author}</span>
                          <span className="text-fog text-[11px] font-mono">{formatRelativeTime(c.createdAt, lang)}</span>
                        </div>
                        <p className="text-parchment-dim text-sm leading-relaxed mb-2">{c.text}</p>
                        <button
                          onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                          className="inline-flex items-center gap-1 text-xs text-amber hover:text-amber-soft font-mono"
                        >
                          <CornerDownRight size={12} /> {t.watch_comment_reply}
                        </button>

                        {replyingTo === c.id && (
                          <div className="flex flex-col sm:flex-row gap-2 mt-2">
                            <input
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && submitReply(c.id)}
                              placeholder={t.watch_comment_reply_placeholder}
                              className="flex-1 bg-reel border border-reel-line rounded-lg px-3 py-2 text-sm text-parchment placeholder:text-fog/60 focus:outline-none focus:border-amber"
                            />
                            <button
                              onClick={() => submitReply(c.id)}
                              className="bg-amber text-void font-semibold px-4 py-2 rounded-lg hover:bg-amber-soft transition-colors text-sm shrink-0"
                            >
                              {t.watch_comment_submit}
                            </button>
                          </div>
                        )}

                        {!!c.replies?.length && (
                          <ul className="mt-3 pl-4 border-l border-reel-line space-y-3">
                            {c.replies.map((r) => (
                              <li key={r.id}>
                                <div className="flex items-center gap-2 text-sm mb-1">
                                  <span className="text-parchment font-medium">{r.author}</span>
                                  <span className="text-fog text-[11px] font-mono">{formatRelativeTime(r.createdAt, lang)}</span>
                                </div>
                                <p className="text-parchment-dim text-sm leading-relaxed">{r.text}</p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>

                  {hiddenCount > 0 && (
                    <button
                      onClick={() => setShowAllComments(true)}
                      className="mt-4 text-sm font-mono text-amber hover:text-amber-soft"
                    >
                      {t.watch_comments_more(hiddenCount)}
                    </button>
                  )}
                </>
              )}
            </div>
          </main>
        </div>

        {/* Right: related movies, same card size as everywhere else */}
        {related.length > 0 && (
          <aside className="lg:w-[640px] shrink-0 px-4 sm:px-8 lg:px-0 pt-8 lg:pt-0">
            <h2 className="font-display text-xl tracking-wide text-parchment mb-3">{t.row_related}</h2>
            <div className="flex flex-wrap gap-4">
              {related.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
