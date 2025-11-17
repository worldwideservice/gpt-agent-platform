/**
 * Simplified API wrappers for rate limiting
 * Use these in your API routes for quick rate limiting setup
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  checkRateLimit,
  getIdentifier,
  createRateLimitResponse,
  addRateLimitHeaders,
  RateLimitPresets,
  type RateLimitConfig,
} from './rate-limit'
import { logger } from '@/lib/utils/logger'

/**
 * Apply rate limiting to an API route
 * Returns null if allowed, or a 429 Response if rate limit exceeded
 */
export async function applyRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  userId?: string
): Promise<NextResponse | null> {
  const identifier = getIdentifier(request, userId)
  const result = await checkRateLimit(identifier, config)

  if (!result.success) {
    logger.warn('Rate limit exceeded', {
      identifier,
      endpoint: config.endpoint,
      url: request.url,
    })
    return createRateLimitResponse(result)
  }

  return null
}

/**
 * Rate limit helper for standard API endpoints
 * Usage in route.ts:
 *
 * export async function GET(request: NextRequest) {
 *   const rateLimitResponse = await rateLimitAPI(request)
 *   if (rateLimitResponse) return rateLimitResponse
 *
 *   // Your logic here...
 * }
 */
export async function rateLimitAPI(
  request: NextRequest,
  userId?: string
): Promise<NextResponse | null> {
  return applyRateLimit(request, { ...RateLimitPresets.api, endpoint: 'api' }, userId)
}

/**
 * Rate limit helper for authentication endpoints
 * Stricter limits to prevent brute force attacks
 */
export async function rateLimitAuth(request: NextRequest): Promise<NextResponse | null> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
             request.headers.get('x-real-ip') ||
             request.ip ||
             'unknown'

  return applyRateLimit(
    request,
    { ...RateLimitPresets.auth, endpoint: 'auth' },
    undefined // Use IP only for auth
  )
}

/**
 * Rate limit helper for webhook endpoints
 */
export async function rateLimitWebhook(
  request: NextRequest,
  webhookSource?: string
): Promise<NextResponse | null> {
  const identifier = webhookSource || getIdentifier(request)
  const result = await checkRateLimit(identifier, {
    ...RateLimitPresets.webhook,
    endpoint: 'webhook',
  })

  if (!result.success) {
    return createRateLimitResponse(result)
  }

  return null
}

/**
 * Rate limit helper for file upload endpoints
 */
export async function rateLimitUpload(
  request: NextRequest,
  userId?: string
): Promise<NextResponse | null> {
  return applyRateLimit(
    request,
    { ...RateLimitPresets.upload, endpoint: 'upload' },
    userId
  )
}

/**
 * Rate limit helper for AI/LLM endpoints
 * These are expensive operations that need stricter limiting
 */
export async function rateLimitAI(
  request: NextRequest,
  userId?: string
): Promise<NextResponse | null> {
  return applyRateLimit(request, { ...RateLimitPresets.ai, endpoint: 'ai' }, userId)
}

/**
 * Decorator pattern for API routes
 * Automatically applies rate limiting and adds headers
 *
 * Usage:
 * export const GET = withAPIRateLimit(async (request) => {
 *   return NextResponse.json({ data: 'your data' })
 * })
 */
export function withAPIRateLimit(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  config: RateLimitConfig = { ...RateLimitPresets.api, endpoint: 'api' }
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      // Extract user ID from headers if available
      const userId = request.headers.get('x-user-id') || undefined
      const identifier = getIdentifier(request, userId)

      // Check rate limit
      const result = await checkRateLimit(identifier, config)

      if (!result.success) {
        logger.warn('Rate limit exceeded', {
          identifier,
          endpoint: config.endpoint,
          url: request.url,
        })
        return createRateLimitResponse(result)
      }

      // Call handler
      const response = await handler(request, context)

      // Add rate limit headers to response
      return addRateLimitHeaders(response, result)
    } catch (error) {
      logger.error('Rate limit middleware error:', error)
      // Fail open - continue to handler
      return handler(request, context)
    }
  }
}

/**
 * Get user ID from JWT token in request headers
 * You can customize this based on your auth implementation
 */
export function getUserIdFromRequest(request: NextRequest): string | undefined {
  try {
    // Try to get from custom header (set by auth middleware)
    const userId = request.headers.get('x-user-id')
    if (userId) return userId

    // Try to extract from Authorization header
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      // You would decode JWT here
      // This is a placeholder - implement based on your auth
      return undefined
    }

    return undefined
  } catch (error) {
    logger.error('Error extracting user ID from request:', error)
    return undefined
  }
}
