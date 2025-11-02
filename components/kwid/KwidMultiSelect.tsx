'use client'

import * as React from 'react'
import { Check, ChevronDown, X } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Kwid MultiSelect компонент - аналог Choices.js для multi-select
 * Использует Radix UI Select с поддержкой множественного выбора
 */
export interface KwidMultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface KwidMultiSelectProps {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  options: KwidMultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  maxHeight?: string
  className?: string
  id?: string
}

export function KwidMultiSelect({
  label,
  hint,
  error,
  required,
  options,
  value,
  onChange,
  placeholder = 'Select items...',
  maxHeight = '300px',
  className,
  id,
}: KwidMultiSelectProps) {
  const generatedId = React.useId()
  const selectId = id || generatedId
  const [open, setOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== optionValue))
  }

  const selectedOptions = options.filter((opt) => value.includes(opt.value))

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <div className={cn('fi-input-wrp space-y-2', className)}>
      {label && (
        <label
          htmlFor={selectId}
          className="fi-input-label text-sm font-medium text-slate-600 dark:text-gray-300"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          id={selectId}
          onClick={() => setOpen(!open)}
          className={cn(
            'fi-input fi-select-input flex h-auto min-h-10 w-full items-center justify-between rounded-lg border-none bg-white px-3 py-2 text-base text-slate-900 shadow-sm ring-1 ring-gray-950/10 transition duration-75 placeholder:text-slate-400 focus:ring-2 focus:ring-custom-600 disabled:pointer-events-none disabled:opacity-70 dark:bg-gray-900 dark:text-white dark:ring-white/10 dark:focus:ring-custom-500',
            error &&
              'ring-red-500 focus:ring-red-500 dark:ring-red-400 dark:focus:ring-red-400'
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedOptions.length === 0 ? (
              <span className="text-slate-400 dark:text-gray-500">{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 rounded-md bg-custom-50 px-2 py-0.5 text-sm text-custom-700 dark:bg-custom-900/20 dark:text-custom-300"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={(e) => handleRemove(option.value, e)}
                    className="hover:text-custom-900 dark:hover:text-custom-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
          <ChevronDown className={cn('h-4 w-4 opacity-50 transition-transform', open && 'rotate-180')} />
        </button>

        {open && (
          <div
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            style={{ maxHeight }}
          >
            <div className="max-h-[300px] overflow-auto p-1">
              {options.map((option) => {
                const isSelected = value.includes(option.value)
                return (
                  <div
                    key={option.value}
                    className={cn(
                      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:text-white',
                      isSelected && 'bg-custom-50 dark:bg-custom-900/20',
                      option.disabled && 'pointer-events-none opacity-50'
                    )}
                    onClick={() => !option.disabled && handleToggle(option.value)}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {isSelected && (
                        <Check className="h-4 w-4 text-custom-600 dark:text-custom-400" />
                      )}
                    </span>
                    {option.label}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {hint && !error && (
        <p className="fi-input-hint text-xs text-slate-500 dark:text-gray-400">{hint}</p>
      )}
      {error && (
        <p className="fi-input-error text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

