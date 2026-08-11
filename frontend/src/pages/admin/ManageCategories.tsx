import { useState } from 'react'
import { Plus, Trash2, Tags } from 'lucide-react'
import { useMovies } from '../../context/MoviesContext'
import { useLanguage } from '../../context/LanguageContext'

export default function ManageCategories() {
  const { categories, movies, addCategory, removeCategory } = useMovies()
  const { t, categoryLabel } = useLanguage()
  const [label, setLabel] = useState('')

  const submit = () => {
    const trimmed = label.trim()
    if (!trimmed) return
    const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24)
    if (categories.some((c) => c.id === id)) return
    addCategory({ id, label: trimmed })
    setLabel('')
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-display text-3xl tracking-wide text-parchment mb-1">{t.categories_title}</h1>
      <p className="text-fog text-sm mb-6 font-body">{t.categories_subtitle}</p>

      <div className="flex gap-3 mb-6 max-w-md">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={t.categories_new_placeholder}
          className="flex-1 bg-reel border border-reel-line rounded-lg px-3 py-2.5 text-sm text-parchment focus:border-amber outline-none"
        />
        <button
          onClick={submit}
          className="inline-flex items-center gap-2 bg-amber text-void font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-amber-soft transition-colors shrink-0"
        >
          <Plus size={16} /> {t.categories_add}
        </button>
      </div>

      <div className="bg-reel border border-reel-line rounded-xl divide-y divide-reel-line">
        {categories.map((c) => {
          const count = movies.filter((m) => m.category === c.id).length
          return (
            <div key={c.id} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <Tags size={16} className="text-amber" />
                <span className="text-parchment text-sm font-medium">{categoryLabel(c.id, c.label)}</span>
                <span className="text-xs font-mono text-fog border border-reel-line rounded-full px-2 py-0.5">
                  {t.categories_count(count)}
                </span>
              </div>
              <button
                onClick={() => removeCategory(c.id)}
                aria-label={`${t.remove} ${c.label}`}
                className="w-8 h-8 grid place-items-center rounded-lg border border-reel-line text-fog hover:text-ember hover:border-ember transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )
        })}
        {!categories.length && (
          <p className="px-5 py-8 text-center text-fog text-sm">{t.categories_empty}</p>
        )}
      </div>
    </div>
  )
}
