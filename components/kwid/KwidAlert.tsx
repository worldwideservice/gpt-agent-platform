'use client'

import * as React from 'react'
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { KwidButton } from './KwidButton'

/**
 * Kwid Alert компонент - уведомления (Filament стиль)
 */
export interface KwidAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
}

const alertVariants = {
  default: 'bg-white border-gray-200 text-gray-900 dark:bg-gray-900 dark:border-gray-800 dark:text-white',
  success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-100',
  danger: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100',
  info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100',
}

const alertIcons = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
}

function KwidAlert({
  className,
  variant = 'default',
  title,
  dismissible = false,
  onDismiss,
  children,
  ...props
}: KwidAlertProps) {
  const Icon = alertIcons[variant]

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4',
        alertVariants[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          {title && (
            <h4 className="text-sm font-semibold mb-1">{title}</h4>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && (
          <KwidButton
            variant="outline"
            size="sm"
            onClick={onDismiss}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </KwidButton>
        )}
      </div>
    </div>
  )
}

export { KwidAlert }

