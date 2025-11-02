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
      <div className="fi-fo-field-wrp space-y-2">
        {label && (
          <div className="flex items-center gap-x-3 justify-between">
            <label
              htmlFor={inputId}
              className="fi-fo-field-wrp-label inline-flex items-center gap-x-3"
            >
              <span className="text-sm font-medium leading-6 text-gray-950 dark:text-white">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'fi-input block w-full border-none py-1.5 text-base text-gray-950 transition duration-75 placeholder:text-gray-400 focus:ring-0 disabled:text-gray-500',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {hint && !error && (
          <p className="fi-fo-field-wrp-helper-text break-words text-sm text-gray-500">
            {hint}
          </p>
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

