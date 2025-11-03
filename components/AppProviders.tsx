'use client'

import type { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

import { ToastProvider } from '@/components/ui/toast-context'
import { ToastViewport } from '@/components/ui/toast-viewport'
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
 <ToastProvider>
 {children}
 <ToastViewport />
 </ToastProvider>
 </SessionProvider>
 </ErrorBoundary>
 )
}
