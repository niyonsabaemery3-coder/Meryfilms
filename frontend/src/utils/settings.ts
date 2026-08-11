const SETTINGS_KEY = 'meryfilms:settings'

export type SiteSettings = {
  siteName: string
  tagline: string
  supportEmail: string
  // How many rows show per page in the admin movies table before Next/Prev
  // pagination kicks in — keeps the list usable as the catalog grows.
  moviesPerPage: number
}

export const defaultSettings: SiteSettings = {
  siteName: 'MeryFilms',
  tagline: 'Reba. Yumva. Wishimire.',
  supportEmail: 'hello@meryfilms.rw',
  moviesPerPage: 10,
}

export function loadSettings(): SiteSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings
  } catch {
    return defaultSettings
  }
}

export function saveSettings(settings: SiteSettings) {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
