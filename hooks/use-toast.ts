/**
 * Toast notification hook - wrapper around sonner
 */

import { toast as sonnerToast } from 'sonner'

export interface ToastOptions {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

export function useToast() {
  const toast = ({ title, description, variant = 'default', duration }: ToastOptions) => {
    const message = description || title || ''
    
    switch (variant) {
      case 'destructive':
        return sonnerToast.error(title || 'Error', { description, duration })
      default:
        return sonnerToast.success(title || 'Success', { description, duration })
    }
  }

  return {
    toast,
    dismiss: sonnerToast.dismiss,
  }
}
