import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTenantId } from '@/hooks/useTenantId'

const mockUseParams = vi.fn(() => ({ tenantId: 'test-tenant-id' }))

// Мокаем next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => mockUseParams(),
}))

describe('useTenantId Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseParams.mockReturnValue({ tenantId: 'test-tenant-id' })
  })

  it('should return tenantId from params', () => {
    const { result } = renderHook(() => useTenantId())
    
    expect(result.current).toBe('test-tenant-id')
  })

  it('should return null when tenantId is not in params', () => {
    mockUseParams.mockReturnValueOnce({})
    
    const { result } = renderHook(() => useTenantId())
    
    expect(result.current).toBeNull()
  })
})

