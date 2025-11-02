'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Kwid Textarea компонент - реплика стиля Filament textarea
 * Использует классы: fi-input, fi-input-wrp
 */
export interface KwidTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  required?: boolean
}

const KwidTextarea = React.forwardRef<HTMLTextAreaElement, KwidTextareaProps>(
  ({ className, label, hint, error, required, id, rows = 4, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="fi-fo-field-wrp space-y-2">
        {label && (
          <div className="flex items-center gap-x-3 justify-between">
            <label
              htmlFor={textareaId}
              className="fi-fo-field-wrp-label inline-flex items-center gap-x-3"
            >
              <span className="text-sm font-medium leading-6 text-gray-950 dark:text-white">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
          </div>
        )}
        <textarea
          id={textareaId}
          rows={rows}
          className={cn(
            'block h-full w-full border-none bg-transparent px-3 py-1.5 text-base text-gray-950 placeholder:text-gray-400 focus:ring-0 disabled:text-gray-500',
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
KwidTextarea.displayName = 'KwidTextarea'

export { KwidTextarea }

