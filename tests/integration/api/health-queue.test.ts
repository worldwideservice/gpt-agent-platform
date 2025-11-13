import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

// Mock cache
vi.mock('@/lib/cache', () => ({
  checkCacheHealth: vi.fn(),
}))

// Mock rate limit
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimitHealth: vi.fn(),
  getRateLimitBackend: vi.fn(),
}))

// Mock queue
vi.mock('@/lib/queue', () => ({
  getQueueStats: vi.fn(),
}))

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}))

// Mock fetch for OpenRouter check
global.fetch = vi.fn()

describe('API: /api/health with Queue Monitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Set up environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
    process.env.REDIS_URL = 'redis://localhost:6379'
    process.env.OPENROUTER_API_KEY = 'test-api-key'
  })

  describe('Queue Health Check', () => {
    it('should include queue health in overall health status', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const { checkCacheHealth } = await import('@/lib/cache')
      const { checkRateLimitHealth } = await import('@/lib/rate-limit')
      const { getQueueStats } = await import('@/lib/queue')

      // Mock successful database connection
      const mockSelect = vi.fn().mockResolvedValue({
        data: [{ id: 'test' }],
        error: null,
      })
      const mockLimit = vi.fn().mockReturnValue({ select: mockSelect })
      const mockFrom = vi.fn().mockReturnValue({ limit: mockLimit })
      vi.mocked(createClient).mockReturnValue({
        from: mockFrom,
      } as any)

      // Mock successful cache
      vi.mocked(checkCacheHealth).mockResolvedValue({
        healthy: true,
        stats: { dbSize: 100 },
      })

      // Mock successful rate limit
      vi.mocked(checkRateLimitHealth).mockResolvedValue({
        status: 'ok',
        backend: 'redis',
        message: 'Rate limiting operational',
      })

      // Mock successful queue
      vi.mocked(getQueueStats).mockResolvedValue({
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 3,
        delayed: 1,
      })

      // Mock successful OpenRouter
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
      } as Response)

      const route = await import('@/app/api/health/route')
      const request = new NextRequest('http://localhost:3000/api/health')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.queue).toBe('ok')
      expect(data.queue_stats).toEqual({
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 3,
        delayed: 1,
      })
      expect(data.overall_status).toBe('healthy')
      expect(getQueueStats).toHaveBeenCalled()
    })

    it('should mark queue as error when queue stats fail', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const { checkCacheHealth } = await import('@/lib/cache')
      const { checkRateLimitHealth } = await import('@/lib/rate-limit')
      const { getQueueStats } = await import('@/lib/queue')

      // Mock successful database connection
      const mockSelect = vi.fn().mockResolvedValue({
        data: [{ id: 'test' }],
        error: null,
      })
      const mockLimit = vi.fn().mockReturnValue({ select: mockSelect })
      const mockFrom = vi.fn().mockReturnValue({ limit: mockLimit })
      vi.mocked(createClient).mockReturnValue({
        from: mockFrom,
      } as any)

      // Mock successful cache
      vi.mocked(checkCacheHealth).mockResolvedValue({
        healthy: true,
        stats: { dbSize: 100 },
      })

      // Mock successful rate limit
      vi.mocked(checkRateLimitHealth).mockResolvedValue({
        status: 'ok',
        backend: 'redis',
        message: 'Rate limiting operational',
      })

      // Mock failed queue
      vi.mocked(getQueueStats).mockRejectedValue(new Error('Queue connection failed'))

      // Mock successful OpenRouter
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
      } as Response)

      const route = await import('@/app/api/health/route')
      const request = new NextRequest('http://localhost:3000/api/health')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.queue).toBe('error')
      expect(data.queue_error).toContain('Queue connection failed')
      expect(data.overall_status).toBe('degraded')
      expect(getQueueStats).toHaveBeenCalled()
    })

    it('should include queue in services check for overall health', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const { checkCacheHealth } = await import('@/lib/cache')
      const { checkRateLimitHealth } = await import('@/lib/rate-limit')
      const { getQueueStats } = await import('@/lib/queue')

      // Mock successful database
      const mockSelect = vi.fn().mockResolvedValue({
        data: [{ id: 'test' }],
        error: null,
      })
      const mockLimit = vi.fn().mockReturnValue({ select: mockSelect })
      const mockFrom = vi.fn().mockReturnValue({ limit: mockLimit })
      vi.mocked(createClient).mockReturnValue({
        from: mockFrom,
      } as any)

      // Mock successful cache
      vi.mocked(checkCacheHealth).mockResolvedValue({
        healthy: true,
        stats: { dbSize: 100 },
      })

      // Mock successful rate limit
      vi.mocked(checkRateLimitHealth).mockResolvedValue({
        status: 'ok',
        backend: 'redis',
        message: 'Rate limiting operational',
      })

      // Mock successful queue
      vi.mocked(getQueueStats).mockResolvedValue({
        waiting: 0,
        active: 0,
        completed: 50,
        failed: 0,
        delayed: 0,
      })

      // Mock failed OpenRouter (to test degraded status)
      vi.mocked(fetch).mockRejectedValue(new Error('OpenRouter timeout'))

      const route = await import('@/app/api/health/route')
      const request = new NextRequest('http://localhost:3000/api/health')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.queue).toBe('ok')
      expect(data.queue_stats).toBeDefined()
      expect(data.openrouter).toBe('error')
      expect(data.overall_status).toBe('degraded')
    })

    it('should return healthy when queue has no jobs', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const { checkCacheHealth } = await import('@/lib/cache')
      const { checkRateLimitHealth } = await import('@/lib/rate-limit')
      const { getQueueStats } = await import('@/lib/queue')

      // Mock successful database
      const mockSelect = vi.fn().mockResolvedValue({
        data: [{ id: 'test' }],
        error: null,
      })
      const mockLimit = vi.fn().mockReturnValue({ select: mockSelect })
      const mockFrom = vi.fn().mockReturnValue({ limit: mockLimit })
      vi.mocked(createClient).mockReturnValue({
        from: mockFrom,
      } as any)

      // Mock successful cache
      vi.mocked(checkCacheHealth).mockResolvedValue({
        healthy: true,
      })

      // Mock successful rate limit
      vi.mocked(checkRateLimitHealth).mockResolvedValue({
        status: 'ok',
        backend: 'redis',
        message: 'Rate limiting operational',
      })

      // Mock empty queue
      vi.mocked(getQueueStats).mockResolvedValue({
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        delayed: 0,
      })

      // Mock successful OpenRouter
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
      } as Response)

      const route = await import('@/app/api/health/route')
      const request = new NextRequest('http://localhost:3000/api/health')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.queue).toBe('ok')
      expect(data.queue_stats).toEqual({
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        delayed: 0,
      })
      expect(data.overall_status).toBe('healthy')
    })

    it('should handle queue with high activity', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const { checkCacheHealth } = await import('@/lib/cache')
      const { checkRateLimitHealth } = await import('@/lib/rate-limit')
      const { getQueueStats } = await import('@/lib/queue')

      // Mock successful database
      const mockSelect = vi.fn().mockResolvedValue({
        data: [{ id: 'test' }],
        error: null,
      })
      const mockLimit = vi.fn().mockReturnValue({ select: mockSelect })
      const mockFrom = vi.fn().mockReturnValue({ limit: mockLimit })
      vi.mocked(createClient).mockReturnValue({
        from: mockFrom,
      } as any)

      // Mock successful cache
      vi.mocked(checkCacheHealth).mockResolvedValue({
        healthy: true,
      })

      // Mock successful rate limit
      vi.mocked(checkRateLimitHealth).mockResolvedValue({
        status: 'ok',
        backend: 'redis',
        message: 'Rate limiting operational',
      })

      // Mock queue with high activity
      vi.mocked(getQueueStats).mockResolvedValue({
        waiting: 150,
        active: 10,
        completed: 5000,
        failed: 25,
        delayed: 5,
      })

      // Mock successful OpenRouter
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
      } as Response)

      const route = await import('@/app/api/health/route')
      const request = new NextRequest('http://localhost:3000/api/health')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.queue).toBe('ok')
      expect(data.queue_stats.waiting).toBe(150)
      expect(data.queue_stats.active).toBe(10)
      expect(data.queue_stats.completed).toBe(5000)
      expect(data.queue_stats.failed).toBe(25)
      expect(data.overall_status).toBe('healthy')
    })
  })

  describe('HEAD /api/health', () => {
    it('should return 200 for load balancer health checks', async () => {
      const route = await import('@/app/api/health/route')
      const response = await route.HEAD()

      expect(response.status).toBe(200)
    })
  })
})
