'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Kwid Button компонент - реплика стиля Filament кнопок
 * Использует классы: fi-btn, fi-color-primary, fi-size-sm
 */
const kwidButtonVariants = cva(
  'fi-btn relative grid-flow-col items-center justify-center font-semibold outline-none transition duration-75 focus-visible:ring-2 rounded-lg inline-grid gap-1 shadow-sm',
  {
    variants: {
      variant: {
        primary:
          'fi-color-primary bg-custom-600 text-white hover:bg-custom-500 focus-visible:ring-custom-500/50 dark:bg-custom-500 dark:hover:bg-custom-400 dark:focus-visible:ring-custom-400/50',
        secondary:
          'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500/50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
        danger:
          'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500/50 dark:bg-red-500 dark:hover:bg-red-400',
        outline:
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500/50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300',
      },
      size: {
        sm: 'fi-size-sm px-2.5 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'sm',
    },
  }
)

export interface KwidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof kwidButtonVariants> {
  asChild?: boolean
}

const KwidButton = React.forwardRef<HTMLButtonElement, KwidButtonProps>(
  ({ className, variant, size, asChild, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      // If asChild is true and children is a React element, clone it with our classes
      return React.cloneElement(children as React.ReactElement, {
        className: cn(kwidButtonVariants({ variant, size, className })),
        ref,
        ...props,
      })
    }
    
    return (
      <button
        className={cn(kwidButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
KwidButton.displayName = 'KwidButton'

export { KwidButton, kwidButtonVariants }

