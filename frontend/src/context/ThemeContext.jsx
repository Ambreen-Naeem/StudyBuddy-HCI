import { createContext, useContext, useEffect, useState, useCallback } from 'react'

// ---------------------------------------------------------------------------
// ThemeContext
// ---------------------------------------------------------------------------
// Light/dark theme provider. The active theme is applied by toggling the
// `dark` class on <html> (Tailwind's `darkMode: 'class'`) and persisted to
// localStorage. On first load we honor a saved preference, otherwise we fall
// back to the OS-level `prefers-color-scheme`.

const ThemeContext = createContext(null)

// Resolve the initial theme synchronously so the first paint matches.
function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage may be unavailable (private mode) — fall through to OS pref.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  // Apply the theme to <html> and persist whenever it changes.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme // native form controls / scrollbars follow.
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // Ignore persistence failures.
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    setThemeState(next === 'dark' ? 'dark' : 'light')
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
