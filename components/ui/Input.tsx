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
          <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700">
            {label}
          </label>
        ) : null}

        <input
          id={inputId}
          ref={ref}
          type={type}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            error && 'border-red-500 focus-visible:ring-red-500',
            className,
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />

        {description ? <p className="mt-1 text-xs text-gray-500">{description}</p> : null}
        {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }
