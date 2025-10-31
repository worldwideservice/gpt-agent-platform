import { useCallback, useState } from 'react'

interface LoadingState {
  [key: string]: boolean
}

export const useLoading = (initialState: LoadingState = {}) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>(initialState)

  const startLoading = useCallback((key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }))
  }, [])

  const stopLoading = useCallback((key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: false }))
  }, [])

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false
  }, [loadingStates])

  const withLoading = useCallback(
    async <T,>(
      key: string,
      asyncFn: () => Promise<T>
    ): Promise<T> => {
      try {
        startLoading(key)
        const result = await asyncFn()
        return result
      } finally {
        stopLoading(key)
      }
    },
    [startLoading, stopLoading]
  )

  const resetLoading = useCallback(() => {
    setLoadingStates({})
  }, [])

  const anyLoading = Object.values(loadingStates).some(Boolean)

  return {
    loadingStates,
    startLoading,
    stopLoading,
    isLoading,
    withLoading,
    resetLoading,
    anyLoading,
  }
}

// Hook for simple boolean loading state
export const useSimpleLoading = (initialLoading = false) => {
  const [isLoading, setIsLoading] = useState(initialLoading)

  const startLoading = useCallback(() => setIsLoading(true), [])
  const stopLoading = useCallback(() => setIsLoading(false), [])

  const withLoading = useCallback(
    async <T,>(asyncFn: () => Promise<T>): Promise<T> => {
      try {
        startLoading()
        return await asyncFn()
      } finally {
        stopLoading()
      }
    },
    [startLoading, stopLoading]
  )

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  }
}
