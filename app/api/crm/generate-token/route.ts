import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

// Генерация Long-term Token
export async function POST(request: NextRequest) {
  try {
    const { crmType, secretKey, integrationId } = await request.json()

    if (!secretKey || !integrationId) {
      return NextResponse.json(
        { success: false, error: 'Secret key and integration ID required' },
        { status: 400 }
      )
    }

    // Генерируем Long-term Token (64 байта в hex)
    const longTermToken = randomBytes(64).toString('hex')

    // В реальном приложении здесь будет вызов API CRM для получения токена
    // Пока возвращаем сгенерированный токен
    return NextResponse.json({
      success: true,
      longTermToken
    })

  } catch (error) {
    console.error('Error generating long-term token:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate long-term token' },
      { status: 500 }
    )
  }
}
