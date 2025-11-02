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

    const [isChecked, setIsChecked] = React.useState(props.checked || false)

    React.useEffect(() => {
      if (props.checked !== undefined) {
        setIsChecked(props.checked)
      }
    }, [props.checked])

    const handleClick = () => {
      const newValue = !isChecked
      setIsChecked(newValue)
      if (onCheckedChange) {
        onCheckedChange(newValue)
      }
    }

    return (
      <div className="flex items-center gap-x-3 justify-between">
        {label && (
          <label
            htmlFor={switchId}
            className="fi-fo-field-wrp-label inline-flex items-center gap-x-3"
          >
            <span className="text-sm font-medium leading-6 text-gray-950 dark:text-white">
              {label}
            </span>
          </label>
        )}
        <button
          type="button"
          id={switchId}
          role="switch"
          aria-checked={isChecked}
          onClick={handleClick}
          className={cn(
            'fi-fo-toggle relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent outline-none transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
            isChecked
              ? 'fi-color-custom bg-custom-600 fi-color-primary'
              : 'bg-gray-200 dark:bg-gray-700 fi-color-gray',
            props.disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          style={
            isChecked
              ? { '--c-600': 'var(--primary-600)' }
              : { '--c-600': 'var(--gray-600)' }
          }
          disabled={props.disabled}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              isChecked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
        {description && (
          <p className="fi-fo-field-wrp-helper-text break-words text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>
    )
  }
)
KwidSwitch.displayName = 'KwidSwitch'

export { KwidSwitch }

