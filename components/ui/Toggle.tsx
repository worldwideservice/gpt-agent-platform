import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  className?: string
  disabled?: boolean
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ checked, onChange, label, description, className, disabled = false, ...props }, ref) => {
    const toggleId = React.useId()

    return (
      <div className={cn('flex items-start space-x-3', className)}>
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label 
                htmlFor={toggleId}
                className="block text-sm font-medium text-gray-700 cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
        )}
        
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={cn(
            "relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
            checked ? 'bg-primary-600' : 'bg-gray-200',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'

