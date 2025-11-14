'use client'

import type { CSSProperties } from 'react'

import Link from 'next/link'

import { brandTokens } from '@/design-tokens'

const skipLinkStyles: CSSProperties = {
  '--skip-link-bg': brandTokens.accent,
  '--skip-link-color': brandTokens.accentForeground,
}

/**
 * Skip Link Component
 * Accessibility: Allows keyboard users to skip to main content
 */
export function SkipLink() {
  return (
    <Link
      href="#main-content"
      style={skipLinkStyles}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:bg-[var(--skip-link-bg)] focus:text-[var(--skip-link-color)] focus:ring-[var(--skip-link-bg)] focus:ring-offset-2"
    >
      Перейти к основному содержимому
    </Link>
  )
}

