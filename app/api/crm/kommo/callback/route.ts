import { NextRequest, NextResponse } from 'next/server'
import { kommoOAuthConfig } from '@/lib/crm/config/kommo.config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Проверяем ошибки от Kommo
    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://gpt-agent-platform.vercel.app'}/integrations?error=${encodeURIComponent(error)}`
      )
    }

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code not provided' },
        { status: 400 }
      )
    }

    // Обмениваем код на токен
    const tokenResponse = await fetch(kommoOAuthConfig.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: kommoOAuthConfig.clientId,
        client_secret: kommoOAuthConfig.clientSecret,
        redirect_uri: kommoOAuthConfig.redirectUri,
        code: code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange error:', errorData)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://gpt-agent-platform.vercel.app'}/integrations?error=token_exchange_failed`
      )
    }

    const tokenData = await tokenResponse.json()

    // Сохраняем токены (в реальном приложении - в базе данных)
    const connection = {
      id: Date.now().toString(),
      crmType: 'kommo',
      isConnected: true,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      lastSyncAt: new Date(),
      config: {
        id: 'kommo',
        name: 'Kommo CRM',
        logo: '/logos/kommo.svg',
        description: 'Kommo CRM подключена',
        authType: 'oauth2',
        baseUrl: 'https://kommo.com/api/v4',
        scopes: kommoOAuthConfig.scope.split(' '),
        fields: []
      }
    }

    // В реальном приложении здесь будет сохранение в базу данных
    console.log('Kommo connection established:', connection)

    // Редиректим на страницу интеграций с успехом
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://gpt-agent-platform.vercel.app'}/integrations?success=kommo_connected`
    )

  } catch (error) {
    console.error('Kommo OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://gpt-agent-platform.vercel.app'}/integrations?error=oauth_callback_failed`
    )
  }
}
