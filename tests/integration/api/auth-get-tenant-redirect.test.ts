import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock utilities
vi.mock('@/lib/utils/getTenantRedirect', () => ({
  getTenantIdFromSession: vi.fn(),
}))

vi.mock('@/lib/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    performance: vi.fn(),
  },
}))

vi.mock('@/lib/utils/metrics', () => ({
  metrics: {
    recordApiCall: vi.fn(),
    recordError: vi.fn(),
  },
}))

describe('API: /api/auth/get-tenant-redirect', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/auth/get-tenant-redirect', () => {
    it('should return tenant-id when found in session', async () => {
      const { getTenantIdFromSession } = await import('@/lib/utils/getTenantRedirect')
      vi.mocked(getTenantIdFromSession).mockResolvedValue('tenant-123')

      const route = await import('@/app/api/auth/get-tenant-redirect/route')
      const request = new NextRequest('http://localhost:3000/api/auth/get-tenant-redirect')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.tenantId).toBe('tenant-123')
    })

    it('should return null tenant-id when not found in session', async () => {
      const { getTenantIdFromSession } = await import('@/lib/utils/getTenantRedirect')
      vi.mocked(getTenantIdFromSession).mockResolvedValue(null)

      const route = await import('@/app/api/auth/get-tenant-redirect/route')
      const request = new NextRequest('http://localhost:3000/api/auth/get-tenant-redirect')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(false)
      expect(data.tenantId).toBe(null)
      expect(data.error).toContain('tenant-id')
    })

    it('should handle errors gracefully', async () => {
      const { getTenantIdFromSession } = await import('@/lib/utils/getTenantRedirect')
      vi.mocked(getTenantIdFromSession).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/auth/get-tenant-redirect/route')
      const request = new NextRequest('http://localhost:3000/api/auth/get-tenant-redirect')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.tenantId).toBe(null)
      expect(data.error).toBe('Database error')
    })
  })
})

