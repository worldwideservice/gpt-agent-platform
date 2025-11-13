'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'gpt-agent-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(storageKey) as Theme | null
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      setTheme(stored)
    }
  }, [storageKey])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    root.classList.remove('light', 'dark')

    let effectiveTheme: 'light' | 'dark' = 'light'

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      effectiveTheme = systemTheme
    } else {
      effectiveTheme = theme
    }

    root.classList.add(effectiveTheme)
    setResolvedTheme(effectiveTheme)
    localStorage.setItem(storageKey, theme)
  }, [theme, mounted, storageKey])

  // Listen to system theme changes when in system mode
  useEffect(() => {
    if (!mounted || theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      const newTheme = e.matches ? 'dark' : 'light'
      root.classList.add(newTheme)
      setResolvedTheme(newTheme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, mounted])

  // Prevent flash of incorrect theme
  if (!mounted) {
    return <>{children}</>
  }

  const value: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
