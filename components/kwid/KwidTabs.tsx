'use client'

import type { ReactNode } from 'react'

interface KwidTabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children?: ReactNode
  className?: string
}

export const KwidTabs = ({ defaultValue, value, onValueChange, children, className = '' }: KwidTabsProps) => {
  return (
    <div className={`tabs ${className}`}>
      {children}
    </div>
  )
}

