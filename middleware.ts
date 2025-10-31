import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { auth } from '@/auth'
import { checkRateLimit, checkTierRateLimit, rateLimitConfigs } from '@/lib/rate-limit'

const PUBLIC_PATHS = ['/login', '/reset-password', '/support', '/demo', '/', '/pricing', '/onboarding', '/api-docs']
const PUBLIC_API_PREFIXES = ['/api/auth', '/api/integrations/kommo/oauth/callback']

const PUBLIC_API_PATHS = new Set([
  '/api/auth/reset-password/request',
  '/api/auth/reset-password/confirm',
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
        return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
      }
    }

    return NextResponse.next()
  }

  // Проверяем UI routes (кроме публичных)
  if (!isPublicPath(pathname)) {
    // В демо режиме пропускаем аутентификацию для UI
    if (!isDemoMode) {
      const session = await auth()
      if (!session?.user?.orgId) {
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

  return NextResponse.next()
}
