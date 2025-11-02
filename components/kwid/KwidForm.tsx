'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Kwid Form компонент - базовая обертка для форм с Filament валидацией
 * Для полной интеграции с react-hook-form нужно установить зависимости:
 * npm install react-hook-form @hookform/resolvers
 */
export interface KwidFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  className?: string
}

export function KwidForm({
  children,
  className,
  ...props
}: KwidFormProps) {
  return (
    <form className={cn('fi-form grid gap-y-6', className)} {...props}>
      {children}
    </form>
  )
}

/**
 * Kwid Form Field - для отображения ошибок валидации
 */
export interface KwidFormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  error?: string
  required?: boolean
  label?: string
  hint?: string
}

export function KwidFormField({
  name,
  error,
  required,
  label,
  hint,
  children,
  className,
}: KwidFormFieldProps) {
  return (
    <div className={cn('fi-fo-field-wrp space-y-2', className)}>
      {label && (
        <label
          htmlFor={name}
          className="fi-fo-field-wrp-label text-sm font-medium text-slate-600 dark:text-gray-300"
        >
          {label}
          {required && <sup className="ml-1 text-red-500">*</sup>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="fi-fo-field-wrp-helper-text text-xs text-slate-500 dark:text-gray-400">
          {hint}
        </p>
      )}
      {error && (
        <p className="fi-input-error text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

