import { NextRequest, NextResponse } from 'next/server'

// OAuth авторизация для CRM
export async function POST(request: NextRequest) {
  try {
    const { crmType, clientId, clientSecret, redirectUri, domain } = await request.json()

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { success: false, error: 'Client ID, Client Secret и Redirect URI обязательны' },
        { status: 400 }
      )
    }

    let authUrl: string

    switch (crmType) {
      case 'kommo':
        if (!domain) {
          return NextResponse.json(
            { success: false, error: 'Домен Kommo обязателен' },
            { status: 400 }
          )
        }
        
        // Kommo OAuth URL
        const kommoParams = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: 'code',
          state: generateState()
        })
        
        authUrl = `https://${domain}/oauth/authorize?${kommoParams.toString()}`
        break

      case 'zoho':
        // Zoho OAuth URL
        const zohoParams = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: 'code',
          scope: 'ZohoCRM.modules.ALL,ZohoCRM.users.ALL',
          state: generateState()
        })
        
        authUrl = `https://accounts.zoho.com/oauth/v2/auth?${zohoParams.toString()}`
        break

      case 'bitrix24':
        // Bitrix24 OAuth URL
        const bitrixParams = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: 'code',
          state: generateState()
        })
        
        authUrl = `https://oauth.bitrix.info/oauth/authorize/?${bitrixParams.toString()}`
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Неподдерживаемый тип CRM' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      authUrl
    })

  } catch (error) {
    console.error('OAuth authorization error:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при создании URL авторизации' },
      { status: 500 }
    )
  }
}

function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
