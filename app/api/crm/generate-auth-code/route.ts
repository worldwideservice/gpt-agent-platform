import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

// Генерация Authorization Code (действителен 20 минут)
export async function POST(request: NextRequest) {
  try {
    const { crmType, secretKey, integrationId } = await request.json()

    if (!secretKey || !integrationId) {
      return NextResponse.json(
        { success: false, error: 'Secret key and integration ID required' },
        { status: 400 }
      )
    }

    // Генерируем Authorization Code (40 байт в hex)
    const authCode = randomBytes(40).toString('hex')

    // В реальном приложении здесь будет вызов API CRM для получения кода авторизации
    // Пока возвращаем сгенерированный код
    return NextResponse.json({
      success: true,
      authCode
    })

  } catch (error) {
    console.error('Error generating auth code:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate authorization code' },
      { status: 500 }
    )
  }
}
