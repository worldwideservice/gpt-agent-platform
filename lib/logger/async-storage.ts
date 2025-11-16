/**
 * AsyncLocalStorage for automatic request ID tracking
 * Allows logging with request context without passing it explicitly
 */

import { AsyncLocalStorage } from 'async_hooks'
import { randomUUID } from 'crypto'

export interface RequestContext {
  requestId: string
  userId?: string
  orgId?: string
  path?: string
  method?: string
  ip?: string
  userAgent?: string
  startTime?: number
}

// Create AsyncLocalStorage instance
const asyncLocalStorage = new AsyncLocalStorage<RequestContext>()

/**
 * Get current request context from AsyncLocalStorage
 */
export function getRequestContext(): RequestContext | undefined {
  return asyncLocalStorage.getStore()
}

/**
 * Get request ID from current context or generate new one
 */
export function getRequestId(): string {
  const context = getRequestContext()
  return context?.requestId || randomUUID()
}

/**
 * Run callback with request context
 */
export function runWithContext<T>(context: RequestContext, callback: () => T): T {
  return asyncLocalStorage.run(context, callback)
}

/**
 * Create request context from Request object
 */
export function createRequestContext(request: Request): RequestContext {
  const requestId =
    request.headers.get('x-request-id') ||
    request.headers.get('x-correlation-id') ||
    randomUUID()

  const url = new URL(request.url)

  return {
    requestId,
    path: url.pathname,
    method: request.method,
    ip: request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        undefined,
    userAgent: request.headers.get('user-agent') || undefined,
    startTime: Date.now(),
  }
}

/**
 * Update current request context with additional data
 */
export function updateRequestContext(updates: Partial<RequestContext>): void {
  const current = getRequestContext()
  if (current) {
    Object.assign(current, updates)
  }
}

/**
 * Get request duration in milliseconds
 */
export function getRequestDuration(): number | undefined {
  const context = getRequestContext()
  if (!context?.startTime) return undefined
  return Date.now() - context.startTime
}
