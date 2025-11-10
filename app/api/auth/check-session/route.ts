import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { auth } from '@/auth'
import { logger } from '@/lib/utils/logger'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * API endpoint для проверки типа сессии (rememberMe)
 * Используется для определения, нужно ли редиректить авторизованного пользователя в приложение
 */
export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({
        success: false,
        hasRememberMe: false,
        isAuthenticated: false,
      })
    }

    // Проверяем наличие rememberMe cookie
    const cookieStore = await cookies()
    const rememberMeCookie = cookieStore.get('rememberMe')
    const hasRememberMe = rememberMeCookie?.value === 'true'

    // Также проверяем NextAuth session cookie на наличие долгосрочной сессии
    // Если cookie имеет maxAge > 7 дней, значит это долгосрочная сессия
    const nextAuthCookies = cookieStore.getAll().filter((cookie) =>
      cookie.name.startsWith('authjs.session-token') || cookie.name.startsWith('__Secure-authjs.session-token')
    )

    // Если есть rememberMe cookie, возвращаем true
    return NextResponse.json({
      success: true,
      hasRememberMe,
      isAuthenticated: true,
    })
  } catch (error) {
    logger.error('[check-session] Failed to check session', error)
    return NextResponse.json(
      {
        success: false,
        hasRememberMe: false,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

