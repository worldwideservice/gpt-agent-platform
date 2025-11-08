import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { auth } from '@/auth'
import { logger } from '@/lib/utils/logger'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * API endpoint для установки долгосрочной сессии (rememberMe)
 * Устанавливает maxAge для NextAuth session cookie
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Не авторизован',
        },
        { status: 401 }
      )
    }

    const cookieStore = await cookies()
    const rememberMeCookie = cookieStore.get('rememberMe')

    // Если rememberMe установлен, обновляем NextAuth session cookie с maxAge
    if (rememberMeCookie?.value === 'true') {
      // Получаем все NextAuth cookies
      const nextAuthCookies = cookieStore.getAll().filter((cookie) =>
        cookie.name.startsWith('authjs.session-token') || cookie.name.startsWith('__Secure-authjs.session-token')
      )

      // Устанавливаем maxAge для NextAuth session cookie (30 дней)
      const maxAge = 30 * 24 * 60 * 60 // 30 дней в секундах

      const response = NextResponse.json({
        success: true,
        message: 'Долгосрочная сессия установлена',
      })

      // Обновляем все NextAuth session cookies с новым maxAge
      nextAuthCookies.forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value, {
          maxAge,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        })
      })

      logger.debug('[set-remember-me] Long-term session set', {
        maxAge: `${maxAge}s`,
        cookiesUpdated: nextAuthCookies.length,
      })

      return response
    }

    return NextResponse.json({
      success: false,
      error: 'rememberMe не установлен',
    })
  } catch (error) {
    logger.error('[set-remember-me] Failed to set remember me', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

