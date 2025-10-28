import { NextRequest, NextResponse } from 'next/server'

// OAuth callback для обработки ответа от CRM
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Ошибка авторизации</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .error { color: #e74c3c; }
            .success { color: #27ae60; }
          </style>
        </head>
        <body>
          <h1 class="error">Ошибка авторизации</h1>
          <p>${error}</p>
          <button onclick="window.close()">Закрыть</button>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })
    }

    if (!code) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Ошибка авторизации</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .error { color: #e74c3c; }
          </style>
        </head>
        <body>
          <h1 class="error">Ошибка авторизации</h1>
          <p>Код авторизации не получен</p>
          <button onclick="window.close()">Закрыть</button>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })
    }

    // Здесь должен быть обмен кода на токены через API CRM
    // Пока возвращаем mock токены
    const mockTokens = {
      accessToken: 'mock_access_token_' + Math.random().toString(36).substring(7),
      refreshToken: 'mock_refresh_token_' + Math.random().toString(36).substring(7),
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString() // 1 час
    }

    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Авторизация успешна</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .success { color: #27ae60; }
          .info { color: #3498db; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1 class="success">Авторизация успешна!</h1>
        <div class="info">
          <p>Access Token: ${mockTokens.accessToken}</p>
          <p>Refresh Token: ${mockTokens.refreshToken}</p>
          <p>Истекает: ${new Date(mockTokens.expiresAt).toLocaleString('ru-RU')}</p>
        </div>
        <button onclick="sendTokens()">Продолжить</button>
        
        <script>
          function sendTokens() {
            window.opener.postMessage({
              type: 'oauth-success',
              accessToken: '${mockTokens.accessToken}',
              refreshToken: '${mockTokens.refreshToken}',
              expiresAt: '${mockTokens.expiresAt}'
            }, window.location.origin);
            window.close();
          }
        </script>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })

  } catch (error) {
    console.error('OAuth callback error:', error)
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ошибка</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .error { color: #e74c3c; }
        </style>
      </head>
      <body>
        <h1 class="error">Произошла ошибка</h1>
        <p>Попробуйте еще раз</p>
        <button onclick="window.close()">Закрыть</button>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}
