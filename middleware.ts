import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware для редиректов со старых путей на новые Kwid-подобные пути
 * Если пользователь на старом пути и есть организация, редиректим на новый формат
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропускаем статические файлы и API роуты
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Если уже на новом пути, пропускаем
  if (pathname.startsWith('/manage/')) {
    return NextResponse.next()
  }

  // Редиректы для публичных страниц (не требуют tenant-id)
  const publicPaths = ['/login', '/register', '/reset-password', '/', '/pricing', '/demo', '/support']
  if (publicPaths.includes(pathname) || publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Для защищенных путей - редирект будет обрабатываться в layout
  // Здесь просто пропускаем дальше
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
