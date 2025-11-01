'use client'

import type { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

import { ToastProvider } from '@/components/ui/toast-context'
import { ToastViewport } from '@/components/ui/toast-viewport'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useServiceWorker } from '@/hooks/useServiceWorker'
import { useWebVitals } from '@/hooks/useWebVitals'

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  useServiceWorker()
  useWebVitals()

  return (
    <ErrorBoundary>
      <SessionProvider>
        <ThemeProvider defaultTheme="system">
          <ToastProvider>
            {children}
            <ToastViewport />
          </ToastProvider>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  )
}
