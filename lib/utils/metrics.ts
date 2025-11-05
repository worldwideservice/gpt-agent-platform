/**
 * Metrics Collection Utility
 * 
 * Provides utilities for collecting and reporting application metrics
 * for monitoring and analytics.
 */

import { logger } from './logger'

export interface MetricData {
  name: string
  value: number
  timestamp: number
  tags?: Record<string, string>
}

class MetricsCollector {
  private metrics: MetricData[] = []
  private readonly maxMetrics = 500

  /**
   * Record a metric
   */
  record(metric: MetricData): void {
    this.metrics.push({
      ...metric,
      timestamp: metric.timestamp || Date.now(),
    })

    // Keep only last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // Log important metrics
    if (metric.value > 1000) {
      logger.warn(`[Metrics] High value metric: ${metric.name}`, {
        value: metric.value,
        tags: metric.tags,
      })
    }
  }

  /**
   * Record redirect metric
   */
  recordRedirect(from: string, to: string, duration: number, success: boolean): void {
    this.record({
      name: 'redirect',
      value: duration,
      timestamp: Date.now(),
      tags: {
        from,
        to,
        success: success.toString(),
      },
    })
  }

  /**
   * Record API call metric
   */
  recordApiCall(endpoint: string, duration: number, status: number): void {
    this.record({
      name: 'api_call',
      value: duration,
      timestamp: Date.now(),
      tags: {
        endpoint,
        status: status.toString(),
      },
    })
  }

  /**
   * Record error metric
   */
  recordError(errorType: string, context?: Record<string, string>): void {
    this.record({
      name: 'error',
      value: 1,
      timestamp: Date.now(),
      tags: {
        errorType,
        ...context,
      },
    })
  }

  /**
   * Get metrics summary
   */
  getSummary(name?: string): {
    count: number
    avg: number
    min: number
    max: number
    sum: number
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
        sum: 0,
      }
    }

    const values = filtered.map(m => m.value)
    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)

    return {
      count: filtered.length,
      avg: Math.round(avg * 100) / 100,
      min,
      max,
      sum,
    }
  }

  /**
   * Get metrics by tag
   */
  getByTag(tagName: string, tagValue: string): MetricData[] {
    return this.metrics.filter(
      m => m.tags && m.tags[tagName] === tagValue
    )
  }

  /**
   * Clear metrics
   */
  clear(): void {
    this.metrics = []
  }

  /**
   * Export metrics for external monitoring
   */
  export(): MetricData[] {
    return [...this.metrics]
  }
}

// Singleton instance
export const metrics = new MetricsCollector()

// Export default
export default metrics

