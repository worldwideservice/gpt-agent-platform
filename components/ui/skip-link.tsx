/**
 * Skip to Content Link
 * Allows keyboard users to skip navigation and jump directly to main content
 * WCAG 2.4.1 (Level A) - Bypass Blocks
 */

'use client'

import { cn } from '@/lib/utils'

interface SkipLinkProps {
  /** ID of the main content element to skip to */
  contentId?: string
  /** Custom label */
  label?: string
  /** Additional CSS classes */
  className?: string
}

export function SkipLink({
  contentId = 'main-content',
  label = 'Перейти к основному содержимому',
  className,
}: SkipLinkProps) {
  return (
    <a
      href={`#${contentId}`}
      className={cn(
        // Visually hidden by default
        'sr-only',
        // Visible on focus
        'focus:not-sr-only',
        'focus:absolute focus:left-4 focus:top-4 focus:z-50',
        'focus:rounded-md focus:bg-primary focus:px-4 focus:py-2',
        'focus:text-primary-foreground focus:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        // Animation
        'transition-all',
        className
      )}
    >
      {label}
    </a>
  )
}
