'use client'

import { useState } from 'react'
import { ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface KommoSetupProps {
  onConnectionEstablished: (connection: any) => void
  onError: (error: string) => void
}

export const KommoSetup = ({ onConnectionEstablished, onError }: KommoSetupProps) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [testToken, setTestToken] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleOAuthConnect = async () => {
    setIsConnecting(true)
    try {
      const response = await fetch('/api/crm/kommo/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirectUri: `${window.location.origin}/api/crm/kommo/callback`
        })
      })

      if (!response.ok) {
        throw new Error('Failed to initiate OAuth')
      }

      const { authUrl } = await response.json()
      
      // Открываем OAuth в новом окне
      const popup = window.open(
        authUrl,
        'kommo-oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      )

      // Слушаем сообщения от popup окна
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === 'kommo-oauth-success') {
          onConnectionEstablished(event.data.connection)
          popup?.close()
          window.removeEventListener('message', messageListener)
        } else if (event.data.type === 'kommo-oauth-error') {
          onError(event.data.error)
          popup?.close()
          window.removeEventListener('message', messageListener)
        }
      }

      window.addEventListener('message', messageListener)

      // Проверяем, не закрыл ли пользователь popup
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          setIsConnecting(false)
          clearInterval(checkClosed)
          window.removeEventListener('message', messageListener)
        }
      }, 1000)

    } catch (error) {
      onError(`Ошибка подключения: ${error}`)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleTestToken = async () => {
    if (!testToken.trim()) {
      setTestResult({ success: false, message: 'Введите токен доступа' })
      return
    }

    setIsTesting(true)
    setTestResult(null)

    try {
      const response = await fetch(`/api/crm/kommo/sync?access_token=${encodeURIComponent(testToken)}`)
      const data = await response.json()

      if (data.success) {
        setTestResult({ 
          success: true, 
          message: `Подключение успешно! Найдено ${data.data.pipelines.length} воронок.` 
        })
        
        // Создаем соединение на основе тестового токена
        const connection = {
          id: Date.now().toString(),
          crmType: 'kommo',
          isConnected: true,
          accessToken: testToken,
          lastSyncAt: new Date(),
          config: {
            id: 'kommo',
            name: 'Kommo CRM',
            logo: '/logos/kommo.svg',
            description: 'Kommo CRM подключена',
            authType: 'oauth2',
            baseUrl: 'https://kommo.com/api/v4',
            scopes: ['crm:read', 'crm:write'],
            fields: []
          }
        }
        
        onConnectionEstablished(connection)
      } else {
        setTestResult({ success: false, message: data.error || 'Ошибка подключения' })
      }
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: `Ошибка тестирования: ${error}` 
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-600">K</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Kommo CRM</h3>
            <p className="text-sm text-gray-500">Подключение через OAuth 2.0</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Способ подключения:</h4>
            <div className="space-y-3">
              {/* OAuth подключение */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">OAuth 2.0 (Рекомендуется)</h5>
                    <p className="text-sm text-gray-500">
                      Безопасное подключение через официальный OAuth flow
                    </p>
                  </div>
                  <Button 
                    onClick={handleOAuthConnect}
                    disabled={isConnecting}
                    className="min-w-[120px]"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Подключение...
                      </>
                    ) : (
                      <>
                        Подключить
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Тестовое подключение */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-gray-900">Тестовое подключение</h5>
                    <p className="text-sm text-gray-500">
                      Для тестирования с токеном доступа
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input
                      type="password"
                      placeholder="Введите токен доступа Kommo"
                      value={testToken}
                      onChange={(e) => setTestToken(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleTestToken}
                      disabled={isTesting || !testToken.trim()}
                      variant="outline"
                    >
                      {isTesting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Тест'
                      )}
                    </Button>
                  </div>

                  {testResult && (
                    <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                      testResult.success 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {testResult.success ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      <span className="text-sm">{testResult.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Как получить токен доступа:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Войдите в ваш аккаунт Kommo CRM</li>
              <li>Перейдите в Настройки → Интеграции → API</li>
              <li>Создайте новое приложение или используйте существующее</li>
              <li>Скопируйте токен доступа</li>
              <li>Вставьте токен в поле выше и нажмите "Тест"</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  )
}
