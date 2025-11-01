'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Kwid Switch компонент - реплика стиля Filament checkbox/switch
 * Использует классы: fi-checkbox-input
 */
export interface KwidSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  description?: string
  onCheckedChange?: (checked: boolean) => void
}

const KwidSwitch = React.forwardRef<HTMLInputElement, KwidSwitchProps>(
  ({ className, label, description, id, onCheckedChange, ...props }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked)
      }
    }

    return (
      <div className="fi-checkbox-input flex items-start gap-3">
        <div className="flex h-5 items-center">
          <input
            id={switchId}
            type="checkbox"
            className={cn(
              'fi-checkbox-input h-4 w-4 rounded border-gray-300',
              'text-custom-600 focus:ring-custom-500',
              'dark:border-gray-600 dark:bg-gray-800',
              'disabled:bg-gray-100 disabled:text-gray-400',
              className
            )}
            ref={ref}
            onChange={handleChange}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={switchId}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)
KwidSwitch.displayName = 'KwidSwitch'

export { KwidSwitch }

