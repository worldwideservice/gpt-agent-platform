'use client'

import type { InputHTMLAttributes } from 'react'

interface KwidInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const KwidInput = ({ label, error, className = '', ...props }: KwidInputProps) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

