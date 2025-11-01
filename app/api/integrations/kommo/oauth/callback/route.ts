import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { backendFetch } from '@/lib/backend/client'

const querySchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
  error: z.string().optional(),
  error_description: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse({
      code: searchParams.get('code'),
      state: searchParams.get('state'),
      error: searchParams.get('error'),
      error_description: searchParams.get('error_description'),
    })

    // Если есть ошибка от Kommo
    if (query.error) {
      console.error('Kommo OAuth error:', query.error, query.error_description)
      return NextResponse.json({
        success: false,
        error: query.error,
        description: query.error_description,
      }, { status: 400 })
    }

    // Если нет кода - ошибка
    if (!query.code) {
      return NextResponse.json({
        success: false,
        error: 'Authorization code not provided',
      }, { status: 400 })
    }

    console.log('Processing Kommo OAuth callback:', {
      code: query.code.substring(0, 10) + '...',
      state: query.state,
    })

    // Отправляем код на backend для обработки
    const result = await backendFetch<{ success: boolean; connection?: any }>('/kommo/oauth/callback', {
      method: 'POST',
      body: JSON.stringify({
        code: query.code,
        state: query.state,
        provider: 'kommo',
      }),
    })

    console.log('Kommo OAuth callback result:', result)

    if (result.success) {
      // Перенаправляем на страницу успеха или показываем результат
      return NextResponse.redirect(
        new URL('/integrations?success=kommo_oauth', request.url),
        302
      )
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to process OAuth callback',
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Kommo OAuth callback processing error:', error)

    return NextResponse.json({
      success: false,
      error: error instanceof z.ZodError ? 'Invalid request parameters' : 'Internal server error',
    }, { status: error instanceof z.ZodError ? 400 : 500 })
  }
}
