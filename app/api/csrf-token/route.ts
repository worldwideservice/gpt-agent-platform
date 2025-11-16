/**
 * CSRF Token Generation Endpoint
 *
 * GET /api/csrf-token
 *
 * Генерирует и возвращает CSRF токен для клиента.
 * Токен сохраняется в HttpOnly cookie и возвращается в response body.
 *
 * Клиент должен:
 * 1. Получить токен из этого endpoint при инициализации
 * 2. Сохранить токен (из response body)
 * 3. Включать токен в заголовок X-CSRF-Token для всех state-changing запросов
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateCSRFToken, setCSRFCookie, getCSRFTokenFromCookie } from '@/lib/security/csrf'

export async function GET(request: NextRequest) {
  // Проверяем, есть ли уже токен в cookie
  const existingToken = getCSRFTokenFromCookie(request)

  // Если токен уже есть - возвращаем его
  if (existingToken) {
    return NextResponse.json({
      success: true,
      csrfToken: existingToken,
    })
  }

  // Генерируем новый токен
  const token = generateCSRFToken()

  // Создаем response
  const response = NextResponse.json({
    success: true,
    csrfToken: token,
  })

  // Устанавливаем cookie
  setCSRFCookie(response, token)

  return response
}
