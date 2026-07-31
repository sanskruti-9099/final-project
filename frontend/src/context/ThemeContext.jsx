import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext(undefined)

const STORAGE_KEY = 'ai-study-assistant-theme'

/**
 * ThemeProvider
 *
 * Manages a "dark" | "light" theme, persisted in localStorage.
 * Applies a `light` class to <body> when in light mode (dark is the default).
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'dark'
    } catch {
      return 'dark'
    }
  })

  // Sync <html> class whenever theme changes
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // storage unavailable — silently ignore
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const isDark = theme === 'dark'

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * useTheme — convenience hook.
 * Must be used within a <ThemeProvider>.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (ctx === undefined) {
    throw new Error('useTheme must be used within a <ThemeProvider>')
  }
  return ctx
}
