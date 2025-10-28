import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

// Подключение к CRM с использованием Authorization Code
export async function POST(request: NextRequest) {
  try {
    const { crmType, authCode, integrationId } = await request.json()

    if (!authCode || !integrationId) {
      return NextResponse.json(
        { success: false, error: 'Authorization code and integration ID required' },
        { status: 400 }
      )
    }

    // В реальном приложении здесь будет обмен auth code на access token через CRM API
    // Пока генерируем mock токены
    const accessToken = randomBytes(32).toString('hex')
    const refreshToken = randomBytes(32).toString('hex')

    // Сохраняем подключение в базу данных (пока mock)
    const connection = {
      id: integrationId,
      crmType,
      authCode,
      accessToken,
      refreshToken,
      isConnected: true,
      connectedAt: new Date().toISOString()
    }

    console.log('CRM Connection established:', connection)

    return NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      connection
    })

  } catch (error) {
    console.error('Error connecting to CRM:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to connect to CRM' },
      { status: 500 }
    )
  }
}
