import { createContext, useContext, useState, ReactNode } from 'react'
import { api, getToken, setToken, clearToken, ApiError } from '../lib/api'

type AdminUser = { id: string; name: string; email: string; role: string }

type AuthContextType = {
  isAuthed: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState<boolean>(() => Boolean(getToken()))

  const login = async (email: string, password: string) => {
    try {
      const { token } = await api.post<{ token: string; user: AdminUser }>('/api/auth/login', {
        email,
        password,
      })
      setToken(token)
      setIsAuthed(true)
    } catch (err) {
      if (err instanceof ApiError) throw new Error(err.message)
      throw new Error("Ntibishoboye kwinjira. Ongera ugerageze.")
    }
  }

  const logout = () => {
    clearToken()
    setIsAuthed(false)
  }

  return <AuthContext.Provider value={{ isAuthed, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
