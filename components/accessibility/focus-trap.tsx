/**
 * Focus Trap Component
 * Traps focus within a container (useful for modals, dialogs)
 * WCAG 2.1.2 (Level A) - No Keyboard Trap
 */

'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface FocusTrapProps {
  /** Content to trap focus within */
  children: ReactNode
  /** Whether the focus trap is active */
  active?: boolean
  /** Callback when user tries to escape */
  onEscape?: () => void
  /** Allow escape key to deactivate */
  escapeDeactivates?: boolean
}

export function FocusTrap({
  children,
  active = true,
  onEscape,
  escapeDeactivates = true,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    const container = containerRef.current
    if (!container) return

    // Get all focusable elements
    const getFocusableElements = (): HTMLElement[] => {
      const selector =
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      return Array.from(container.querySelectorAll(selector))
    }

    // Focus first element
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Escape key
      if (escapeDeactivates && event.key === 'Escape') {
        event.preventDefault()
        onEscape?.()
        return
      }

      // Handle Tab key
      if (event.key === 'Tab') {
        const focusableElements = getFocusableElements()
        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        // Shift + Tab (backwards)
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }
        }
        // Tab (forwards)
        else {
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)

      // Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [active, onEscape, escapeDeactivates])

  return (
    <div ref={containerRef} className="focus-trap-container">
      {children}
    </div>
  )
}
