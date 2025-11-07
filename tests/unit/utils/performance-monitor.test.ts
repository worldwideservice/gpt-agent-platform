import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    performance: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}))

import { performanceMonitor, trackAsync } from '@/lib/utils/performance-monitor'
import { logger } from '@/lib/utils/logger'

describe('Performance Monitor', () => {
  beforeEach(() => {
    performanceMonitor.clear()
    vi.clearAllMocks()
  })

  describe('performanceMonitor.track', () => {
    it('should track performance metric', () => {
      performanceMonitor.track({
        name: 'test-operation',
        duration: 100,
        timestamp: Date.now(),
      })

      const stats = performanceMonitor.getStats('test-operation')
      expect(stats.count).toBe(1)
      expect(stats.avg).toBe(100)
    })

    it('should log warning for slow operations (>1000ms)', () => {
      performanceMonitor.track({
        name: 'slow-operation',
        duration: 1500,
        timestamp: Date.now(),
        context: { test: 'value' },
      })

      expect(vi.mocked(logger).warn).toHaveBeenCalledWith(
        '[PerformanceMonitor] Slow operation detected: slow-operation',
        expect.objectContaining({
          duration: '1500ms',
          test: 'value',
        })
      )
    })

    it('should log performance for fast operations (<=1000ms)', () => {
      performanceMonitor.track({
        name: 'fast-operation',
        duration: 500,
        timestamp: Date.now(),
        context: { test: 'value' },
      })

      expect(vi.mocked(logger).performance).toHaveBeenCalledWith(
        'fast-operation',
        500,
        { test: 'value' }
      )
    })

    it('should limit metrics to maxMetrics (1000)', () => {
      // Добавляем 1001 метрику
      for (let i = 0; i < 1001; i++) {
        performanceMonitor.track({
          name: 'test',
          duration: i,
          timestamp: Date.now(),
        })
      }

      const stats = performanceMonitor.getStats()
      expect(stats.count).toBe(1000)
      expect(stats.min).toBe(1) // Первая метрика (0) была удалена
      expect(stats.max).toBe(1000)
    })
  })

  describe('performanceMonitor.getStats', () => {
    it('should return empty stats for no metrics', () => {
      const stats = performanceMonitor.getStats()
      
      expect(stats).toEqual({
        count: 0,
        avg: 0,
        min: 0,
        max: 0,
        p95: 0,
        p99: 0,
      })
    })

    it('should return stats for all metrics', () => {
      performanceMonitor.track({ name: 'op1', duration: 100, timestamp: Date.now() })
      performanceMonitor.track({ name: 'op1', duration: 200, timestamp: Date.now() })
      performanceMonitor.track({ name: 'op2', duration: 300, timestamp: Date.now() })

      const stats = performanceMonitor.getStats()
      
      expect(stats.count).toBe(3)
      expect(stats.avg).toBe(200)
      expect(stats.min).toBe(100)
      expect(stats.max).toBe(300)
    })

    it('should filter stats by name', () => {
      performanceMonitor.track({ name: 'op1', duration: 100, timestamp: Date.now() })
      performanceMonitor.track({ name: 'op1', duration: 200, timestamp: Date.now() })
      performanceMonitor.track({ name: 'op2', duration: 300, timestamp: Date.now() })

      const stats = performanceMonitor.getStats('op1')
      
      expect(stats.count).toBe(2)
      expect(stats.avg).toBe(150)
      expect(stats.min).toBe(100)
      expect(stats.max).toBe(200)
    })

    it('should calculate percentiles correctly', () => {
      // Добавляем 100 метрик для точного расчета перцентилей
      for (let i = 1; i <= 100; i++) {
        performanceMonitor.track({
          name: 'test',
          duration: i,
          timestamp: Date.now(),
        })
      }

      const stats = performanceMonitor.getStats()
      
      expect(stats.count).toBe(100)
      // p95Index = Math.floor(100 * 0.95) = 95, durations[95] = 96 (индекс 95)
      expect(stats.p95).toBe(96)
      // p99Index = Math.floor(100 * 0.99) = 99, durations[99] = 100 (индекс 99)
      expect(stats.p99).toBe(100)
    })
  })

  describe('performanceMonitor.clear', () => {
    it('should clear all metrics', () => {
      performanceMonitor.track({ name: 'test', duration: 100, timestamp: Date.now() })
      expect(performanceMonitor.getStats().count).toBe(1)

      performanceMonitor.clear()
      expect(performanceMonitor.getStats().count).toBe(0)
    })
  })

  // Note: trackPerformance is a decorator that requires experimentalDecorators
  // For now, we test trackAsync which provides similar functionality

  describe('trackAsync', () => {
    it('should track async function execution', async () => {
      const asyncFn = async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return 'async-result'
      }

      const result = await trackAsync('test-async', asyncFn, { context: 'test' })
      
      expect(result).toBe('async-result')

      const stats = performanceMonitor.getStats('test-async')
      expect(stats.count).toBe(1)
      expect(stats.avg).toBeGreaterThanOrEqual(10)
    })

    it('should handle async function errors', async () => {
      const asyncFn = async () => {
        throw new Error('Test error')
      }

      await expect(trackAsync('test-error', asyncFn)).rejects.toThrow('Test error')

      const stats = performanceMonitor.getStats('test-error')
      expect(stats.count).toBe(1)
    })
  })
})

