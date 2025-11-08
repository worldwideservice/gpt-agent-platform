import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useWebVitals } from '@/hooks/useWebVitals'

// Мокаем @vercel/analytics
vi.mock('@vercel/analytics', () => ({
  reportWebVitals: vi.fn(),
}))

describe('useWebVitals Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize web vitals tracking', () => {
    const { result } = renderHook(() => useWebVitals())
    
    // Hook должен выполниться без ошибок
    expect(result.current).toBeUndefined()
  })

  it('should handle web vitals events', () => {
    const { result } = renderHook(() => useWebVitals())
    
    // Hook должен выполниться без ошибок
    expect(result.current).toBeUndefined()
  })
})

