import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import client, { TOKEN_KEY } from '../api/client'

// ---------------------------------------------------------------------------
// AuthContext
// ---------------------------------------------------------------------------
// Single source of truth for authentication state: the current user, the JWT,
// and the login/register/logout actions. The token is persisted in
// localStorage so a refresh keeps the user signed in.

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  // `loading` covers the initial "who am I?" check on app boot.
  const [loading, setLoading] = useState(true)

  // Persist (or clear) the token whenever it changes.
  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  }, [token])

  // On boot, if we have a token, fetch the current user to validate it.
  useEffect(() => {
    let active = true
    async function bootstrap() {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const { data } = await client.get('/auth/me')
        if (active) setUser(data.user || data)
      } catch {
        // Token invalid/expired — drop it silently.
        if (active) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    bootstrap()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await client.post('/auth/login', { email, password })
    setToken(data.token || data.access_token)
    setUser(data.user || null)
    return data
  }, [])

  const register = useCallback(async (payload) => {
    const { data } = await client.post('/auth/register', payload)
    // Some backends auto-login on register and return a token; support both.
    if (data.token || data.access_token) {
      setToken(data.token || data.access_token)
      setUser(data.user || null)
    }
    return data
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  // Allow pages (e.g. Profile) to update the cached user after an edit.
  const updateUser = useCallback((patch) => {
    setUser((prev) => ({ ...(prev || {}), ...patch }))
  }, [])

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Convenience hook with a guard so misuse fails loudly.
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
