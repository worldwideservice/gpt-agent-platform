import type { TextareaHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  description?: string
}

export const Textarea = ({ 
  className, 
  label, 
  error, 
  description,
  id,
  ...props 
}: TextareaProps) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={textareaId}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:ring-red-100',
          className
        )}
        {...props}
      />
      {description && !error && (
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}

