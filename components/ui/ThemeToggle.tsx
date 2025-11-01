'use client'

import { Moon, Sun, Monitor } from 'lucide-react'

import { KwidButton } from '@/components/kwid'
import { useTheme } from '@/contexts/ThemeContext'

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Светлая тема'
      case 'dark':
        return 'Темная тема'
      case 'system':
        return 'Системная тема'
      default:
        return 'Светлая тема'
    }
  }

  return (
    <KwidButton
      variant="outline"
      size="sm"
      onClick={cycleTheme}
      aria-label={`Переключить тему. Текущая: ${getLabel()}`}
      title={`Переключить тему. Текущая: ${getLabel()}`}
    >
      {getIcon()}
    </KwidButton>
  )
}
