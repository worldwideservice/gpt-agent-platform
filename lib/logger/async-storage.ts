/**
 * AsyncLocalStorage for automatic request ID tracking
 * Allows logging with request context without passing it explicitly
 * Note: Works only in Node.js environment (server-side)
 */

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

// Check if we're in server environment
const isServer = typeof window === 'undefined'

let asyncLocalStorage: any = null
let randomUUID: any = null

// Initialize only on server
if (isServer) {
  try {
    const asyncHooks = require('async_hooks')
    const crypto = require('crypto')
    // AsyncLocalStorage without type argument for compatibility
    asyncLocalStorage = new (asyncHooks.AsyncLocalStorage as any)()
    randomUUID = crypto.randomUUID
  } catch (error) {
    // Silently fail in environments without async_hooks
  }
}

/**
 * Get current request context from AsyncLocalStorage
 */
export function getRequestContext(): RequestContext | undefined {
  if (!isServer || !asyncLocalStorage) return undefined
  return asyncLocalStorage.getStore()
}

/**
 * Get request ID from current context or generate new one
 */
export function getRequestId(): string {
  const context = getRequestContext()
  if (context?.requestId) return context.requestId

  // Generate UUID (server) or timestamp-based ID (client)
  if (isServer && randomUUID) {
    return randomUUID()
  }
  return `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Run callback with request context
 */
export function runWithContext<T>(context: RequestContext, callback: () => T): T {
  if (!isServer || !asyncLocalStorage) {
    return callback()
  }
  return asyncLocalStorage.run(context, callback)
}

/**
 * Create request context from Request object
 */
export function createRequestContext(request: Request): RequestContext {
  const url = new URL(request.url)

  const requestId =
    request.headers.get('x-request-id') ||
    request.headers.get('x-correlation-id') ||
    getRequestId()

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
  if (!isServer || !asyncLocalStorage) return

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
