'use client'

import { useState, type ReactNode } from 'react'

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children?: ReactNode
  className?: string
}

export const Tabs = ({ defaultValue, value: controlledValue, onValueChange, children, className = '' }: TabsProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <div className={`tabs ${className}`}>
      {children}
    </div>
  )
}

interface TabsListProps {
  children?: ReactNode
  className?: string
}

export const TabsList = ({ children, className = '' }: TabsListProps) => {
  return (
    <div className={`flex gap-2 border-b border-slate-200 dark:border-gray-800 ${className}`}>
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children?: ReactNode
  className?: string
}

export const TabsTrigger = ({ value, children, className = '' }: TabsTriggerProps) => {
  return (
    <button
      type="button"
      className={`px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-slate-300 dark:hover:border-gray-600 ${className}`}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children?: ReactNode
  className?: string
}

export const TabsContent = ({ value, children, className = '' }: TabsContentProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

