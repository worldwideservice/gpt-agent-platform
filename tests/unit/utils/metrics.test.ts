import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    performance: vi.fn(),
  },
}))

import { metrics } from '@/lib/utils/metrics'
import { logger } from '@/lib/utils/logger'

describe('Metrics Collector', () => {
  beforeEach(() => {
    metrics.clear()
    vi.clearAllMocks()
  })

  describe('record', () => {
    it('should record a metric', () => {
      metrics.record({
        name: 'test-metric',
        value: 100,
        timestamp: Date.now(),
      })

      const summary = metrics.getSummary('test-metric')
      expect(summary.count).toBe(1)
      expect(summary.avg).toBe(100)
    })

    it('should use current timestamp if not provided', () => {
      const before = Date.now()
      metrics.record({
        name: 'test-metric',
        value: 100,
      })
      const after = Date.now()

      const summary = metrics.getSummary('test-metric')
      expect(summary.count).toBe(1)
      // Проверяем, что timestamp был установлен
      expect(summary.avg).toBe(100)
    })

    it('should log warning for high value metrics (>1000)', () => {
      metrics.record({
        name: 'high-value-metric',
        value: 1500,
        timestamp: Date.now(),
        tags: { test: 'value' },
      })

      expect(vi.mocked(logger).warn).toHaveBeenCalledWith(
        '[Metrics] High value metric: high-value-metric',
        {
          value: 1500,
          tags: { test: 'value' },
        }
      )
    })

    it('should not log warning for low value metrics (<=1000)', () => {
      metrics.record({
        name: 'low-value-metric',
        value: 500,
        timestamp: Date.now(),
      })

      expect(vi.mocked(logger).warn).not.toHaveBeenCalled()
    })

    it('should limit metrics to maxMetrics (500)', () => {
      // Добавляем 501 метрику
      for (let i = 0; i < 501; i++) {
        metrics.record({
          name: 'test',
          value: i,
          timestamp: Date.now(),
        })
      }

      const summary = metrics.getSummary()
      expect(summary.count).toBe(500)
      expect(summary.min).toBe(1) // Первая метрика (0) была удалена
      expect(summary.max).toBe(500)
    })
  })

  describe('recordRedirect', () => {
    it('should record redirect metric', () => {
      metrics.recordRedirect('/old', '/new', 150, true)

      const summary = metrics.getSummary('redirect')
      expect(summary.count).toBe(1)
      expect(summary.avg).toBe(150)
    })

    it('should record failed redirect', () => {
      metrics.recordRedirect('/old', '/new', 200, false)

      const summary = metrics.getSummary('redirect')
      expect(summary.count).toBe(1)
    })
  })

  describe('recordApiCall', () => {
    it('should record API call metric', () => {
      metrics.recordApiCall('/api/test', 250, 200)

      const summary = metrics.getSummary('api_call')
      expect(summary.count).toBe(1)
      expect(summary.avg).toBe(250)
    })

    it('should record API call with error status', () => {
      metrics.recordApiCall('/api/test', 100, 500)

      const summary = metrics.getSummary('api_call')
      expect(summary.count).toBe(1)
    })
  })

  describe('recordError', () => {
    it('should record error metric', () => {
      metrics.recordError('ValidationError', { field: 'email' })

      const summary = metrics.getSummary('error')
      expect(summary.count).toBe(1)
    })

    it('should record error without context', () => {
      metrics.recordError('GenericError')

      const summary = metrics.getSummary('error')
      expect(summary.count).toBe(1)
    })
  })

  describe('getSummary', () => {
    it('should return empty summary for no metrics', () => {
      const summary = metrics.getSummary()

      expect(summary).toEqual({
        count: 0,
        avg: 0,
        min: 0,
        max: 0,
        sum: 0,
      })
    })

    it('should return summary for all metrics', () => {
      metrics.record({ name: 'metric1', value: 100, timestamp: Date.now() })
      metrics.record({ name: 'metric1', value: 200, timestamp: Date.now() })
      metrics.record({ name: 'metric2', value: 300, timestamp: Date.now() })

      const summary = metrics.getSummary()

      expect(summary.count).toBe(3)
      expect(summary.avg).toBe(200)
      expect(summary.min).toBe(100)
      expect(summary.max).toBe(300)
      expect(summary.sum).toBe(600)
    })

    it('should filter summary by name', () => {
      metrics.record({ name: 'metric1', value: 100, timestamp: Date.now() })
      metrics.record({ name: 'metric1', value: 200, timestamp: Date.now() })
      metrics.record({ name: 'metric2', value: 300, timestamp: Date.now() })

      const summary = metrics.getSummary('metric1')

      expect(summary.count).toBe(2)
      expect(summary.avg).toBe(150)
      expect(summary.min).toBe(100)
      expect(summary.max).toBe(200)
      expect(summary.sum).toBe(300)
    })
  })

  describe('clear', () => {
    it('should clear all metrics', () => {
      metrics.record({ name: 'test', value: 100, timestamp: Date.now() })
      expect(metrics.getSummary().count).toBe(1)

      metrics.clear()
      expect(metrics.getSummary().count).toBe(0)
    })
  })
})

