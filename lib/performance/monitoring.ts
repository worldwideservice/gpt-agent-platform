/**
 * Performance Monitoring
 * Track and report performance metrics
 */

import { logger } from '../logger'

export interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'count'
  timestamp: Date
  metadata?: Record<string, any>
}

/**
 * Performance monitor class
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private timers: Map<string, number> = new Map()

  /**
   * Start timing an operation
   */
  startTimer(name: string): void {
    this.timers.set(name, performance.now())
  }

  /**
   * End timing an operation
   */
  endTimer(name: string, metadata?: Record<string, any>): number {
    const start = this.timers.get(name)

    if (!start) {
      logger.warn('Timer not found', { name })
      return 0
    }

    const duration = performance.now() - start
    this.timers.delete(name)

    this.recordMetric({
      name,
      value: duration,
      unit: 'ms',
      timestamp: new Date(),
      metadata,
    })

    // Log slow operations (>1s)
    if (duration > 1000) {
      logger.warn('Slow operation detected', {
        operation: name,
        duration: `${duration.toFixed(2)}ms`,
        metadata,
      })
    }

    return duration
  }

  /**
   * Record a metric
   */
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric)

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics.shift()
    }
  }

  /**
   * Get metrics by name
   */
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter((m) => m.name === name)
    }
    return this.metrics
  }

  /**
   * Get average for metric
   */
  getAverage(name: string): number {
    const metrics = this.getMetrics(name)

    if (metrics.length === 0) return 0

    const sum = metrics.reduce((acc, m) => acc + m.value, 0)
    return sum / metrics.length
  }

  /**
   * Get percentile for metric
   */
  getPercentile(name: string, percentile: number): number {
    const metrics = this.getMetrics(name)

    if (metrics.length === 0) return 0

    const sorted = metrics.map((m) => m.value).sort((a, b) => a - b)
    const index = Math.ceil((percentile / 100) * sorted.length) - 1

    return sorted[index]
  }

  /**
   * Get summary statistics
   */
  getSummary(name: string): {
    count: number
    avg: number
    min: number
    max: number
    p50: number
    p95: number
    p99: number
  } {
    const metrics = this.getMetrics(name)

    if (metrics.length === 0) {
      return { count: 0, avg: 0, min: 0, max: 0, p50: 0, p95: 0, p99: 0 }
    }

    const values = metrics.map((m) => m.value).sort((a, b) => a - b)

    return {
      count: metrics.length,
      avg: this.getAverage(name),
      min: values[0],
      max: values[values.length - 1],
      p50: this.getPercentile(name, 50),
      p95: this.getPercentile(name, 95),
      p99: this.getPercentile(name, 99),
    }
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = []
    this.timers.clear()
  }

  /**
   * Export metrics for analysis
   */
  export(): PerformanceMetric[] {
    return [...this.metrics]
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

/**
 * Measure async function execution
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  performanceMonitor.startTimer(name)

  try {
    const result = await fn()
    performanceMonitor.endTimer(name, metadata)
    return result
  } catch (error) {
    performanceMonitor.endTimer(name, { ...metadata, error: true })
    throw error
  }
}

/**
 * Measure sync function execution
 */
export function measureSync<T>(
  name: string,
  fn: () => T,
  metadata?: Record<string, any>
): T {
  performanceMonitor.startTimer(name)

  try {
    const result = fn()
    performanceMonitor.endTimer(name, metadata)
    return result
  } catch (error) {
    performanceMonitor.endTimer(name, { ...metadata, error: true })
    throw error
  }
}

/**
 * API endpoint performance tracking
 */
export function trackAPIPerformance(
  endpoint: string,
  method: string,
  statusCode: number,
  duration: number
): void {
  performanceMonitor.recordMetric({
    name: 'api_request',
    value: duration,
    unit: 'ms',
    timestamp: new Date(),
    metadata: {
      endpoint,
      method,
      statusCode,
    },
  })

  // Alert on slow API calls (>500ms)
  if (duration > 500) {
    logger.warn('Slow API endpoint', {
      endpoint,
      method,
      duration: `${duration.toFixed(2)}ms`,
      statusCode,
    })
  }

  // Alert on errors
  if (statusCode >= 400) {
    logger.error('API error', {
      endpoint,
      method,
      statusCode,
    })
  }
}

/**
 * Database query performance tracking
 */
export function trackQueryPerformance(
  query: string,
  duration: number,
  rows?: number
): void {
  performanceMonitor.recordMetric({
    name: 'db_query',
    value: duration,
    unit: 'ms',
    timestamp: new Date(),
    metadata: {
      query: query.substring(0, 100), // Truncate long queries
      rows,
    },
  })

  // Alert on slow queries (>100ms)
  if (duration > 100) {
    logger.warn('Slow database query', {
      query: query.substring(0, 200),
      duration: `${duration.toFixed(2)}ms`,
      rows,
    })
  }
}

/**
 * Get performance report
 */
export function getPerformanceReport(): {
  api: ReturnType<PerformanceMonitor['getSummary']>
  db: ReturnType<PerformanceMonitor['getSummary']>
  slowOperations: PerformanceMetric[]
} {
  return {
    api: performanceMonitor.getSummary('api_request'),
    db: performanceMonitor.getSummary('db_query'),
    slowOperations: performanceMonitor
      .export()
      .filter((m) => m.value > 1000)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10),
  }
}
