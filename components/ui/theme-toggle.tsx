'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui'
import { useTheme } from '@/lib/providers/theme-provider'

/**
 * Theme Toggle Component
 * Switches between light and dark mode using ThemeProvider
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  const accessibleLabel =
    resolvedTheme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 transition-colors hover:bg-brand-accent/10"
      aria-label={accessibleLabel}
      aria-pressed={resolvedTheme === 'dark'}
    >
      {resolvedTheme === 'light' ? (
        <Moon className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Sun className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  )
}

