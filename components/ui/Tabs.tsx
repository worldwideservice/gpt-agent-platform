'use client'

import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs')
  }
  return context
}

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  className?: string
}

export const Tabs = ({ value, onValueChange, children, className }: TabsProps) => {
  return (
    <div className={cn('w-full', className)}>
      <TabsContext.Provider value={{ value, onValueChange }}>
        {children}
      </TabsContext.Provider>
    </div>
  )
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

export const TabsList = ({ children, className }: TabsListProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-start w-full border-b border-slate-200',
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
}

export const TabsTrigger = ({ value, children, className }: TabsTriggerProps) => {
  const { value: selectedValue, onValueChange } = useTabsContext()
  const isActive = value === selectedValue

  const handleClick = () => {
    onValueChange(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onValueChange(value)
    }
  }

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={cn(
        'px-4 py-3 text-sm font-medium transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        isActive
          ? 'text-primary-600 border-b-2 border-primary-600'
          : 'text-slate-600 hover:text-slate-900',
        className
      )}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

export const TabsContent = ({ value, children, className }: TabsContentProps) => {
  const { value: selectedValue } = useTabsContext()

  if (value !== selectedValue) return null

  return (
    <div
      role="tabpanel"
      className={cn('mt-6', className)}
    >
      {children}
    </div>
  )
}

