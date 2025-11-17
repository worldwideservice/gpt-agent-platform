/**
 * Visually Hidden Component
 * Hides content visually but keeps it accessible to screen readers
 * WCAG 1.3.1 (Level A) - Info and Relationships
 */

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface VisuallyHiddenProps {
  children: ReactNode
  /** Show on focus (useful for skip links) */
  focusable?: boolean
  /** HTML element to render */
  as?: keyof JSX.IntrinsicElements
  className?: string
}

export function VisuallyHidden({
  children,
  focusable = false,
  as: Component = 'span',
  className,
}: VisuallyHiddenProps) {
  return (
    <Component
      className={cn(
        // Screen reader only styles
        'sr-only',
        // Show on focus if specified
        focusable && 'focus:not-sr-only',
        className
      )}
    >
      {children}
    </Component>
  )
}

/**
 * Screen Reader Only Text
 * Shorthand for common use case
 */
export function SROnly({ children }: { children: ReactNode }) {
  return <VisuallyHidden>{children}</VisuallyHidden>
}
