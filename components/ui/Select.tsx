import type { SelectHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
  onChange?: ((e: React.ChangeEvent<HTMLSelectElement>) => void) | ((value: string) => void)
}

export const Select = ({ 
  className, 
  label, 
  error, 
  id,
  options,
  onChange,
  value,
  defaultValue,
  ...props 
}: SelectProps) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={selectId}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          if (onChange) {
            // Проверяем, является ли onChange функцией с одним аргументом (value)
            if (onChange.length === 1) {
              ;(onChange as (value: string) => void)(e.target.value)
            } else {
              ;(onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void)(e)
            }
          }
        }}
        className={cn(
          'flex h-9 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:ring-red-100',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

