'use client'

import type { ReactNode } from 'react'

interface KwidTabsContentProps {
  value: string
  children?: ReactNode
  className?: string
}

export const KwidTabsContent = ({ value, children, className = '' }: KwidTabsContentProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

