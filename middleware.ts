import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { auth } from '@/auth'

const PUBLIC_API_PREFIXES = ['/api/auth', '/api/integrations/kommo/oauth/callback']

const PUBLIC_API_PATHS = new Set([
  '/api/auth/reset-password/request',
  '/api/auth/reset-password/confirm',
])

export const config = {
  matcher: ['/api/:path*'],
}

const isPublicApiRoute = (pathname: string) => {
  if (PUBLIC_API_PATHS.has(pathname)) {
    return true
  }

  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export default async function middleware(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  if (isPublicApiRoute(pathname)) {
    return NextResponse.next()
  }

  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  return NextResponse.next()
}
