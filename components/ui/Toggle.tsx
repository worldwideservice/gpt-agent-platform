import * as React from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean
  onChange?: (checked: boolean) => void
  /**
   * Radix UI compatible props (pressed/onPressedChange) to simplify migration.
   */
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  label?: string
  description?: string
  children?: ReactNode
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      checked,
      onChange,
      pressed,
      onPressedChange,
      label,
      description,
      className,
      disabled = false,
      children,
      ...props
    },
    _ref,
  ) => {
    const toggleId = React.useId()
    const isChecked = typeof checked === 'boolean' ? checked : Boolean(pressed)

    const handleToggle = () => {
      if (disabled) {
        return
      }

      const nextValue = !isChecked
      onChange?.(nextValue)
      onPressedChange?.(nextValue)
    }

    return (
      <div className={cn('flex items-start space-x-3', className)}>
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label htmlFor={toggleId} className="block cursor-pointer text-sm font-medium text-gray-700">
                {label}
              </label>
            )}
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button
            id={toggleId}
            type="button"
            role="switch"
            aria-checked={isChecked}
            disabled={disabled}
            onClick={handleToggle}
            className={cn(
              'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              isChecked ? 'bg-primary-600' : 'bg-gray-200',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            {...props}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                isChecked ? 'translate-x-5' : 'translate-x-0',
              )}
            />
          </button>
          {children ? <span className="text-sm text-gray-600">{children}</span> : null}
        </div>
      </div>
    )
  },
)

Toggle.displayName = 'Toggle'
