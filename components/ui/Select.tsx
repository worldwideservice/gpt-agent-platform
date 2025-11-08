"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Select({
  children,
  defaultValue,
  value,
  onValueChange,
}: {
  children: React.ReactNode
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  const currentValue = value !== undefined ? value : internalValue

  return (
    <div data-select-root>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, {
            currentValue,
            onValueChange: (val: string) => {
              setInternalValue(val)
              onValueChange?.(val)
            },
            disabled: (child.props as any).disabled,
          })
        }
        return child
      })}
    </div>
  )
}

function SelectTrigger({
  className,
  children,
  currentValue,
  id,
  disabled,
}: {
  className?: string
  children: React.ReactNode
  currentValue?: string
  id?: string
  disabled?: boolean
}) {
  return (
    <div
      id={id}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {children}
      <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}

function SelectValue({ currentValue, placeholder }: { currentValue?: string; placeholder?: string }) {
  return <span>{currentValue || placeholder || "Выберите опцию"}</span>
}

function SelectContent({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
      {children}
    </div>
  )
}

function SelectItem({
  value,
  children,
  onValueChange,
}: {
  value: string
  children: React.ReactNode
  onValueChange?: (value: string) => void
}) {
  return (
    <div
      onClick={() => onValueChange?.(value)}
      className="relative flex cursor-pointer items-center px-2 py-1.5 text-sm hover:bg-gray-100"
    >
      {children}
    </div>
  )
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
