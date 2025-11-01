'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Kwid Input компонент - реплика стиля Filament input
 * Использует классы: fi-input, fi-input-wrp
 */
export interface KwidInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  required?: boolean
}

const KwidInput = React.forwardRef<HTMLInputElement, KwidInputProps>(
  ({ className, label, hint, error, required, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="fi-input-wrp space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            'fi-input block w-full rounded-lg border-gray-300 shadow-sm',
            'focus:border-custom-500 focus:ring-custom-500 dark:border-gray-600',
            'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'disabled:bg-gray-50 disabled:text-gray-500',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {hint && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
        )}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    )
  }
)
KwidInput.displayName = 'KwidInput'

export { KwidInput }

