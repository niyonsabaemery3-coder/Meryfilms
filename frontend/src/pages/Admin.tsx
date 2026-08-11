import { NavLink, Route, Routes } from 'react-router-dom'
import { LayoutDashboard, Clapperboard, Tags, Mic2, Settings as SettingsIcon, ArrowLeft, LogOut } from 'lucide-react'
import Dashboard from './admin/Dashboard'
import ManageMovies from './admin/ManageMovies'
import ManageCategories from './admin/ManageCategories'
import ManageNarrators from './admin/ManageNarrators'
import SettingsPage from './admin/Settings'
import AdminGate from './AdminGate'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

export default function Admin() {
  const { t } = useLanguage()
  const { logout } = useAuth()

  const navItems = [
    { to: '/admin', label: t.admin_nav_dashboard, icon: LayoutDashboard, end: true },
    { to: '/admin/movies', label: t.admin_nav_movies, icon: Clapperboard, end: false },
    { to: '/admin/categories', label: t.admin_nav_categories, icon: Tags, end: false },
    { to: '/admin/narrators', label: t.admin_nav_narrators, icon: Mic2, end: false },
    { to: '/admin/settings', label: t.admin_nav_settings, icon: SettingsIcon, end: false },
  ]

  return (
    <AdminGate>
    <div className="min-h-screen bg-void md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 border-r border-reel-line bg-reel/60 flex-col">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-reel-line">
          <Clapperboard className="text-amber" size={20} />
          <span className="font-display text-lg tracking-wide text-parchment">
            MERY<span className="text-amber">ADMIN</span>
          </span>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors ${
                  isActive
                    ? 'bg-amber/10 text-amber border border-amber/30'
                    : 'text-fog hover:text-parchment hover:bg-reel-line/40 border border-transparent'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-reel-line space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-fog hover:text-amber transition-colors"
          >
            <ArrowLeft size={16} /> {t.admin_nav_back}
          </NavLink>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-fog hover:text-ember transition-colors"
          >
            <LogOut size={16} /> Sohoka
          </button>
        </div>
      </aside>

      {/* Mobile top bar — a horizontally scrollable strip of tabs instead of
          a fixed-width sidebar, so the admin panel stays usable on a phone. */}
      <header className="md:hidden sticky top-0 z-40 bg-void/95 backdrop-blur-sm border-b border-reel-line">
        <div className="h-14 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Clapperboard className="text-amber" size={19} />
            <span className="font-display text-base tracking-wide text-parchment">
              MERY<span className="text-amber">ADMIN</span>
            </span>
          </div>
          <NavLink to="/" className="text-fog hover:text-amber transition-colors" aria-label={t.admin_nav_back}>
            <ArrowLeft size={18} />
          </NavLink>
        </div>
        <nav className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-body border transition-colors ${
                  isActive
                    ? 'bg-amber/10 text-amber border-amber/40'
                    : 'text-fog border-reel-line hover:text-parchment'
                }`
              }
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="flex-1 min-w-0">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="movies" element={<ManageMovies />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="narrators" element={<ManageNarrators />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
    </AdminGate>
  )
}
