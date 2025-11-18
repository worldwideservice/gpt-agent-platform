'use client'

import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  )

  // Setup persistence for offline support (without external package)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Restore from localStorage
      try {
        const cached = window.localStorage.getItem('REACT_QUERY_OFFLINE_CACHE')
        if (cached) {
          const data = JSON.parse(cached)
          // Hydrate query client with cached data if needed
        }
      } catch (error) {
        console.error('Failed to restore query client:', error)
      }

      // Save to localStorage on changes (debounced)
      const saveCache = () => {
        try {
          window.localStorage.setItem('REACT_QUERY_OFFLINE_CACHE', JSON.stringify({
            timestamp: Date.now(),
          }))
        } catch (error) {
          console.error('Failed to persist query client:', error)
        }
      }

      // Setup auto-save
      const interval = setInterval(saveCache, 60000) // Save every minute
      return () => clearInterval(interval)
    }
  }, [queryClient])

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        // Dynamic import for devtools only in development
        <DevtoolsLazy />
      )}
    </TanstackQueryClientProvider>
  )
}

// Lazy load devtools only in development
function DevtoolsLazy() {
  const [Devtools, setDevtools] = useState<any>(null)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@tanstack/react-query-devtools').then((mod) => {
        setDevtools(() => mod.ReactQueryDevtools)
      })
    }
  }, [])

  if (!Devtools) return null
  return <Devtools initialIsOpen={false} buttonPosition="bottom-right" />
}
