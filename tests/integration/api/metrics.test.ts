import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock metrics
vi.mock('@/lib/utils/metrics', () => ({
  metrics: {
    getSummary: vi.fn(),
    clear: vi.fn(),
  },
}))

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

describe('API: /api/metrics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/metrics', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/metrics/route')
      const response = await route.GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return metrics data', async () => {
      const { auth } = await import('@/auth')
      const { metrics } = await import('@/lib/utils/metrics')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(metrics.getSummary).mockReturnValue({
        count: 10,
        sum: 100,
        avg: 10,
      } as any)

      const route = await import('@/app/api/metrics/route')
      const response = await route.GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.metrics).toBeDefined()
    })
  })

  describe('POST /api/metrics', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/metrics/route')
      const response = await route.POST()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should clear metrics successfully', async () => {
      const { auth } = await import('@/auth')
      const { metrics } = await import('@/lib/utils/metrics')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(metrics.clear).mockImplementation(() => {})

      const route = await import('@/app/api/metrics/route')
      const response = await route.POST()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Metrics cleared')
      expect(metrics.clear).toHaveBeenCalled()
    })

    it('should handle errors gracefully', async () => {
      const { auth } = await import('@/auth')
      const { metrics } = await import('@/lib/utils/metrics')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(metrics.clear).mockImplementation(() => {
        throw new Error('Clear failed')
      })

      const route = await import('@/app/api/metrics/route')
      const response = await route.POST()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Clear failed')
    })
  })
})

