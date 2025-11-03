'use client'

import { useState } from 'react'
import { Bug, Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { Card } from '@/components/ui/Card'

interface APITestResult {
  endpoint: string
  success: boolean
  status: number
  data?: any
  error?: string
  responseTime: number
}

export const KommoAPIDebugger = () => {
  const [accessToken, setAccessToken] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [results, setResults] = useState<APITestResult[]>([])
  const [overallStatus, setOverallStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const testEndpoints = [
    { name: 'Account Info', endpoint: '/account' },
    { name: 'Pipelines', endpoint: '/leads/pipelines' },
    { name: 'Contacts', endpoint: '/contacts' },
    { name: 'Leads', endpoint: '/leads' },
    { name: 'Tasks', endpoint: '/tasks' }
  ]

  const testAPIEndpoint = async (endpoint: string): Promise<APITestResult> => {
    const startTime = Date.now()
    
    try {
      const response = await fetch(`https://kommo.com/api/v4${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      const responseTime = Date.now() - startTime
      const data = await response.json()

      return {
        endpoint,
        success: response.ok,
        status: response.status,
        data: response.ok ? data : null,
        error: response.ok ? null : data.message || `HTTP ${response.status}`,
        responseTime
      }
    } catch (error) {
      return {
        endpoint,
        success: false,
        status: 0,
        error: error instanceof Error ? error.message : 'Network error',
        responseTime: Date.now() - startTime
      }
    }
  }

  const runAllTests = async () => {
    if (!accessToken.trim()) {
      alert('Введите токен доступа')
      return
    }

    setIsTesting(true)
    setResults([])
    setOverallStatus('idle')

    const testResults: APITestResult[] = []

    for (const test of testEndpoints) {
      const result = await testAPIEndpoint(test.endpoint)
      testResults.push(result)
      setResults([...testResults])
      
      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    const allSuccessful = testResults.every(r => r.success)
    setOverallStatus(allSuccessful ? 'success' : 'error')
    setIsTesting(false)
  }

  const getStatusIcon = (result: APITestResult) => {
    if (result.success) {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    } else if (result.status === 401) {
      return <AlertCircle className="w-4 h-4 text-red-500" />
    } else {
      return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusColor = (result: APITestResult) => {
    if (result.success) {
      return 'bg-green-50 border-green-200'
    } else if (result.status === 401) {
      return 'bg-red-50 border-red-200'
    } else {
      return 'bg-yellow-50 border-yellow-200'
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center space-x-2">
        <Bug className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">API Kommo</h3>
      </div>

      <div className="space-y-4">
        {/* Токен ввода */}
        <div className="flex space-x-2">
          <Input
            type="password"
            placeholder="Введите токен доступа"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={runAllTests}
            disabled={isTesting || !accessToken.trim()}
            variant="default"
            className="gap-2"
          >
            {isTesting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Тестирование...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Запустить тесты
              </>
            )}
          </Button>
        </div>

        {/* Общий статус */}
        {overallStatus !== 'idle' && (
          <div className={`rounded-lg border p-4 ${
            overallStatus === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              {overallStatus === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-medium">
                {overallStatus === 'success' 
                  ? 'Все API endpoints работают корректно' 
                  : 'Обнаружены проблемы с API'
                }
              </span>
            </div>
          </div>
        )}

        {/* Результаты тестов */}
        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Результаты тестирования:</h4>
            {results.map((result, index) => (
              <div 
                key={index}
                className={`rounded-lg border p-3 ${getStatusColor(result)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(result)}
                    <span className="text-sm font-medium">
                      {testEndpoints.find(t => t.endpoint === result.endpoint)?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {result.endpoint}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {result.responseTime}ms
                  </div>
                </div>
                
                {result.error && (
                  <div className="mt-2 text-sm text-red-600">
                    Ошибка: {result.error}
                  </div>
                )}
                
                {result.success && result.data && (
                  <div className="mt-2 text-sm text-green-600">
                    ✅ Успешно: {JSON.stringify(result.data).substring(0, 100)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Инструкции */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h4 className="mb-2 text-sm font-medium text-blue-900">Как получить токен:</h4>
          <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800">
            <li>Войдите в Kommo CRM</li>
            <li>Настройки → Интеграции → API</li>
            <li>Создайте приложение или используйте существующее</li>
            <li>Скопируйте Access Token</li>
            <li>Вставьте токен выше и запустите тесты</li>
          </ol>
        </div>
      </div>
    </Card>
  )
}
