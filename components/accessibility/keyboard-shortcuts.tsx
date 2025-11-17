/**
 * Keyboard Shortcuts Component
 * Displays available keyboard shortcuts to users
 * Supports custom shortcuts and provides accessible help dialog
 */

'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Keyboard } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface KeyboardShortcut {
  key: string
  /** Additional keys (e.g., ['Ctrl', 'Shift']) */
  modifiers?: string[]
  description: string
  /** Callback when shortcut is triggered */
  action?: () => void
  /** Category for grouping */
  category?: string
}

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[]
  /** Show trigger button */
  showButton?: boolean
  /** Enable shortcuts globally */
  enabled?: boolean
}

export function KeyboardShortcuts({
  shortcuts,
  showButton = true,
  enabled = true,
}: KeyboardShortcutsProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for help shortcut (? or Shift+/)
      if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        setOpen(true)
        return
      }

      // Check custom shortcuts
      for (const shortcut of shortcuts) {
        if (!shortcut.action) continue

        const modifiersMatch =
          shortcut.modifiers?.every((mod) => {
            if (mod === 'Ctrl') return event.ctrlKey || event.metaKey
            if (mod === 'Shift') return event.shiftKey
            if (mod === 'Alt') return event.altKey
            return false
          }) ?? true

        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()

        if (modifiersMatch && keyMatch) {
          event.preventDefault()
          shortcut.action()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, enabled])

  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      const category = shortcut.category || 'Общие'
      if (!acc[category]) acc[category] = []
      acc[category].push(shortcut)
      return acc
    },
    {} as Record<string, KeyboardShortcut[]>
  )

  return (
    <>
      {showButton && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Показать горячие клавиши"
              title="Горячие клавиши (нажмите ?)"
            >
              <Keyboard className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Горячие клавиши</DialogTitle>
              <DialogDescription>
                Используйте эти сочетания клавиш для быстрой навигации и действий
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-6">
              {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
                <div key={category}>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">{category}</h3>
                  <dl className="space-y-2">
                    {shortcuts.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-border p-2"
                      >
                        <dt className="text-sm text-muted-foreground">{shortcut.description}</dt>
                        <dd>
                          <ShortcutKeys modifiers={shortcut.modifiers} shortcutKey={shortcut.key} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}

              {/* Built-in shortcuts */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Системные</h3>
                <dl className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-border p-2">
                    <dt className="text-sm text-muted-foreground">
                      Показать это окно с подсказками
                    </dt>
                    <dd>
                      <ShortcutKeys shortcutKey="?" />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

/**
 * Visual representation of keyboard keys
 */
function ShortcutKeys({
  modifiers,
  shortcutKey,
}: {
  modifiers?: string[]
  shortcutKey: string
}) {
  const allKeys = [...(modifiers || []), shortcutKey]

  return (
    <div className="flex items-center gap-1">
      {allKeys.map((key, index) => (
        <kbd
          key={index}
          className={cn(
            'inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded border border-border',
            'bg-muted px-2 font-mono text-xs font-medium text-foreground shadow-sm'
          )}
        >
          {key}
        </kbd>
      ))}
    </div>
  )
}

/**
 * Common keyboard shortcuts for the platform
 */
export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'k',
    modifiers: ['Ctrl'],
    description: 'Открыть поиск',
    category: 'Навигация',
  },
  {
    key: 'b',
    modifiers: ['Ctrl'],
    description: 'Переключить боковую панель',
    category: 'Навигация',
  },
  {
    key: 'n',
    modifiers: ['Ctrl'],
    description: 'Создать нового агента',
    category: 'Действия',
  },
  {
    key: 's',
    modifiers: ['Ctrl'],
    description: 'Сохранить',
    category: 'Действия',
  },
  {
    key: '/',
    description: 'Перейти к поиску',
    category: 'Навигация',
  },
]
