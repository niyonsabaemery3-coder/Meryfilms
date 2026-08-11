import { FormEvent, ReactNode, useState } from 'react'
import { Lock, Mail, Clapperboard, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Real auth: this form calls the backend's /api/auth/login, which checks
// a bcrypt-hashed password and returns a JWT. The token is what actually
// gates every admin write (server-side, in requireAuth) — this component
// just decides whether to render the login form or the admin section.
export default function AdminGate({ children }: { children: ReactNode }) {
  const { isAuthed, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ntibishoboye kwinjira.")
    } finally {
      setLoading(false)
    }
  }

  if (isAuthed) return <>{children}</>

  return (
    <div className="min-h-screen grid place-items-center bg-void px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Clapperboard className="text-amber" size={22} />
          <span className="font-display text-xl tracking-wide text-parchment">
            MERY<span className="text-amber">ADMIN</span>
          </span>
        </div>

        <div className="flex items-center gap-2 bg-reel border border-reel-line rounded-lg px-3 h-12 focus-within:border-amber mb-3">
          <Mail size={15} className="text-fog shrink-0" />
          <input
            type="email"
            autoFocus
            autoComplete="username"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            placeholder="Email"
            className="bg-transparent outline-none text-sm text-parchment placeholder:text-fog w-full font-body"
          />
        </div>

        <div className="flex items-center gap-2 bg-reel border border-reel-line rounded-lg px-3 h-12 focus-within:border-amber">
          <Lock size={15} className="text-fog shrink-0" />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            placeholder="Ijambo ry'ibanga"
            className="bg-transparent outline-none text-sm text-parchment placeholder:text-fog w-full font-body"
          />
        </div>

        {error && <p className="text-ember text-xs font-mono mt-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-amber text-void font-semibold h-11 rounded-lg hover:bg-amber-soft transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          Injira
        </button>
      </form>
    </div>
  )
}
