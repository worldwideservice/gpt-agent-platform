'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card'

export default function TestKommoPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runKommoTest = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const response = await fetch('/api/test-kommo')
      const data = await response.json()

      if (data.success) {
        setTestResult(data)
      } else {
        setError(data.error || 'Неизвестная ошибка')
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при выполнении запроса')
    } finally {
      setLoading(false)
    }
  }

  const testEmailAction = async () => {
    setLoading(true)
    setError(null)

    try {
      // Тест отправки email через сделку
      const testData = {
        leadId: 1, // нужно указать реальный ID сделки
        action: {
          type: 'kommo_action',
          confidence: 0.9,
          reason: 'Тест отправки email',
          kommoAction: {
            type: 'send_email',
            data: {
              to: ['test@example.com'],
              subject: 'Тестовое письмо от AI агента',
              html: '<h1>Привет!</h1><p>Это тестовое письмо от AI агента GPT Agent Platform.</p>',
              text: 'Привет! Это тестовое письмо от AI агента.',
            },
            entityId: 1,
            entityType: 'leads',
          },
        },
      }

      // Здесь можно добавить вызов API для тестирования действий
      setTestResult({ message: 'Тест email действия подготовлен', data: testData })
    } catch (err: any) {
      setError(err.message || 'Ошибка при тестировании email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Тестирование Kommo API</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Тест подключения */}
          <Card>
            <CardHeader>
              <CardTitle>Тест подключения</CardTitle>
              <CardDescription>
                Проверка работы API Kommo с реальными ключами
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={runKommoTest}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Тестирование...' : 'Запустить тест'}
              </Button>
            </CardContent>
          </Card>

          {/* Тест действий */}
          <Card>
            <CardHeader>
              <CardTitle>Тест действий агента</CardTitle>
              <CardDescription>
                Проверка отправки email через сделку
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={testEmailAction}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Тест email действия
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Результаты */}
        {error && (
          <Card className="mt-6 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Ошибка</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {testResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-green-600">Результат теста</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Информация о ключах */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Информация о ключах</CardTitle>
            <CardDescription>
              Текущие настройки интеграции Kommo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <strong>Client ID:</strong> 2a5c1463-43dd-4ccc-abd0-79516f785e57
            </div>
            <div>
              <strong>API Domain:</strong> api-c.kommo.com
            </div>
            <div>
              <strong>Scopes:</strong> crm, files, notifications
            </div>
            <div>
              <strong>Base Domain:</strong> kommo.com
            </div>
            <div>
              <strong>Account ID:</strong> 34210307
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
