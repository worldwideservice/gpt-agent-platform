'use client'

import type { ReactNode } from 'react'

import { ToastProvider } from '@/components/ui/toast-context'
import { ToastViewport } from '@/components/ui/toast-viewport'

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ToastProvider>
      {children}
      <ToastViewport />
    </ToastProvider>
  )
}
