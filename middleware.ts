import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { auth } from '@/auth'
import { checkRateLimit, checkTierRateLimit, rateLimitConfigs } from '@/lib/rate-limit'
import { logger } from '@/lib/utils'

const PUBLIC_PATHS = ['/login', '/reset-password', '/support', '/demo', '/', '/pricing', '/onboarding', '/api-docs', '/integrations/kommo/oauth/callback']
const PUBLIC_API_PREFIXES = ['/api/auth', '/api/integrations/kommo/oauth/callback']

const PUBLIC_API_PATHS = new Set([
  '/api/auth/reset-password/request',
  '/api/auth/reset-password/confirm',
  '/api/auth/register',
  '/api/health',
  '/api/health/ready',
])

const isPublicPath = (pathname: string) => {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

const isPublicApiRoute = (pathname: string) => {
  if (PUBLIC_API_PATHS.has(pathname)) {
    return true
  }

  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

// Security headers
function addSecurityHeaders(response: NextResponse) {
  // Essential security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')

  // HTTPS enforcement
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  return response
}

// Input sanitization
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .slice(0, 10000) // Limit length
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const startTime = Date.now()

  try {
    // Input sanitization for query parameters
    const url = new URL(request.url)
    for (const [key, value] of url.searchParams) {
      if (typeof value === 'string') {
        const sanitized = sanitizeInput(value)
        if (sanitized !== value) {
          logger.warn('Potentially malicious input detected', {
            key,
            originalLength: value.length,
            sanitizedLength: sanitized.length,
            path: pathname,
            ip: request.headers.get('x-forwarded-for') || 'anonymous',
          })
        }
      }
    }

    // Демо режим для локального тестирования
    const isDemoMode = process.env.NODE_ENV === 'development' ||
      request.headers.get('host')?.includes('localhost') ||
      process.env.DEMO_MODE === 'true' ||
      process.env.E2E_ONBOARDING_FAKE === '1'

  // Проверяем API routes
  if (pathname.startsWith('/api/')) {
    if (request.method === 'OPTIONS') {
      return NextResponse.next()
    }

    // Tier-based rate limiting для API endpoints
    if (!pathname.startsWith('/api/health') && !pathname.startsWith('/api/auth')) {
      // Получаем информацию о пользователе для tier-based limiting
      let userId: string | undefined
      let orgId: string | undefined

      if (!isDemoMode) {
        try {
          const session = await auth()
          userId = session?.user?.id
          orgId = session?.user?.orgId
        } catch (error) {
          // Ignore auth errors for rate limiting
        }
      }

      // Определяем тип endpoint для rate limiting
      let endpointType: 'api' | 'chat' | 'upload' | 'knowledge' = 'api'

      if (pathname.includes('/chat')) {
        endpointType = 'chat'
      } else if (pathname.includes('/upload') || pathname.includes('/file')) {
        endpointType = 'upload'
      } else if (pathname.includes('/knowledge') || pathname.includes('/agents')) {
        endpointType = 'knowledge'
      }

      const rateLimitResult = await checkTierRateLimit(request, endpointType, userId, orgId)
      if (rateLimitResult) {
        logger.warn('Rate limit exceeded', {
          userId,
          orgId,
          endpointType,
          path: pathname,
          ip: request.headers.get('x-forwarded-for') || 'anonymous',
        })
        addSecurityHeaders(rateLimitResult as NextResponse)
        return rateLimitResult
      }
    }

    if (isPublicApiRoute(pathname)) {
      return NextResponse.next()
    }

    // В демо режиме пропускаем аутентификацию для API
    if (!isDemoMode) {
      const session = await auth()
      if (!session?.user?.orgId) {
        const response = NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
        addSecurityHeaders(response)

        logger.warn('Unauthorized API access attempt', {
          path: pathname,
          method: request.method,
          ip: request.headers.get('x-forwarded-for') || 'anonymous',
        })

        return response
      }
    }

    const response = NextResponse.next()
    addSecurityHeaders(response)
    return response
  }

  // Проверяем UI routes (кроме публичных)
  if (!isPublicPath(pathname)) {
    // В демо режиме пропускаем аутентификацию для UI
    if (!isDemoMode) {
      const session = await auth()
      if (!session?.user?.orgId) {
        logger.info('Redirecting to login - unauthorized access', {
          path: pathname,
          ip: request.headers.get('x-forwarded-for') || 'anonymous',
        })

        // Редиректим на логин для неавторизованных пользователей
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }
    } else if (isDemoMode && process.env.E2E_ONBOARDING_FAKE === '1') {
      // В E2E режиме автоматически создаем сессию для демо пользователя
      // Это позволяет тестам работать без ручной аутентификации
      // NextAuth сам обработает сессию через auth()
    }
  }

  const response = NextResponse.next()
  addSecurityHeaders(response)

  // Log successful request
  const duration = Date.now() - startTime
  logger.debug('Request processed', {
    method: request.method,
    path: pathname,
    duration: `${duration}ms`,
    userAgent: request.headers.get('user-agent')?.slice(0, 200),
  })

  return response

  } catch (error) {
    logger.error('Middleware error', error as Error, {
      path: pathname,
      method: request.method,
      ip: request.headers.get('x-forwarded-for') || 'anonymous',
    })

    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
    addSecurityHeaders(response)
    return response
  }
}
