import { NextRequest, NextResponse } from 'next/server'
import { kommoOAuthConfig } from '@/lib/crm/config/kommo.config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { redirectUri } = body

    // Генерируем state для безопасности
    const state = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15)

    // Создаем URL для авторизации
    const authUrl = new URL(kommoOAuthConfig.authUrl)
    authUrl.searchParams.set('client_id', kommoOAuthConfig.clientId)
    authUrl.searchParams.set('redirect_uri', redirectUri || kommoOAuthConfig.redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', kommoOAuthConfig.scope)
    authUrl.searchParams.set('state', state)

    return NextResponse.json({
      authUrl: authUrl.toString(),
      state: state
    })

  } catch (error) {
    console.error('Kommo OAuth initiation error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate OAuth' },
      { status: 500 }
    )
  }
}
