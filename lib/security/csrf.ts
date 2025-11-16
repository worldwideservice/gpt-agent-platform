/**
 * CSRF Protection для Next.js API Routes
 *
 * Реализация Double Submit Cookie Pattern:
 * 1. Генерируется случайный токен при первом запросе
 * 2. Токен сохраняется в HttpOnly cookie
 * 3. Клиент должен отправить токен в заголовке X-CSRF-Token
 * 4. Сервер проверяет совпадение токена из cookie и заголовка
 *
 * Использование в API routes:
 * ```typescript
 * import { validateCSRF } from '@/lib/security/csrf'
 *
 * export async function POST(request: NextRequest) {
 *   const csrfValid = await validateCSRF(request)
 *   if (!csrfValid) {
 *     return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
 *   }
 *   // ... остальная логика
 * }
 * ```
 */

import { NextRequest, NextResponse } from 'next/server'
import { randomBytes, timingSafeEqual } from 'crypto'

export const CSRF_COOKIE_NAME = '__Host-csrf-token'
export const CSRF_HEADER_NAME = 'x-csrf-token'
export const CSRF_TOKEN_LENGTH = 32

/**
 * Генерирует криптографически стойкий CSRF токен
 */
export function generateCSRFToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('base64url')
}

/**
 * Устанавливает CSRF токен в cookie
 */
export function setCSRFCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  })
  return response
}

/**
 * Получает CSRF токен из cookie
 */
export function getCSRFTokenFromCookie(request: NextRequest): string | null {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value || null
}

/**
 * Получает CSRF токен из заголовка
 */
export function getCSRFTokenFromHeader(request: NextRequest): string | null {
  return request.headers.get(CSRF_HEADER_NAME) || null
}

/**
 * Валидирует CSRF токен
 *
 * Проверяет, что:
 * 1. Токен присутствует в cookie
 * 2. Токен присутствует в заголовке
 * 3. Токены совпадают (используя timing-safe сравнение)
 *
 * @param request - NextRequest объект
 * @returns true если токен валиден, false если нет
 */
export function validateCSRF(request: NextRequest): boolean {
  const cookieToken = getCSRFTokenFromCookie(request)
  const headerToken = getCSRFTokenFromHeader(request)

  // Если один из токенов отсутствует - валидация провалена
  if (!cookieToken || !headerToken) {
    return false
  }

  try {
    // Используем timing-safe сравнение для защиты от timing attacks
    const cookieBuffer = Buffer.from(cookieToken)
    const headerBuffer = Buffer.from(headerToken)

    // Токены должны быть одинаковой длины
    if (cookieBuffer.length !== headerBuffer.length) {
      return false
    }

    return timingSafeEqual(cookieBuffer, headerBuffer)
  } catch (error) {
    // Если произошла ошибка при сравнении - токен невалиден
    return false
  }
}

/**
 * Проверяет, требуется ли CSRF защита для данного метода
 *
 * CSRF защита требуется для всех state-changing методов:
 * POST, PUT, PATCH, DELETE
 */
export function requiresCSRFProtection(method: string): boolean {
  const statefulMethods = ['POST', 'PUT', 'PATCH', 'DELETE']
  return statefulMethods.includes(method.toUpperCase())
}

/**
 * Middleware для автоматической CSRF защиты
 *
 * Пример использования в middleware.ts:
 * ```typescript
 * import { csrfProtection } from '@/lib/security/csrf'
 *
 * export async function middleware(request: NextRequest) {
 *   // CSRF защита для API routes
 *   if (request.nextUrl.pathname.startsWith('/api/')) {
 *     const csrfResponse = csrfProtection(request)
 *     if (csrfResponse) return csrfResponse
 *   }
 *   return NextResponse.next()
 * }
 * ```
 */
export function csrfProtection(request: NextRequest): NextResponse | null {
  // Пропускаем GET, HEAD, OPTIONS - они не меняют state
  if (!requiresCSRFProtection(request.method)) {
    return null
  }

  // Пропускаем публичные endpoints которые не требуют CSRF
  const publicEndpoints = [
    '/api/auth/signin',
    '/api/auth/callback',
    '/api/auth/register',
    '/api/crm/webhook', // Webhook от внешних систем
    '/api/health',
    '/api/metrics',
  ]

  if (publicEndpoints.some(endpoint => request.nextUrl.pathname.startsWith(endpoint))) {
    return null
  }

  // Проверяем CSRF токен
  const isValid = validateCSRF(request)

  if (!isValid) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid or missing CSRF token',
        code: 'CSRF_VALIDATION_FAILED'
      },
      { status: 403 }
    )
  }

  return null
}
