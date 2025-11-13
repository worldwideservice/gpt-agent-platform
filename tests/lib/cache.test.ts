import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Redis } from 'ioredis'

// Mock Redis client
const mockGet = vi.fn()
const mockSetex = vi.fn()
const mockDel = vi.fn()
const mockKeys = vi.fn()
const mockExists = vi.fn()
const mockFlushdb = vi.fn()
const mockInfo = vi.fn()
const mockDbsize = vi.fn()
const mockOn = vi.fn()

class MockRedis {
  get = mockGet
  setex = mockSetex
  del = mockDel
  keys = mockKeys
  exists = mockExists
  flushdb = mockFlushdb
  info = mockInfo
  dbsize = mockDbsize
  on = mockOn
}

vi.mock('ioredis', () => ({
  Redis: MockRedis,
}))

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

describe('Cache Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    process.env.REDIS_URL = 'redis://localhost:6379'
  })

  describe('Cache Class', () => {
    describe('get', () => {
      it('should get value from cache', async () => {
        mockGet.mockResolvedValue(JSON.stringify({ data: 'test' }))

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.get('test-key')

        expect(result).toEqual({ data: 'test' })
        expect(mockGet).toHaveBeenCalledWith('test-key')
      })

      it('should return null if key does not exist', async () => {
        mockGet.mockResolvedValue(null)

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.get('non-existent')

        expect(result).toBeNull()
      })

      it('should return null if Redis is not available', async () => {
        process.env.REDIS_URL = 'redis://your-redis-host:6379'

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.get('test-key')

        expect(result).toBeNull()
      })

      it('should handle JSON parse errors gracefully', async () => {
        mockGet.mockResolvedValue('invalid json')

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.get('test-key')

        expect(result).toBeNull()
      })
    })

    describe('set', () => {
      it('should set value with default TTL', async () => {
        mockSetex.mockResolvedValue('OK')

        const { Cache, cacheConfig } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.set('test-key', { data: 'test' })

        expect(result).toBe(true)
        expect(mockSetex).toHaveBeenCalledWith(
          'test-key',
          cacheConfig.default,
          JSON.stringify({ data: 'test' })
        )
      })

      it('should set value with custom TTL', async () => {
        mockSetex.mockResolvedValue('OK')

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.set('test-key', { data: 'test' }, 600)

        expect(result).toBe(true)
        expect(mockSetex).toHaveBeenCalledWith(
          'test-key',
          600,
          JSON.stringify({ data: 'test' })
        )
      })

      it('should return false if Redis is not available', async () => {
        process.env.REDIS_URL = 'redis://your-redis-host:6379'

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.set('test-key', { data: 'test' })

        expect(result).toBe(false)
      })

      it('should handle serialization errors gracefully', async () => {
        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const circular: any = {}
        circular.self = circular

        const result = await cache.set('test-key', circular)

        expect(result).toBe(false)
      })
    })

    describe('del', () => {
      it('should delete key from cache', async () => {
        mockDel.mockResolvedValue(1)

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.del('test-key')

        expect(result).toBe(true)
        expect(mockDel).toHaveBeenCalledWith('test-key')
      })

      it('should return false if Redis is not available', async () => {
        process.env.REDIS_URL = ''

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.del('test-key')

        expect(result).toBe(false)
      })
    })

    describe('delPattern', () => {
      it('should delete all keys matching pattern', async () => {
        mockKeys.mockResolvedValue(['user:1', 'user:2', 'user:3'])
        mockDel.mockResolvedValue(3)

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.delPattern('user:*')

        expect(result).toBe(true)
        expect(mockKeys).toHaveBeenCalledWith('user:*')
        expect(mockDel).toHaveBeenCalledWith('user:1', 'user:2', 'user:3')
      })

      it('should handle empty pattern results', async () => {
        mockKeys.mockResolvedValue([])

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.delPattern('nonexistent:*')

        expect(result).toBe(true)
        expect(mockKeys).toHaveBeenCalledWith('nonexistent:*')
        expect(mockDel).not.toHaveBeenCalled()
      })

      it('should return false if Redis is not available', async () => {
        delete process.env.REDIS_URL

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.delPattern('user:*')

        expect(result).toBe(false)
      })
    })

    describe('exists', () => {
      it('should return true if key exists', async () => {
        mockExists.mockResolvedValue(1)

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.exists('test-key')

        expect(result).toBe(true)
        expect(mockExists).toHaveBeenCalledWith('test-key')
      })

      it('should return false if key does not exist', async () => {
        mockExists.mockResolvedValue(0)

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.exists('non-existent')

        expect(result).toBe(false)
      })

      it('should return false if Redis is not available', async () => {
        process.env.REDIS_URL = 'redis://your-redis-host:6379'

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.exists('test-key')

        expect(result).toBe(false)
      })
    })

    describe('clear', () => {
      it('should flush all keys from database', async () => {
        mockFlushdb.mockResolvedValue('OK')

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.clear()

        expect(result).toBe(true)
        expect(mockFlushdb).toHaveBeenCalled()
      })

      it('should return false if Redis is not available', async () => {
        process.env.REDIS_URL = ''

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.clear()

        expect(result).toBe(false)
      })
    })

    describe('getStats', () => {
      it('should return cache statistics', async () => {
        mockInfo.mockResolvedValue('redis_version:7.0.0\nused_memory:1048576\nconnected_clients:10')
        mockDbsize.mockResolvedValue(42)

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.getStats()

        expect(result).toEqual({
          connected: true,
          dbSize: 42,
          info: {
            redis_version: '7.0.0',
            used_memory: '1048576',
            connected_clients: '10',
          },
        })
      })

      it('should return error stats if Redis fails', async () => {
        mockInfo.mockRejectedValue(new Error('Connection failed'))

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.getStats()

        expect(result).toEqual({
          connected: false,
          error: 'Connection failed',
        })
      })

      it('should return null if Redis is not available', async () => {
        process.env.REDIS_URL = 'redis://your-redis-host:6379'

        const { Cache } = await import('@/lib/cache')
        const cache = new Cache()

        const result = await cache.getStats()

        expect(result).toBeNull()
      })
    })
  })

  describe('Higher-level utilities', () => {
    describe('cached', () => {
      it('should execute function on cache miss', async () => {
        mockGet.mockResolvedValue(null)
        mockSetex.mockResolvedValue('OK')

        const fn = vi.fn().mockResolvedValue({ data: 'computed' })

        const { cached } = await import('@/lib/cache')

        const result = await cached('test-key', fn, 300)

        expect(result).toEqual({ data: 'computed' })
        expect(fn).toHaveBeenCalled()
        expect(mockSetex).toHaveBeenCalled()
      })

      it('should return cached value on cache hit', async () => {
        mockGet.mockResolvedValue(JSON.stringify({ data: 'cached' }))

        const fn = vi.fn().mockResolvedValue({ data: 'computed' })

        const { cached } = await import('@/lib/cache')

        const result = await cached('test-key', fn, 300)

        expect(result).toEqual({ data: 'cached' })
        expect(fn).not.toHaveBeenCalled()
      })

      it('should skip cache when skipCache is true', async () => {
        const fn = vi.fn().mockResolvedValue({ data: 'fresh' })

        const { cached } = await import('@/lib/cache')

        const result = await cached('test-key', fn, 300, true)

        expect(result).toEqual({ data: 'fresh' })
        expect(fn).toHaveBeenCalled()
        expect(mockGet).not.toHaveBeenCalled()
      })

      it('should fallback to function execution on cache error', async () => {
        mockGet.mockRejectedValue(new Error('Redis error'))

        const fn = vi.fn().mockResolvedValue({ data: 'fallback' })

        const { cached } = await import('@/lib/cache')

        const result = await cached('test-key', fn, 300)

        expect(result).toEqual({ data: 'fallback' })
        expect(fn).toHaveBeenCalled()
      })
    })

    describe('invalidateCache', () => {
      it('should invalidate multiple patterns', async () => {
        mockKeys.mockResolvedValueOnce(['user:1', 'user:2'])
        mockKeys.mockResolvedValueOnce(['session:a', 'session:b'])
        mockDel.mockResolvedValue(2)

        const { invalidateCache } = await import('@/lib/cache')

        await invalidateCache(['user:*', 'session:*'])

        expect(mockKeys).toHaveBeenCalledTimes(2)
        expect(mockKeys).toHaveBeenCalledWith('user:*')
        expect(mockKeys).toHaveBeenCalledWith('session:*')
        expect(mockDel).toHaveBeenCalledTimes(2)
      })

      it('should handle empty patterns array', async () => {
        const { invalidateCache } = await import('@/lib/cache')

        await invalidateCache([])

        expect(mockKeys).not.toHaveBeenCalled()
      })
    })

    describe('checkCacheHealth', () => {
      it('should return healthy status when connected', async () => {
        mockInfo.mockResolvedValue('redis_version:7.0.0')
        mockDbsize.mockResolvedValue(10)

        const { checkCacheHealth } = await import('@/lib/cache')

        const result = await checkCacheHealth()

        expect(result.healthy).toBe(true)
        expect(result.stats).toBeDefined()
      })

      it('should return unhealthy status on error', async () => {
        mockInfo.mockRejectedValue(new Error('Connection failed'))

        const { checkCacheHealth } = await import('@/lib/cache')

        const result = await checkCacheHealth()

        expect(result.healthy).toBe(false)
        // Error might be in stats.error or result.error depending on implementation
        expect(result.error || result.stats?.error).toBeDefined()
      })

      it('should return unhealthy when Redis is not configured', async () => {
        process.env.REDIS_URL = 'redis://your-redis-host:6379'

        const { checkCacheHealth } = await import('@/lib/cache')

        const result = await checkCacheHealth()

        expect(result.healthy).toBe(false)
      })
    })
  })

  describe('Cache key generators', () => {
    it('should generate correct cache keys', async () => {
      const { cacheKeys } = await import('@/lib/cache')

      expect(cacheKeys.agents('org-123')).toBe('agents:org-123')
      expect(cacheKeys.agent('agent-456')).toBe('agent:agent-456')
      expect(cacheKeys.knowledge('org-123')).toBe('knowledge:org-123')
      expect(cacheKeys.knowledge('org-123', 'docs')).toBe('knowledge:org-123:docs')
      expect(cacheKeys.dashboard('org-123')).toBe('dashboard:org-123')
      expect(cacheKeys.user('user-789')).toBe('user:user-789')
      expect(cacheKeys.integrations('org-123')).toBe('integrations:org-123')
      expect(cacheKeys.notifications('user-789')).toBe('notifications:user-789')
      expect(cacheKeys.agentInstructions('org-123', 'agent-456')).toBe('agent-instructions:org-123:agent-456')
      expect(cacheKeys.agentStaticContext('org-123', 'agent-456', 'stage-1')).toBe('agent-context:org-123:agent-456:stage-1')
      expect(cacheKeys.agentStaticContext('org-123', null, null)).toBe('agent-context:org-123:global:all')
      expect(cacheKeys.agentKnowledgeGraph('org-123', 'hash-abc')).toBe('agent-kg:org-123:hash-abc')
      expect(cacheKeys.aiConfig('org-123')).toBe('ai-config:org-123')
    })
  })

  describe('Cache configuration', () => {
    it('should have correct TTL values', async () => {
      const { cacheConfig } = await import('@/lib/cache')

      expect(cacheConfig.default).toBe(300) // 5 minutes
      expect(cacheConfig.agents).toBe(600) // 10 minutes
      expect(cacheConfig.knowledge).toBe(1800) // 30 minutes
      expect(cacheConfig.dashboard).toBe(60) // 1 minute
      expect(cacheConfig.user).toBe(3600) // 1 hour
      expect(cacheConfig.integrations).toBe(300) // 5 minutes
      expect(cacheConfig.agentInstructions).toBe(3600) // 1 hour
      expect(cacheConfig.agentContextStatic).toBe(900) // 15 minutes
      expect(cacheConfig.agentKnowledgeGraph).toBe(300) // 5 minutes
      expect(cacheConfig.aiConfig).toBe(600) // 10 minutes
    })
  })

  describe('Redis client management', () => {
    it('should initialize Redis client with valid URL', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379'

      const { getRedisClient } = await import('@/lib/cache')

      const client = getRedisClient()

      expect(client).toBeDefined()
      expect(mockOn).toHaveBeenCalledWith('error', expect.any(Function))
      expect(mockOn).toHaveBeenCalledWith('connect', expect.any(Function))
    })

    it('should return null with placeholder URL', async () => {
      process.env.REDIS_URL = 'redis://your-redis-host:6379'

      const { getRedisClient } = await import('@/lib/cache')

      const client = getRedisClient()

      expect(client).toBeNull()
    })

    it('should return null without REDIS_URL', async () => {
      delete process.env.REDIS_URL

      const { getRedisClient } = await import('@/lib/cache')

      const client = getRedisClient()

      expect(client).toBeNull()
    })

    it('should allow setting custom Redis client', async () => {
      const customClient = new MockRedis() as unknown as Redis

      const { setRedisClient, getRedisClient } = await import('@/lib/cache')

      setRedisClient(customClient)
      const client = getRedisClient()

      expect(client).toBe(customClient)
    })
  })
})
