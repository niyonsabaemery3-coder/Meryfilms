import { useMemo } from 'react'
import { Clapperboard, Eye, TrendingUp, Tags } from 'lucide-react'
import { useMovies } from '../../context/MoviesContext'
import { useLanguage } from '../../context/LanguageContext'
import { formatViews } from '../../utils/time'

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="bg-reel border border-reel-line rounded-xl p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-lg bg-amber/10 border border-amber/30 grid place-items-center text-amber shrink-0">
        <Icon size={19} />
      </div>
      <div>
        <p className="text-2xl font-display tracking-wide text-parchment leading-none">{value}</p>
        <p className="text-xs text-fog font-mono mt-1.5">{label}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { movies, categories } = useMovies()
  const { t, lang, categoryLabel } = useLanguage()

  const stats = useMemo(() => {
    const trending = movies.filter((m) => m.trending).length
    const totalViews = movies.reduce((sum, m) => sum + m.views, 0)
    return { total: movies.length, trending, totalViews, categories: categories.length }
  }, [movies, categories])

  const byCategory = useMemo(
    () =>
      categories.map((c) => ({
        ...c,
        count: movies.filter((m) => m.category === c.id).length,
      })),
    [movies, categories],
  )
  const maxCount = Math.max(1, ...byCategory.map((c) => c.count))

  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-display text-3xl tracking-wide text-parchment mb-1">{t.dash_title}</h1>
      <p className="text-fog text-sm mb-6 font-body">{t.dash_subtitle}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Clapperboard} label={t.dash_stat_total} value={stats.total} />
        <StatCard icon={TrendingUp} label={t.dash_stat_trending} value={stats.trending} />
        <StatCard icon={Eye} label={t.dash_stat_views} value={formatViews(stats.totalViews, lang).replace(/ (views|abarebye)$/, '')} />
        <StatCard icon={Tags} label={t.dash_stat_categories} value={stats.categories} />
      </div>

      <div className="bg-reel border border-reel-line rounded-xl p-6">
        <h2 className="font-display text-lg tracking-wide text-parchment mb-4">{t.dash_by_category}</h2>
        <div className="space-y-3">
          {byCategory.map((c) => (
            <div key={c.id} className="flex items-center gap-3">
              <span className="w-32 shrink-0 text-xs font-mono text-fog truncate">{categoryLabel(c.id, c.label)}</span>
              <div className="flex-1 h-2.5 rounded-full bg-void overflow-hidden">
                <div
                  className="h-full bg-amber rounded-full transition-all duration-500"
                  style={{ width: `${(c.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right text-xs font-mono text-parchment-dim">{c.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
