import { describe, it, expect, beforeEach, vi } from 'vitest'
import { tenantCache } from '@/lib/utils/tenant-cache'

describe('Tenant Cache', () => {
  beforeEach(() => {
    tenantCache.clear()
  })

  describe('get', () => {
    it('should return tenant-id from cache', () => {
      tenantCache.set('user-123', 'org-123', '1234567-test-org')

      const result = tenantCache.get('user-123', 'org-123')

      expect(result).toBe('1234567-test-org')
    })

    it('should return null if entry not in cache', () => {
      const result = tenantCache.get('user-123', 'org-123')

      expect(result).toBeNull()
    })

    it('should return null if entry expired', () => {
      tenantCache.set('user-123', 'org-123', '1234567-test-org')

      // Симулируем истечение времени, изменив время в entry
      const cache = tenantCache as any
      const key = 'user-123:org-123'
      const entry = cache.cache.get(key)
      if (entry) {
        entry.expiresAt = Date.now() - 1000 // Устанавливаем в прошлое
      }

      const result = tenantCache.get('user-123', 'org-123')

      expect(result).toBeNull()
      // Entry должна быть удалена
      expect(cache.cache.has(key)).toBe(false)
    })
  })

  describe('set', () => {
    it('should set tenant-id in cache', () => {
      tenantCache.set('user-123', 'org-123', '1234567-test-org')

      const result = tenantCache.get('user-123', 'org-123')
      expect(result).toBe('1234567-test-org')
    })

    it('should update existing entry', () => {
      tenantCache.set('user-123', 'org-123', '1234567-test-org')
      tenantCache.set('user-123', 'org-123', '7654321-updated-org')

      const result = tenantCache.get('user-123', 'org-123')
      expect(result).toBe('7654321-updated-org')
    })

    it('should evict oldest entry when cache is full', () => {
      const cache = tenantCache as any
      const maxSize = cache.maxSize

      // Заполняем кэш до максимума
      for (let i = 0; i < maxSize; i++) {
        tenantCache.set(`user-${i}`, `org-${i}`, `tenant-${i}`)
      }

      expect(cache.cache.size).toBe(maxSize)

      // Добавляем еще одну запись
      tenantCache.set('user-new', 'org-new', 'tenant-new')

      // Кэш должен остаться того же размера
      expect(cache.cache.size).toBe(maxSize)
      // Новая запись должна быть в кэше
      expect(tenantCache.get('user-new', 'org-new')).toBe('tenant-new')
    })

    it('should not evict when updating existing entry in full cache', () => {
      const cache = tenantCache as any
      const maxSize = cache.maxSize

      // Заполняем кэш до максимума
      for (let i = 0; i < maxSize; i++) {
        tenantCache.set(`user-${i}`, `org-${i}`, `tenant-${i}`)
      }

      const initialSize = cache.cache.size

      // Обновляем существующую запись
      tenantCache.set('user-0', 'org-0', 'tenant-updated')

      // Размер не должен измениться
      expect(cache.cache.size).toBe(initialSize)
      expect(tenantCache.get('user-0', 'org-0')).toBe('tenant-updated')
    })
  })

  describe('invalidate', () => {
    it('should remove entry from cache', () => {
      tenantCache.set('user-123', 'org-123', '1234567-test-org')
      expect(tenantCache.get('user-123', 'org-123')).toBe('1234567-test-org')

      tenantCache.invalidate('user-123', 'org-123')

      expect(tenantCache.get('user-123', 'org-123')).toBeNull()
    })

    it('should do nothing if entry does not exist', () => {
      tenantCache.invalidate('user-123', 'org-123')
      // Не должно быть ошибки
      expect(tenantCache.get('user-123', 'org-123')).toBeNull()
    })
  })

  describe('clear', () => {
    it('should clear all entries from cache', () => {
      tenantCache.set('user-1', 'org-1', 'tenant-1')
      tenantCache.set('user-2', 'org-2', 'tenant-2')

      tenantCache.clear()

      expect(tenantCache.get('user-1', 'org-1')).toBeNull()
      expect(tenantCache.get('user-2', 'org-2')).toBeNull()
    })
  })

  describe('getStats', () => {
    it('should return cache statistics', () => {
      tenantCache.set('user-1', 'org-1', 'tenant-1')
      tenantCache.set('user-2', 'org-2', 'tenant-2')

      const stats = tenantCache.getStats()

      expect(stats.total).toBe(2)
      expect(stats.active).toBe(2)
      expect(stats.expired).toBe(0)
      expect(stats.maxSize).toBe(1000)
    })

    it('should count expired entries', () => {
      const cache = tenantCache as any

      tenantCache.set('user-1', 'org-1', 'tenant-1')
      tenantCache.set('user-2', 'org-2', 'tenant-2')

      // Делаем одну запись истекшей
      const key1 = 'user-1:org-1'
      const entry1 = cache.cache.get(key1)
      if (entry1) {
        entry1.expiresAt = Date.now() - 1000
      }

      const stats = tenantCache.getStats()

      expect(stats.total).toBe(2)
      expect(stats.active).toBe(1)
      expect(stats.expired).toBe(1)
    })
  })

  describe('cleanExpired', () => {
    it('should remove expired entries', () => {
      const cache = tenantCache as any

      tenantCache.set('user-1', 'org-1', 'tenant-1')
      tenantCache.set('user-2', 'org-2', 'tenant-2')

      // Делаем одну запись истекшей
      const key1 = 'user-1:org-1'
      const entry1 = cache.cache.get(key1)
      if (entry1) {
        entry1.expiresAt = Date.now() - 1000
      }

      const cleaned = tenantCache.cleanExpired()

      expect(cleaned).toBe(1)
      expect(tenantCache.get('user-1', 'org-1')).toBeNull()
      expect(tenantCache.get('user-2', 'org-2')).toBe('tenant-2')
    })

    it('should return 0 if no expired entries', () => {
      tenantCache.set('user-1', 'org-1', 'tenant-1')

      const cleaned = tenantCache.cleanExpired()

      expect(cleaned).toBe(0)
      expect(tenantCache.get('user-1', 'org-1')).toBe('tenant-1')
    })

    it('should clean all expired entries', () => {
      const cache = tenantCache as any

      tenantCache.set('user-1', 'org-1', 'tenant-1')
      tenantCache.set('user-2', 'org-2', 'tenant-2')
      tenantCache.set('user-3', 'org-3', 'tenant-3')

      // Делаем все записи истекшими
      for (const [key, entry] of cache.cache.entries()) {
        entry.expiresAt = Date.now() - 1000
      }

      const cleaned = tenantCache.cleanExpired()

      expect(cleaned).toBe(3)
      expect(cache.cache.size).toBe(0)
    })
  })
})


