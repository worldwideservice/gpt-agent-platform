'use client'

import type { ReactNode } from 'react'

interface KwidSectionProps {
  title?: string
  description?: string
  children?: ReactNode
}

export const KwidSection = ({ title, description, children }: KwidSectionProps) => {
  return (
    <div className="space-y-4">
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-slate-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

