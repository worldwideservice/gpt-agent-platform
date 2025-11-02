'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'

/**
 * Kwid Tabs компонент - реплика стиля Filament tabs
 * Использует Radix UI Tabs для доступности
 */
export interface KwidTab {
  value: string
  label: string
  icon?: LucideIcon
  disabled?: boolean
}

export interface KwidTabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  tabs: KwidTab[]
  children: React.ReactNode
  listClassName?: string
}

const KwidTabs = ({ tabs, children, className, listClassName, ...props }: KwidTabsProps) => {
  const currentValue = props.value || tabs[0]?.value || ''

  return (
    <TabsPrimitive.Root className={cn('fi-tabs', className)} {...props}>
      <nav
        className={cn(
          'fi-tabs flex max-w-full gap-x-1 overflow-x-auto mx-auto rounded-xl bg-white p-2 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 fi-page-sub-navigation-tabs hidden md:flex',
          listClassName
        )}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = tab.value === currentValue
          return (
            <TabsPrimitive.Trigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              className={cn(
                'fi-tabs-item group flex items-center justify-center gap-x-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium outline-none transition duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 dark:hover:bg-white/5 dark:focus-visible:bg-white/5',
                isActive && 'fi-active fi-tabs-item-active bg-gray-50 dark:bg-white/5',
                tab.disabled && 'disabled:pointer-events-none disabled:opacity-50'
              )}
              role="tab"
              aria-selected={isActive}
            >
              <span
                className={cn(
                  'fi-tabs-item-label transition duration-75',
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 group-hover:text-gray-700 group-focus-visible:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200 dark:group-focus-visible:text-gray-200'
                )}
              >
                {tab.label}
              </span>
            </TabsPrimitive.Trigger>
          )
        })}
      </nav>
      {children}
    </TabsPrimitive.Root>
  )
}

const KwidTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    className={cn(
      'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-600 focus-visible:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-custom-500',
      className
    )}
    {...props}
    ref={ref}
  />
))
KwidTabsContent.displayName = TabsPrimitive.Content.displayName

export { KwidTabs, KwidTabsContent }

