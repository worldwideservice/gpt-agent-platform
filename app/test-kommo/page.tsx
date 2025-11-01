'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card'

type TestResult = Record<string, unknown>

export default function TestKommoPage() {
  const isProduction = process.env.NODE_ENV === 'production'
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusCode, setStatusCode] = useState<number | null>(null)

  const runKommoTest = async () => {
    if (isProduction) {
      setError('Тестовый endpoint отключен в production окружении.')
      return
    }

    setLoading(true)
    setError(null)
    setTestResult(null)
    setStatusCode(null)

    try {
      const response = await fetch('/api/test-kommo')
      const data = (await response.json()) as TestResult & { success?: boolean; error?: string }
      setStatusCode(response.status)

      if (!response.ok || data.success === false) {
        throw new Error(data.error || `Запрос завершился с кодом ${response.status}`)
      }

      setTestResult(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при выполнении запроса'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const testEmailAction = async () => {
    if (isProduction) {
      setError('Тестовые действия недоступны в production окружении.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const testData = {
        leadId: 1, // укажите ID тестовой сделки перед исполнением
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

      setTestResult({
        message: 'Тест email действия подготовлен. Настройте реальные данные перед отправкой.',
        data: testData,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при тестировании email'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Тестирование Kommo API</h1>

        {isProduction && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-700">Страница выключена</CardTitle>
              <CardDescription>
                Тестовый инструмент отключен в production окружении. Выполните настройку на стенде разработчика и
                установите переменную{' '}
                <code className="mx-1 rounded bg-amber-100 px-1 py-0.5 text-xs font-mono">KOMMO_TEST_ENABLED=1</code>,
                чтобы включить проверки.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Тест подключения</CardTitle>
              <CardDescription>Проверка работы API Kommo с реальными ключами</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={runKommoTest} disabled={loading} className="w-full">
                {loading ? 'Тестирование...' : 'Запустить тест'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Тест действий агента</CardTitle>
              <CardDescription>Проверка отправки email через сделку</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={testEmailAction} disabled={loading} variant="outline" className="w-full">
                Тест email действия
              </Button>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Card className="mt-6 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Ошибка</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
              {statusCode && <p className="text-sm text-muted-foreground">Код ответа сервера: {statusCode}</p>}
            </CardContent>
          </Card>
        )}

        {testResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-green-600">Результат теста</CardTitle>
            </CardHeader>
            <CardContent>
              {statusCode && (
                <p className="mb-4 text-sm text-muted-foreground">Код ответа сервера: {statusCode}</p>
              )}
              <pre className="max-h-[480px] overflow-auto rounded bg-gray-100 p-4 text-sm">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Информация о настройке</CardTitle>
            <CardDescription>Убедитесь, что заданы все необходимые переменные окружения</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              Добавьте переменные в файл{' '}
              <code className="mx-1 rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">.env.local</code> или настройте их
              на сервере:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">KOMMO_TEST_ENABLED=1</code>
              </li>
              <li>
                <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">KOMMO_TEST_DOMAIN</code>
              </li>
              <li>
                <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">KOMMO_TEST_CLIENT_ID</code>
              </li>
              <li>
                <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">KOMMO_TEST_CLIENT_SECRET</code>
              </li>
              <li>
                <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">KOMMO_TEST_REDIRECT_URI</code>
              </li>
              <li>
                <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">KOMMO_TEST_ACCESS_TOKEN</code>
              </li>
              <li>
                <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">KOMMO_TEST_REFRESH_TOKEN</code>{' '}
                (опционально)
              </li>
            </ul>
            <p className="text-muted-foreground">
              Не публикуйте реальные токены в клиентском коде. Храните чувствительные данные только в защищённых
              переменных окружения.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
