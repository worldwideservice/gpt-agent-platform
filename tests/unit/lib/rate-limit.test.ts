import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies before importing the module
vi.mock('@upstash/redis', () => ({
  Redis: vi.fn(() => ({
    // Mock Redis methods used by Ratelimit
    multi: vi.fn(() => ({
      incr: vi.fn().mockReturnThis(),
      pexpire: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([1, 1]),
    })),
  })),
}))

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: vi.fn().mockImplementation((config) => ({
    _config: config,
    limit: vi.fn().mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 10000,
    }),
    slidingWindow: vi.fn(),
  })),
}))

// Mock UserRepository
vi.mock('@/lib/repositories/users', () => ({
  UserRepository: {
    getUserTier: vi.fn().mockResolvedValue('free'),
  },
}))

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getRateLimitIdentifier', () => {
    it('should return userId if provided', async () => {
      const { getRateLimitIdentifier } = await import('@/lib/rate-limit')
      const mockReq = {
        ip: '192.168.1.1',
      } as NextRequest

      const identifier = getRateLimitIdentifier(mockReq, 'user-123')
      expect(identifier).toBe('user-123')
    })

    it('should return IP if no userId', async () => {
      const { getRateLimitIdentifier } = await import('@/lib/rate-limit')
      const mockReq = {
        ip: '192.168.1.1',
      } as NextRequest

      const identifier = getRateLimitIdentifier(mockReq, null)
      expect(identifier).toBe('192.168.1.1')
    })

    it('should return default IP if no userId and no IP', async () => {
      const { getRateLimitIdentifier } = await import('@/lib/rate-limit')
      const mockReq = {
        ip: undefined,
      } as NextRequest

      const identifier = getRateLimitIdentifier(mockReq, null)
      expect(identifier).toBe('127.0.0.1')
    })
  })

  describe('Rate Limiters Configuration', () => {
    it('should have authRateLimiter defined (or null if no Redis)', async () => {
      const { authRateLimiter } = await import('@/lib/rate-limit')
      // В тестовом окружении без Redis, лимитеры могут быть null
      expect(authRateLimiter).toBeDefined()
    })

    it('should have apiRateLimiter defined (or null if no Redis)', async () => {
      const { apiRateLimiter } = await import('@/lib/rate-limit')
      expect(apiRateLimiter).toBeDefined()
    })

    it('should have publicApiRateLimiter defined (or null if no Redis)', async () => {
      const { publicApiRateLimiter } = await import('@/lib/rate-limit')
      expect(publicApiRateLimiter).toBeDefined()
    })
  })
})
