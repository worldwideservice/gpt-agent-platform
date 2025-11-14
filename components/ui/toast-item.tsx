'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastItemProps {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onDismiss: (id: string) => void
}

const variantStyles = {
  default: {
    container: 'bg-white border-gray-200 text-gray-900',
    icon: null,
    iconColor: '',
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-900',
    icon: CheckCircle,
    iconColor: 'text-green-600',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-900',
    icon: XCircle,
    iconColor: 'text-red-600',
  },
  warning: {
    container: 'bg-orange-50 border-orange-200 text-orange-900',
    icon: AlertTriangle,
    iconColor: 'text-orange-600',
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-900',
    icon: Info,
    iconColor: 'text-blue-600',
  },
}

export function ToastItem({
  id,
  title,
  description,
  variant = 'default',
  onDismiss,
}: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const style = variantStyles[variant]
  const Icon = style.icon

  useEffect(() => {
    // Анимация появления
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  const handleDismiss = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onDismiss(id)
    }, 300) // Длительность анимации исчезновения
  }

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-md overflow-hidden rounded-lg border shadow-lg transition-all duration-300',
        style.container,
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex w-full items-start p-4">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className={cn('h-5 w-5', style.iconColor)} aria-hidden="true" />
          </div>
        )}
        <div className={cn('ml-3 flex-1', !Icon && 'ml-0')}>
          <p className="text-sm font-semibold">{title}</p>
          {description && (
            <p className="mt-1 text-sm opacity-90">{description}</p>
          )}
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button
            type="button"
            className={cn(
              'inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
              variant === 'success' && 'text-green-600 hover:text-green-800 focus:ring-green-500',
              variant === 'error' && 'text-red-600 hover:text-red-800 focus:ring-red-500',
              variant === 'warning' && 'text-orange-600 hover:text-orange-800 focus:ring-orange-500',
              variant === 'info' && 'text-blue-600 hover:text-blue-800 focus:ring-blue-500',
              variant === 'default' && 'text-gray-400 hover:text-gray-600 focus:ring-gray-500'
            )}
            onClick={handleDismiss}
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
