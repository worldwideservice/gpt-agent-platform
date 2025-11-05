/**
 * Tenant ID Caching Utility
 * 
 * Provides in-memory caching for tenant-id to reduce database queries
 * and improve performance.
 * 
 * Cache Strategy:
 * - TTL: 5 minutes (300000ms)
 * - Max size: 1000 entries
 * - LRU eviction when full
 */

interface CacheEntry {
  tenantId: string
  expiresAt: number
}

class TenantCache {
  private cache = new Map<string, CacheEntry>()
  private readonly ttl = 5 * 60 * 1000 // 5 minutes
  private readonly maxSize = 1000

  /**
   * Get tenant-id from cache
   */
  get(userId: string, orgId: string): string | null {
    const key = this.getKey(userId, orgId)
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.tenantId
  }

  /**
   * Set tenant-id in cache
   */
  set(userId: string, orgId: string, tenantId: string): void {
    const key = this.getKey(userId, orgId)

    // Evict if cache is full (LRU - remove oldest)
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      tenantId,
      expiresAt: Date.now() + this.ttl,
    })
  }

  /**
   * Invalidate cache entry
   */
  invalidate(userId: string, orgId: string): void {
    const key = this.getKey(userId, orgId)
    this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now()
    let expired = 0
    let active = 0

    for (const entry of this.cache.values()) {
      if (now > entry.expiresAt) {
        expired++
      } else {
        active++
      }
    }

    return {
      total: this.cache.size,
      active,
      expired,
      maxSize: this.maxSize,
    }
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): number {
    const now = Date.now()
    let cleaned = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
        cleaned++
      }
    }

    return cleaned
  }

  /**
   * Generate cache key
   */
  private getKey(userId: string, orgId: string): string {
    return `${userId}:${orgId}`
  }
}

// Singleton instance
export const tenantCache = new TenantCache()

// Clean expired entries every 10 minutes
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    tenantCache.cleanExpired()
  }, 10 * 60 * 1000)
}

