import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Search, X, Film, Clapperboard, Languages } from 'lucide-react'
import { Category } from '../data/movies'
import { useLanguage } from '../context/LanguageContext'

type Props = {
  categories: Category[]
  activeCategory: string
  onSelectCategory: (id: string) => void
  onSearch: (q: string) => void
}

export default function Navbar({ categories, activeCategory, onSelectCategory, onSearch }: Props) {
  const { t, lang, toggleLang, categoryLabel } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen ? 'bg-void/95 backdrop-blur-sm border-b border-reel-line' : 'bg-gradient-to-b from-void/90 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 sm:px-8 h-16">
        {/* Left: hamburger reveals the hidden category menu */}
        <div className="flex items-center gap-3">
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid place-items-center w-10 h-10 rounded-full border border-reel-line text-parchment hover:border-amber hover:text-amber transition-colors"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link to="/" className="flex items-center gap-2 select-none">
            <Clapperboard className="text-amber" size={22} strokeWidth={2.2} />
            <span className="font-display text-2xl tracking-wide text-parchment leading-none pt-0.5">
              MERY<span className="text-amber">FILMS</span>
            </span>
          </Link>
        </div>

        {/* Right: search + language + admin */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center overflow-hidden rounded-full border transition-all duration-300 ${
              searchOpen ? 'w-48 sm:w-72 border-amber bg-reel px-3' : 'w-10 border-reel-line'
            } h-10`}
          >
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className="grid place-items-center w-10 h-10 shrink-0 text-parchment hover:text-amber transition-colors"
            >
              <Search size={17} />
            </button>
            {searchOpen && (
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  onSearch(e.target.value)
                }}
                placeholder={t.nav_search_placeholder}
                className="bg-transparent outline-none text-sm text-parchment placeholder:text-fog w-full pr-2 font-body"
              />
            )}
          </div>

          <button
            onClick={toggleLang}
            aria-label="Switch language"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono tracking-wide text-fog hover:text-amber border border-reel-line hover:border-amber rounded-full px-3 h-10 transition-colors"
          >
            <Languages size={14} /> {lang.toUpperCase()}
          </button>

          <Link
            to="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono tracking-wide text-fog hover:text-amber border border-reel-line hover:border-amber rounded-full px-3 h-10 transition-colors"
          >
            <Film size={14} /> {t.nav_admin}
          </Link>
        </div>
      </div>

      {/* Hidden category menu, revealed by hamburger */}
      <div
        className={`grid transition-all duration-300 ease-out overflow-hidden ${
          menuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <nav className="min-h-0 border-t border-reel-line px-4 sm:px-8 py-4">
          <ul className="flex flex-wrap gap-2">
            <li>
              <button
                onClick={() => {
                  onSelectCategory('all')
                  setMenuOpen(false)
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-body transition-colors border ${
                  activeCategory === 'all'
                    ? 'bg-amber text-void border-amber font-semibold'
                    : 'border-reel-line text-parchment-dim hover:border-amber hover:text-amber'
                }`}
              >
                {t.nav_all}
              </button>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => {
                    onSelectCategory(c.id)
                    setMenuOpen(false)
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-body transition-colors border ${
                    activeCategory === c.id
                      ? 'bg-amber text-void border-amber font-semibold'
                      : 'border-reel-line text-parchment-dim hover:border-amber hover:text-amber'
                  }`}
                >
                  {categoryLabel(c.id, c.label)}
                </button>
              </li>
            ))}
            <li className="flex items-center gap-2 sm:hidden">
              <button
                onClick={toggleLang}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm border border-reel-line text-fog"
              >
                <Languages size={13} /> {lang.toUpperCase()}
              </button>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm border border-reel-line text-fog"
              >
                <Film size={13} /> {t.nav_admin}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
