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

const KwidTabs = ({ tabs, children, className, listClassName, ...props }: KwidTabsProps) => (
  <TabsPrimitive.Root className={cn('fi-tabs', className)} {...props}>
    <TabsPrimitive.List
      className={cn(
        'fi-tabs-list inline-flex h-10 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500 dark:bg-gray-800 dark:text-gray-400',
        listClassName
      )}
    >
      {tabs.map((tab) => (
        <TabsPrimitive.Trigger
          key={tab.value}
          value={tab.value}
          disabled={tab.disabled}
          className={cn(
            'fi-tabs-item inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:fi-tabs-item-active data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:ring-offset-gray-950 dark:focus-visible:ring-custom-500 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-white',
            tab.icon && 'gap-2'
          )}
        >
          {tab.icon && <tab.icon className="h-4 w-4" />}
          {tab.label}
        </TabsPrimitive.Trigger>
      ))}
    </TabsPrimitive.List>
    {children}
  </TabsPrimitive.Root>
)

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

