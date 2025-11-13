/**
 * Performance Monitoring Utility
 * 
 * Provides utilities for tracking and monitoring performance metrics
 * across the application.
 */

import { logger } from './logger'

export interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
  context?: Record<string, unknown>
}

/**
 * Performance monitor class for tracking operation metrics
 */
class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private readonly maxMetrics = 1000 // Keep last 1000 metrics in memory

  /**
   * Track a performance metric
   */
  track(metric: PerformanceMetric): void {
    this.metrics.push(metric)
    
    // Keep only last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // Log slow operations
    if (metric.duration > 1000) {
      logger.warn(`[PerformanceMonitor] Slow operation detected: ${metric.name}`, {
        duration: `${metric.duration}ms`,
        ...metric.context,
      })
    } else {
      logger.performance(metric.name, metric.duration, metric.context)
    }
  }

  /**
   * Get performance statistics
   */
  getStats(name?: string): {
    count: number
    avg: number
    min: number
    max: number
    p95: number
    p99: number
  } {
    const filtered = name 
      ? this.metrics.filter(m => m.name === name)
      : this.metrics

    if (filtered.length === 0) {
      return {
        count: 0,
        avg: 0,
        min: 0,
        max: 0,
        p95: 0,
        p99: 0,
      }
    }

    const durations = filtered.map(m => m.duration).sort((a, b) => a - b)
    const sum = durations.reduce((a, b) => a + b, 0)
    const avg = sum / durations.length
    const min = durations[0]
    const max = durations[durations.length - 1]
    const p95Index = Math.floor(durations.length * 0.95)
    const p99Index = Math.floor(durations.length * 0.99)

    return {
      count: durations.length,
      avg: Math.round(avg),
      min,
      max,
      p95: durations[p95Index] || 0,
      p99: durations[p99Index] || 0,
    }
  }

  /**
   * Clear metrics
   */
  clear(): void {
    this.metrics = []
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

/**
 * Decorator for automatic performance tracking
 */
export function trackPerformance(name?: string) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: unknown[]) {
      const startTime = Date.now()
      const operationName = name || `${target?.constructor?.name || 'Unknown'}.${propertyKey}`

      try {
        const result = await originalMethod.apply(this, args)
        const duration = Date.now() - startTime

        performanceMonitor.track({
          name: operationName,
          duration,
          timestamp: Date.now(),
        })

        return result
      } catch (error) {
        const duration = Date.now() - startTime

        performanceMonitor.track({
          name: operationName,
          duration,
          timestamp: Date.now(),
          context: {
            error: error instanceof Error ? error.message : String(error),
          },
        })

        throw error
      }
    }

    return descriptor
  }
}

/**
 * Utility function for tracking async operations
 */
export async function trackAsync<T>(
  name: string,
  operation: () => Promise<T>,
  context?: Record<string, unknown>
): Promise<T> {
  const startTime = Date.now()

  try {
    const result = await operation()
    const duration = Date.now() - startTime

    performanceMonitor.track({
      name,
      duration,
      timestamp: Date.now(),
      context,
    })

    return result
  } catch (error) {
    const duration = Date.now() - startTime

    performanceMonitor.track({
      name,
      duration,
      timestamp: Date.now(),
      context: {
        ...context,
        error: error instanceof Error ? error.message : String(error),
      },
    })

    throw error
  }
}

// Export default
export default performanceMonitor

