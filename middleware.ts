import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware для редиректов со старых путей на новые Kwid-подобные пути
 * Редиректы на базовые пути без tenant-id, layout подставит tenant-id из сессии
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

 // Редирект всех путей /manage/* на главную (платформа удалена)
 if (pathname.startsWith('/manage/')) {
 return NextResponse.redirect(new URL('/', request.url))
 }

 // Редиректы для публичных страниц (не требуют tenant-id)
 const publicPaths = ['/login', '/register', '/reset-password', '/', '/pricing', '/demo', '/support']
 if (publicPaths.includes(pathname) || publicPaths.some(p => pathname.startsWith(p))) {
 return NextResponse.next()
 }

 // Редиректы старых путей на главную (платформа удалена)
 const redirects: Record<string, string> = {
 '/agents': '/',
 '/knowledge-base/articles': '/',
 '/knowledge-base/categories': '/',
 '/account': '/',
 '/chat': '/',
 '/manage': '/',
 }

 // Проверяем точное совпадение
 if (redirects[pathname]) {
 return NextResponse.redirect(new URL(redirects[pathname], request.url))
 }

 // Проверяем префиксы
 for (const [oldPath, newPath] of Object.entries(redirects)) {
 if (pathname.startsWith(oldPath + '/')) {
 const rest = pathname.slice(oldPath.length)
 return NextResponse.redirect(new URL(`${newPath}${rest}`, request.url))
 }
 }

 // Для остальных защищенных путей - пропускаем дальше
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
