import { NextRequest, NextResponse } from 'next/server'

// Простая проверка токена CRM
export async function POST(request: NextRequest) {
  try {
    const { crmType, accessToken, domain } = await request.json()

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Access Token обязателен' },
        { status: 400 }
      )
    }

    // Простая проверка токена через API CRM
    let testUrl: string
    let headers: Record<string, string> = {}

    switch (crmType) {
      case 'kommo':
        if (!domain) {
          return NextResponse.json(
            { success: false, error: 'Домен Kommo обязателен' },
            { status: 400 }
          )
        }
        testUrl = `https://${domain}/api/v4/account`
        headers = {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
        break

      case 'zoho':
        testUrl = 'https://www.zohoapis.com/crm/v2/settings/modules'
        headers = {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        }
        break

      case 'bitrix24':
        testUrl = 'https://your-portal.bitrix24.ru/rest/1/access_token/user.get'
        headers = {
          'Content-Type': 'application/json'
        }
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Неподдерживаемый тип CRM' },
          { status: 400 }
        )
    }

    // Тестируем токен
    const response = await fetch(testUrl, {
      method: 'GET',
      headers
    })

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Токен валиден, подключение успешно'
      })
    } else {
      const errorText = await response.text()
      return NextResponse.json(
        { success: false, error: `Неверный токен: ${response.status} ${errorText}` },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Token test error:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при проверке токена' },
      { status: 500 }
    )
  }
}
