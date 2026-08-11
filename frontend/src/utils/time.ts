export type Lang = 'en' | 'rw'

const UNIT_LABELS: Record<Lang, Record<'min' | 'hour' | 'day' | 'month' | 'year' | 'now', string>> = {
  en: { now: 'Just now', min: 'min', hour: 'h', day: 'day', month: 'mo', year: 'yr' },
  rw: { now: 'Vuba', min: 'min', hour: 'isaha', day: 'iminsi', month: 'ukwezi', year: 'umwaka' },
}

const SUFFIX: Record<Lang, string> = { en: 'ago', rw: 'ishize' }

// Formats a past timestamp as a single-unit relative label (e.g. "4min ago",
// "3 iminsi ishize") — intentionally not a full calendar date, per spec.
export function formatRelativeTime(timestampMs: number, lang: Lang = 'en'): string {
  const diffMs = Math.max(0, Date.now() - timestampMs)
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day
  const year = 365 * day

  const labels = UNIT_LABELS[lang]

  if (diffMs < minute) return labels.now
  if (diffMs < hour) {
    const v = Math.floor(diffMs / minute)
    return `${v}${lang === 'en' ? labels.min : ' ' + labels.min} ${SUFFIX[lang]}`
  }
  if (diffMs < day) {
    const v = Math.floor(diffMs / hour)
    return `${v}${lang === 'en' ? labels.hour : ' ' + labels.hour} ${SUFFIX[lang]}`
  }
  if (diffMs < month) {
    const v = Math.floor(diffMs / day)
    return `${v} ${labels.day} ${SUFFIX[lang]}`
  }
  if (diffMs < year) {
    const v = Math.floor(diffMs / month)
    return `${v} ${labels.month} ${SUFFIX[lang]}`
  }
  const v = Math.floor(diffMs / year)
  return `${v} ${labels.year} ${SUFFIX[lang]}`
}

export function formatViews(n: number, lang: Lang = 'en'): string {
  const compact = n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`
  return lang === 'en' ? `${compact} views` : `${compact} abarebye`
}

// Viewer-facing count — the site shows likes to visitors, never the raw
// view/viewer tally (that stays admin-only, in the dashboard and table).
export function formatLikes(n: number, lang: Lang = 'en'): string {
  const compact = n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`
  return lang === 'en' ? `${compact} likes` : `${compact} bakunze`
}
