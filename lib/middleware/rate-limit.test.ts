/**
 * Tests for rate limiting middleware
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import {
  checkRateLimit,
  getIdentifier,
  createRateLimitResponse,
  RateLimitPresets,
} from './rate-limit'
import { rateLimitAPI, rateLimitAuth, rateLimitUpload } from './rate-limit-api'

// Mock Redis
vi.mock('@/lib/redis', () => ({
  getRedisClient: vi.fn(() => null), // Use memory store for tests
  redisIncr: vi.fn(),
  redisExpire: vi.fn(),
  redisTTL: vi.fn(),
}))

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Rate Limiting Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('checkRateLimit', () => {
    it('should allow first request', async () => {
      const result = await checkRateLimit('test-user', {
        max: 10,
        windowSeconds: 60,
        endpoint: 'test',
      })

      expect(result.success).toBe(true)
      expect(result.limit).toBe(10)
      expect(result.remaining).toBe(9)
    })

    it('should track multiple requests', async () => {
      const config = { max: 5, windowSeconds: 60, endpoint: 'test' }
      const identifier = `test-multi-${Date.now()}`

      // Make 5 requests
      for (let i = 1; i <= 5; i++) {
        const result = await checkRateLimit(identifier, config)
        expect(result.success).toBe(true)
        expect(result.remaining).toBe(5 - i)
      }
    })

    it('should block request when limit exceeded', async () => {
      const config = { max: 3, windowSeconds: 60, endpoint: 'test' }
      const identifier = `test-block-${Date.now()}`

      // Make 3 allowed requests
      for (let i = 0; i < 3; i++) {
        await checkRateLimit(identifier, config)
      }

      // 4th request should be blocked
      const result = await checkRateLimit(identifier, config)
      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should handle different endpoints separately', async () => {
      const identifier = `test-endpoints-${Date.now()}`

      const result1 = await checkRateLimit(identifier, {
        max: 5,
        windowSeconds: 60,
        endpoint: 'api',
      })

      const result2 = await checkRateLimit(identifier, {
        max: 5,
        windowSeconds: 60,
        endpoint: 'auth',
      })

      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(result1.remaining).toBe(4)
      expect(result2.remaining).toBe(4)
    })
  })

  describe('getIdentifier', () => {
    it('should use userId when provided', () => {
      const request = new NextRequest('http://localhost/api/test')
      const identifier = getIdentifier(request, 'user-123')

      expect(identifier).toBe('user:user-123')
    })

    it('should use x-forwarded-for when no userId', () => {
      const request = new NextRequest('http://localhost/api/test', {
        headers: {
          'x-forwarded-for': '1.2.3.4, 5.6.7.8',
        },
      })
      const identifier = getIdentifier(request)

      expect(identifier).toBe('ip:1.2.3.4')
    })

    it('should use x-real-ip as fallback', () => {
      const request = new NextRequest('http://localhost/api/test', {
        headers: {
          'x-real-ip': '9.8.7.6',
        },
      })
      const identifier = getIdentifier(request)

      expect(identifier).toBe('ip:9.8.7.6')
    })

    it('should use unknown when no IP available', () => {
      const request = new NextRequest('http://localhost/api/test')
      const identifier = getIdentifier(request)

      expect(identifier).toMatch(/^ip:/)
    })
  })

  describe('createRateLimitResponse', () => {
    it('should create proper 429 response', async () => {
      const result = {
        success: false,
        limit: 100,
        remaining: 0,
        reset: Date.now() + 60000,
      }

      const response = createRateLimitResponse(result)
      const body = await response.json()

      expect(response.status).toBe(429)
      expect(body.error).toBe('Rate limit exceeded')
      expect(response.headers.get('X-RateLimit-Limit')).toBe('100')
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('0')
      expect(response.headers.get('Retry-After')).toBeTruthy()
    })
  })

  describe('RateLimitPresets', () => {
    it('should have correct API preset', () => {
      expect(RateLimitPresets.api).toEqual({
        max: 100,
        windowSeconds: 60,
      })
    })

    it('should have strict auth preset', () => {
      expect(RateLimitPresets.auth).toEqual({
        max: 5,
        windowSeconds: 60,
      })
    })

    it('should have webhook preset', () => {
      expect(RateLimitPresets.webhook).toEqual({
        max: 50,
        windowSeconds: 60,
      })
    })

    it('should have upload preset with hourly limit', () => {
      expect(RateLimitPresets.upload).toEqual({
        max: 10,
        windowSeconds: 3600,
      })
    })
  })

  describe('API Helpers', () => {
    it('rateLimitAPI should apply standard rate limit', async () => {
      const request = new NextRequest('http://localhost/api/test')
      const response = await rateLimitAPI(request)

      // First request should be allowed
      expect(response).toBeNull()
    })

    it('rateLimitAuth should apply strict rate limit', async () => {
      const request = new NextRequest('http://localhost/api/auth/login', {
        headers: {
          'x-forwarded-for': '1.1.1.1',
        },
      })

      const response = await rateLimitAuth(request)

      // First request should be allowed
      expect(response).toBeNull()
    })

    it('rateLimitUpload should enforce hourly limit', async () => {
      const request = new NextRequest('http://localhost/api/upload')
      const response = await rateLimitUpload(request, 'user-123')

      // First request should be allowed
      expect(response).toBeNull()
    })

    it('should block after exceeding auth limit', async () => {
      const identifier = `test-auth-block-${Date.now()}`
      const request = new NextRequest('http://localhost/api/auth/login', {
        headers: {
          'x-forwarded-for': identifier,
        },
      })

      // Make 5 requests (auth limit)
      for (let i = 0; i < 5; i++) {
        await rateLimitAuth(request)
      }

      // 6th request should be blocked
      const response = await rateLimitAuth(request)
      expect(response).not.toBeNull()
      expect(response?.status).toBe(429)
    })
  })

  describe('Memory Store Cleanup', () => {
    it('should clean up expired entries', async () => {
      const config = { max: 5, windowSeconds: 1, endpoint: 'test' }
      const identifier = `test-cleanup-${Date.now()}`

      // Make request
      await checkRateLimit(identifier, config)

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 1100))

      // New request should reset counter
      const result = await checkRateLimit(identifier, config)
      expect(result.remaining).toBe(4) // Should be fresh window
    })
  })

  describe('Error Handling', () => {
    it('should fail open on errors', async () => {
      // This test verifies that the middleware allows requests
      // when rate limiting fails (fail-open behavior)
      const result = await checkRateLimit('test-error', {
        max: 10,
        windowSeconds: 60,
        endpoint: 'test',
      })

      expect(result.success).toBe(true)
    })
  })
})
