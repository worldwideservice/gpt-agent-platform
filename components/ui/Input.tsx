import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, description, error, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId

    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-slate-700">
            {label}
          </label>
        ) : null}

        <input
          id={inputId}
          ref={ref}
          type={type}
          className={cn(
            'flex h-9 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:ring-red-100',
            className,
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />

        {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
        {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }
