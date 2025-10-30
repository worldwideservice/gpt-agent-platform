import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { auth } from '@/auth'

const PUBLIC_PATHS = ['/login', '/reset-password', '/support']
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

  // Проверяем API routes
  if (pathname.startsWith('/api/')) {
    if (request.method === 'OPTIONS') {
      return NextResponse.next()
    }

    if (isPublicApiRoute(pathname)) {
      return NextResponse.next()
    }

    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
    }

    return NextResponse.next()
  }

  // Проверяем UI routes (кроме публичных)
  if (!isPublicPath(pathname)) {
    const session = await auth()

    if (!session?.user?.orgId) {
      // Редиректим на логин для неавторизованных пользователей
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}
