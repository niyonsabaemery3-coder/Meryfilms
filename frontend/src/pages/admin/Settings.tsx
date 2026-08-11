import { useState } from 'react'
import { Save, RotateCcw } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { SiteSettings, defaultSettings, loadSettings, saveSettings } from '../../utils/settings'

export default function Settings() {
  const { t } = useLanguage()
  const [settings, setSettings] = useState<SiteSettings>(loadSettings)
  const [savedFlash, setSavedFlash] = useState(false)

  const save = () => {
    saveSettings(settings)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1800)
  }

  const reset = () => {
    setSettings(defaultSettings)
    saveSettings(defaultSettings)
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-display text-3xl tracking-wide text-parchment mb-1">{t.settings_title}</h1>
      <p className="text-fog text-sm mb-6 font-body">{t.settings_subtitle}</p>

      <div className="bg-reel border border-reel-line rounded-xl p-6 max-w-lg space-y-5">
        <div>
          <label className="block text-xs font-mono text-fog mb-1.5">{t.settings_site_name}</label>
          <input
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="w-full bg-void border border-reel-line rounded-lg px-3 py-2.5 text-sm text-parchment focus:border-amber outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-fog mb-1.5">{t.settings_tagline}</label>
          <input
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            className="w-full bg-void border border-reel-line rounded-lg px-3 py-2.5 text-sm text-parchment focus:border-amber outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-fog mb-1.5">{t.settings_support_email}</label>
          <input
            value={settings.supportEmail}
            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            className="w-full bg-void border border-reel-line rounded-lg px-3 py-2.5 text-sm text-parchment focus:border-amber outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-fog mb-1.5">{t.settings_movies_per_page}</label>
          <input
            type="number"
            min={5}
            max={100}
            value={settings.moviesPerPage}
            onChange={(e) =>
              setSettings({ ...settings, moviesPerPage: Math.min(100, Math.max(5, Number(e.target.value) || 10)) })
            }
            className="w-32 bg-void border border-reel-line rounded-lg px-3 py-2.5 text-sm text-parchment focus:border-amber outline-none"
          />
          <p className="text-[11px] text-fog mt-1.5 font-body">{t.settings_movies_per_page_hint}</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={save}
            className="inline-flex items-center gap-2 bg-amber text-void font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-amber-soft transition-colors"
          >
            <Save size={15} /> {t.settings_save}
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 border border-reel-line text-fog text-sm px-4 py-2.5 rounded-lg hover:text-amber hover:border-amber transition-colors"
          >
            <RotateCcw size={14} /> {t.settings_reset}
          </button>
          {savedFlash && <span className="text-xs font-mono text-amber">{t.settings_saved}</span>}
        </div>
      </div>
    </div>
  )
}
