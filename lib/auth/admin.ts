/**
 * Admin Authentication and Authorization
 *
 * Задача 5.1: Security Audit
 * Усиленная проверка admin доступа для критичных endpoints
 */

import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

/**
 * Проверяет, является ли пользователь администратором
 *
 * Admin пользователь определяется по:
 * 1. Наличию валидной сессии
 * 2. Email пользователя в списке ADMIN_EMAILS из env
 * 3. Или наличию role: 'admin' в user объекте
 *
 * Для дополнительной безопасности также проверяется Bearer токен из env
 */
export async function isAdmin(request: NextRequest): Promise<boolean> {
  try {
    // 1. Проверяем Bearer токен (для скриптов и CLI инструментов)
    const authHeader = request.headers.get('authorization')
    const adminToken = process.env.ADMIN_API_TOKEN

    if (adminToken && authHeader === `Bearer ${adminToken}`) {
      return true
    }

    // 2. Проверяем сессию пользователя
    const session = await auth()

    if (!session?.user) {
      return false
    }

    // 3. Проверяем роль в сессии
    if (session.user.role === 'admin') {
      return true
    }

    // 4. Проверяем email в списке admin emails
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || []

    if (session.user.email && adminEmails.includes(session.user.email)) {
      return true
    }

    return false
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Middleware helper для защиты admin endpoints
 *
 * Использование в API routes:
 * ```typescript
 * import { requireAdmin } from '@/lib/auth/admin'
 *
 * export async function GET(request: NextRequest) {
 *   const adminCheck = await requireAdmin(request)
 *   if (adminCheck) return adminCheck
 *
 *   // ... admin-only логика
 * }
 * ```
 */
export async function requireAdmin(request: NextRequest): Promise<Response | null> {
  const admin = await isAdmin(request)

  if (!admin) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Unauthorized - Admin access required',
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  return null
}
