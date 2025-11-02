import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

/**
 * Middleware для обработки маршрутизации и проверки авторизации
 * Выполняется ДО загрузки страницы - блокирует доступ неавторизованным
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

  // Публичные пути (главная страница)
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Защищенные пути - проверяем авторизацию
  if (pathname.startsWith('/platform')) {
    const session = await auth()
    
    if (!session?.user) {
      // Неавторизованный пользователь - редирект на главную
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

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
