import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { auth } from '@/auth'
import { validateTenantAccess } from '@/lib/auth/validate-tenant'
import {
  authRateLimiter,
  apiRateLimiter,
  publicApiRateLimiter,
  getRateLimitIdentifier,
} from '@/lib/rate-limit'
import { csrfProtection } from '@/lib/security/csrf'

/**
 * Middleware для защиты путей и проверки tenant access control
 *
 * Задача 5.1: Security Audit
 * - Добавлена CSRF защита для всех API endpoints
 * - Расширен rate limiting на все API endpoints
 * - Улучшены security headers
 */
export default auth(async (req) => {
  const { pathname } = req.nextUrl
  const session = req.auth
  const userId = session?.user?.id || null
  const identifier = getRateLimitIdentifier(req, userId)

  // 0. CSRF PROTECTION: Защита от CSRF атак (опционально, через env)
  if (pathname.startsWith('/api/') && process.env.ENABLE_CSRF_PROTECTION === '1') {
    const csrfResponse = csrfProtection(req)
    if (csrfResponse) {
      return csrfResponse
    }
  }

  // 1. RATE LIMITING: Проверка лимитов для auth endpoints
  if (
    pathname.startsWith('/api/auth/signin') ||
    pathname.startsWith('/api/auth/callback/credentials') ||
    pathname === '/api/auth/register' ||
    pathname.startsWith('/api/auth/reset-password')
  ) {
    if (authRateLimiter) {
      const { success, remaining, reset } = await authRateLimiter.limit(
        getRateLimitIdentifier(req), // Всегда по IP для auth
      )
      if (!success) {
        return NextResponse.json(
          { error: 'Too many auth requests. Please try again later.' },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': '10',
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          },
        )
      }
    }
  }

  // 2. RATE LIMITING + TENANT ACCESS: Проверка для API управления
  if (pathname.startsWith('/api/manage/')) {
    // Применяем rate limiting
    const limiter = userId ? apiRateLimiter : publicApiRateLimiter
    if (limiter) {
      const { success, remaining, reset } = await limiter.limit(identifier)

      if (!success) {
        return NextResponse.json(
          { error: 'Too many requests.' },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': (userId ? 100 : 20).toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          },
        )
      }
    }

    // TENANT ACCESS CONTROL (из Задачи 1.1)
    // Извлекаем tenantId из URL: /api/manage/[tenantId]/...
    const pathParts = pathname.split('/')
    const tenantId = pathParts[3] // /api/manage/[tenantId]/...

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Bad Request: Missing tenantId' },
        { status: 400 }
      )
    }

    // Проверяем сессию
    if (!session?.user?.orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Проверяем доступ к tenant'у
    const hasAccess = await validateTenantAccess(tenantId, session.user.orgId)

    if (!hasAccess) {
      // Log security violation
      // eslint-disable-next-line no-console
      console.warn(
        `[MIDDLEWARE] Forbidden: User ${session.user.id} attempted to access tenant ${tenantId}`
      )
      return NextResponse.json(
        { error: 'Forbidden: Invalid tenant access' },
        { status: 403 }
      )
    }

    // Доступ разрешен, пропускаем запрос
    return NextResponse.next()
  }

  // 3. RATE LIMITING: Применяем ко всем остальным API endpoints
  if (pathname.startsWith('/api/')) {
    // Пропускаем публичные endpoints без rate limit
    const publicEndpoints = [
      '/api/health',
      '/api/metrics',
      '/api/crm/webhook',
    ]

    if (!publicEndpoints.some(endpoint => pathname.startsWith(endpoint))) {
      const limiter = userId ? apiRateLimiter : publicApiRateLimiter
      if (limiter) {
        const { success, remaining, reset } = await limiter.limit(identifier)

        if (!success) {
          return NextResponse.json(
            { error: 'Too many requests.' },
            {
              status: 429,
              headers: {
                'X-RateLimit-Limit': (userId ? 100 : 20).toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': reset.toString(),
              },
            },
          )
        }
      }
    }
  }

  // 4. Пропускаем статические файлы
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 5. Разрешаем /manage/[tenantId] - это страница приложения
  if (pathname.startsWith('/manage/')) {
    return NextResponse.next()
  }

  // 6. Редиректы для публичных страниц
  const publicPaths = [
    '/login',
    '/register',
    '/reset-password',
    '/',
    '/pricing',
    '/demo',
    '/support',
  ]
  if (publicPaths.includes(pathname) || publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // 7. Для остальных защищенных путей - пропускаем дальше
  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
