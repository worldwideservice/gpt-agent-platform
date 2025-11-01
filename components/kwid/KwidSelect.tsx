'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

/**
 * Kwid Select компонент - реплика стиля Filament select
 * Использует классы: fi-input, fi-input-wrp
 */
export interface KwidSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface KwidSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  options: KwidSelectOption[]
  placeholder?: string
  onChange?: (value: string) => void
}

const KwidSelect = React.forwardRef<HTMLSelectElement, KwidSelectProps>(
  ({ className, label, hint, error, required, id, options, onChange, value, placeholder, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value)
      }
    }

    return (
      <div className="fi-input-wrp space-y-2">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            value={value}
            onChange={handleChange}
            className={cn(
              'fi-input block w-full rounded-lg border-gray-300 shadow-sm appearance-none',
              'focus:border-custom-500 focus:ring-custom-500 dark:border-gray-600',
              'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
              'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
        </div>
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
KwidSelect.displayName = 'KwidSelect'

export { KwidSelect }

