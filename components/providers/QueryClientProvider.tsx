'use client'

import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
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

  // Setup persistence for offline support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const persister = {
        persistClient: async (client: unknown) => {
          try {
            window.localStorage.setItem('REACT_QUERY_OFFLINE_CACHE', JSON.stringify(client))
          } catch (error) {
            console.error('Failed to persist query client:', error)
          }
        },
        restoreClient: async () => {
          try {
            const cached = window.localStorage.getItem('REACT_QUERY_OFFLINE_CACHE')
            return cached ? JSON.parse(cached) : undefined
          } catch (error) {
            console.error('Failed to restore query client:', error)
            return undefined
          }
        },
        removeClient: async () => {
          try {
            window.localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE')
          } catch (error) {
            console.error('Failed to remove query client:', error)
          }
        },
      }

      persistQueryClient({
        queryClient,
        persister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      })
    }
  }, [queryClient])

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </TanstackQueryClientProvider>
  )
}
