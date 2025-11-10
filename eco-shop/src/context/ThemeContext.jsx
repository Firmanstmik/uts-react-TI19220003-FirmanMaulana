import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext({ darkMode: false, toggleTheme: () => {} })

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    }
  }, [darkMode])

  const value = useMemo(
    () => ({
      darkMode,
      setDarkMode,
      toggleTheme: () => setDarkMode((prev) => !prev),
    }),
    [darkMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

