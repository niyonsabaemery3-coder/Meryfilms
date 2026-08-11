import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { dict, categoryLabels, Lang, TranslationSet } from '../i18n/translations'

const STORAGE_KEY = 'meryfilms:lang'

type LanguageContextType = {
  lang: Lang
  toggleLang: () => void
  setLang: (l: Lang) => void
  t: TranslationSet
  categoryLabel: (id: string, fallback: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

function loadInitial(): Lang {
  if (typeof window === 'undefined') return 'rw'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'en' || stored === 'rw' ? stored : 'rw'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadInitial)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const setLang = (l: Lang) => setLangState(l)
  const toggleLang = () => setLangState((prev) => (prev === 'en' ? 'rw' : 'en'))

  const categoryLabel = (id: string, fallback: string) => categoryLabels[id]?.[lang] ?? fallback

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, t: dict[lang], categoryLabel }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
