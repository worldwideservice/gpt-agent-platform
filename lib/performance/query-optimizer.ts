/**
 * Database Query Optimizer
 * Utilities for optimizing database queries
 */

import { logger } from '../logger'

/**
 * Query performance tracking
 */
export class QueryTracker {
  private queries: Map<
    string,
    {
      count: number
      totalTime: number
      avgTime: number
      maxTime: number
      minTime: number
    }
  > = new Map()

  track(name: string, duration: number): void {
    const existing = this.queries.get(name) || {
      count: 0,
      totalTime: 0,
      avgTime: 0,
      maxTime: 0,
      minTime: Infinity,
    }

    existing.count++
    existing.totalTime += duration
    existing.avgTime = existing.totalTime / existing.count
    existing.maxTime = Math.max(existing.maxTime, duration)
    existing.minTime = Math.min(existing.minTime, duration)

    this.queries.set(name, existing)

    // Log slow queries (>100ms)
    if (duration > 100) {
      logger.warn('Slow query detected', {
        query: name,
        duration: `${duration}ms`,
      })
    }
  }

  getStats() {
    return Array.from(this.queries.entries())
      .map(([name, stats]) => ({
        name,
        ...stats,
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
  }

  getSlowestQueries(limit: number = 10) {
    return this.getStats().slice(0, limit)
  }

  reset(): void {
    this.queries.clear()
  }
}

export const queryTracker = new QueryTracker()

/**
 * Measure query execution time
 */
export async function measureQuery<T>(
  name: string,
  query: () => Promise<T>
): Promise<T> {
  const start = performance.now()

  try {
    const result = await query()
    const duration = performance.now() - start

    queryTracker.track(name, duration)

    return result
  } catch (error) {
    const duration = performance.now() - start
    queryTracker.track(name, duration)

    logger.error('Query failed', {
      query: name,
      duration: `${duration}ms`,
      error,
    })

    throw error
  }
}

/**
 * Batch database queries
 */
export async function batchQueries<T>(
  queries: Array<() => Promise<T>>,
  batchSize: number = 10
): Promise<T[]> {
  const results: T[] = []

  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map((query) => query()))
    results.push(...batchResults)
  }

  return results
}

/**
 * Database connection pool stats
 */
export interface PoolStats {
  total: number
  idle: number
  active: number
  waiting: number
}

/**
 * Query pagination helper
 */
export interface PaginationOptions {
  page?: number
  limit?: number
  maxLimit?: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function calculatePagination(
  page: number = 1,
  limit: number = 20,
  maxLimit: number = 100
): {
  offset: number
  limit: number
  page: number
} {
  // Validate and clamp values
  const validPage = Math.max(1, Math.floor(page))
  const validLimit = Math.min(maxLimit, Math.max(1, Math.floor(limit)))
  const offset = (validPage - 1) * validLimit

  return {
    offset,
    limit: validLimit,
    page: validPage,
  }
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit)

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

/**
 * Index suggestion based on query patterns
 */
export interface IndexSuggestion {
  table: string
  columns: string[]
  type: 'btree' | 'hash' | 'gin' | 'gist'
  reason: string
}

export function suggestIndexes(slowQueries: string[]): IndexSuggestion[] {
  const suggestions: IndexSuggestion[] = []

  for (const query of slowQueries) {
    // Parse query for common patterns
    const whereMatch = query.match(/WHERE\s+(\w+)\s*=/i)
    const joinMatch = query.match(/JOIN\s+\w+\s+ON\s+(\w+)/i)
    const orderMatch = query.match(/ORDER BY\s+(\w+)/i)

    if (whereMatch) {
      suggestions.push({
        table: 'unknown',
        columns: [whereMatch[1]],
        type: 'btree',
        reason: 'Frequent WHERE clause filtering',
      })
    }

    if (joinMatch) {
      suggestions.push({
        table: 'unknown',
        columns: [joinMatch[1]],
        type: 'btree',
        reason: 'JOIN operation',
      })
    }

    if (orderMatch) {
      suggestions.push({
        table: 'unknown',
        columns: [orderMatch[1]],
        type: 'btree',
        reason: 'ORDER BY sorting',
      })
    }
  }

  return suggestions
}
