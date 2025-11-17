/**
 * Touch Target Component
 * Ensures minimum touch target size of 44x44px (Apple) or 48x48px (Material Design)
 * WCAG 2.5.5 (Level AAA) - Target Size
 */

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TouchTargetProps {
  children: ReactNode
  /** Minimum size: 'ios' (44px) or 'material' (48px) */
  size?: 'ios' | 'material' | 'auto'
  /** Additional className */
  className?: string
  /** Allow size to be smaller on desktop */
  responsiveSize?: boolean
}

export function TouchTarget({
  children,
  size = 'material',
  className,
  responsiveSize = true,
}: TouchTargetProps) {
  const minSize = size === 'ios' ? 'min-h-[44px] min-w-[44px]' : size === 'material' ? 'min-h-[48px] min-w-[48px]' : ''

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        // Apply minimum size
        responsiveSize ? `md:min-h-[auto] md:min-w-[auto] ${minSize}` : minSize,
        className
      )}
    >
      {children}
    </div>
  )
}
