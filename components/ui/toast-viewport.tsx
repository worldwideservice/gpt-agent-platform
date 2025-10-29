'use client'

import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

import { useToast } from './toast-context'

const variantClasses: Record<string, string> = {
  default: 'border-gray-200 bg-white text-gray-900 shadow-sm',
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
}

export const ToastViewport = () => {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-end gap-3 p-4 sm:items-end sm:justify-end">
      {toasts.map((toast) => {
        const variant = toast.variant ?? 'default'
        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-sm flex-col rounded-lg border p-4 shadow-lg transition-opacity sm:max-w-md',
              variantClasses[variant] ?? variantClasses.default,
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1 pr-3">
                <p className="text-sm font-semibold leading-5">{toast.title}</p>
                {toast.description ? <p className="text-sm leading-5 text-gray-600">{toast.description}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Закрыть уведомление"
                className="rounded-md p-1 text-gray-500 transition hover:bg-black/5 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
