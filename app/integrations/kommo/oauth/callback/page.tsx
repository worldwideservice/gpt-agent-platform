'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface TokenResponse {
  success: boolean
  error?: string
  access_token?: string
  refresh_token?: string
  expires_in?: number
  base_domain?: string
  account_id?: number
}

export default function KommoOAuthCallback() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [tokens, setTokens] = useState<TokenResponse | null>(null)

  useEffect(() => {
    const processOAuthCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const error = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      // Проверяем на ошибки от Kommo
      if (error) {
        setStatus('error')
        setMessage(`Ошибка авторизации: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`)
        return
      }

      // Проверяем наличие кода
      if (!code) {
        setStatus('error')
        setMessage('Authorization code не найден в URL')
        return
      }

      if (!state) {
        setStatus('error')
        setMessage('State параметр отсутствует')
        return
      }

      setMessage('Обмениваем authorization code на токены...')

      try {
        // Отправляем код на backend для обработки
        const response = await fetch('/api/integrations/kommo/oauth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            state,
            provider: 'kommo',
          }),
        })

        const data: TokenResponse = await response.json()

        if (response.ok && data.success) {
          setStatus('success')
          setTokens(data)
          setMessage('✅ Токены успешно получены!')

          // Показываем инструкции по использованию токенов
          setTimeout(() => {
            setMessage(`
🎉 Интеграция Kommo настроена!

Теперь обновите ваш .env.local файл:

KOMMO_TEST_ACCESS_TOKEN=${data.access_token}
KOMMO_TEST_REFRESH_TOKEN=${data.refresh_token || ''}

И протестируйте:
npx tsx test-kommo.ts
            `)
          }, 2000)
        } else {
          setStatus('error')
          setMessage(`Ошибка обработки токенов: ${data.error || 'Неизвестная ошибка'}`)
        }
      } catch (error) {
        setStatus('error')
        setMessage(`Ошибка сети: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
      }
    }

    processOAuthCallback()
  }, [searchParams])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Скопировано в буфер обмена!')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🔑 Kommo OAuth Callback
          </h1>
          <p className="text-gray-600">
            Обработка авторизации Kommo CRM
          </p>
        </div>

        <div className="space-y-6">
          {/* Статус */}
          <div className={`p-4 rounded-lg ${
            status === 'loading' ? 'bg-blue-50 border-blue-200' :
            status === 'success' ? 'bg-green-50 border-green-200' :
            'bg-red-50 border-red-200'
          } border`}>
            <div className="flex items-center">
              {status === 'loading' && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              )}
              {status === 'success' && (
                <svg className="h-5 w-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {status === 'error' && (
                <svg className="h-5 w-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <div className="flex-1">
                <p className={`font-medium ${
                  status === 'loading' ? 'text-blue-800' :
                  status === 'success' ? 'text-green-800' :
                  'text-red-800'
                }`}>
                  {status === 'loading' && 'Обработка...'}
                  {status === 'success' && 'Успешно!'}
                  {status === 'error' && 'Ошибка'}
                </p>
              </div>
            </div>
          </div>

          {/* Сообщение */}
          {message && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {message}
              </pre>
            </div>
          )}

          {/* Токены */}
          {tokens && tokens.access_token && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Полученные токены:</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Token
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={tokens.access_token}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(tokens.access_token!)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    📋
                  </button>
                </div>
              </div>

              {tokens.refresh_token && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Refresh Token
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={tokens.refresh_token}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(tokens.refresh_token!)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">📝 Добавьте в .env.local:</h4>
                <div className="bg-white p-3 rounded border font-mono text-sm">
                  <div onClick={() => copyToClipboard(`KOMMO_TEST_ACCESS_TOKEN=${tokens.access_token}\nKOMMO_TEST_REFRESH_TOKEN=${tokens.refresh_token || ''}`)} className="cursor-pointer hover:bg-gray-50">
                    KOMMO_TEST_ACCESS_TOKEN={tokens.access_token}<br/>
                    KOMMO_TEST_REFRESH_TOKEN={tokens.refresh_token || ''}
                  </div>
                </div>
                <p className="text-xs text-blue-700 mt-2 cursor-pointer" onClick={() => copyToClipboard(`KOMMO_TEST_ACCESS_TOKEN=${tokens.access_token}\nKOMMO_TEST_REFRESH_TOKEN=${tokens.refresh_token || ''}`)}>
                  👆 Нажмите для копирования
                </p>
              </div>
            </div>
          )}

          {/* Действия */}
          <div className="flex space-x-4">
            {status === 'success' && (
              <button
                onClick={() => router.push('/integrations')}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Перейти к интеграциям
              </button>
            )}

            {status === 'error' && (
              <button
                onClick={() => window.history.back()}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Назад
              </button>
            )}

            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
