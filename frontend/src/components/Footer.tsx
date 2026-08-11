import { Clapperboard } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="mt-16">
      <div className="sprocket-rule" />
      <div className="bg-reel px-4 sm:px-8 py-10 text-fog text-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-parchment">
            <Clapperboard className="text-amber" size={20} />
            <span className="font-display text-xl tracking-wide">MERY<span className="text-amber">FILMS</span></span>
          </div>
          <p className="font-mono text-xs">{t.footer_built_in} — {new Date().getFullYear()}</p>
        </div>
        <p className="mt-4 max-w-2xl text-xs leading-relaxed">{t.footer_disclaimer}</p>
      </div>
    </footer>
  )
}
