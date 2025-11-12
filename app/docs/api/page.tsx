import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Logo } from '@/components/ui/Logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui'
import { Code, Key, ArrowRight, Terminal, FileCode } from 'lucide-react'

export const metadata: Metadata = {
  title: 'API документация — TON 18',
  description: 'Документация по работе с API платформы TON 18',
}

export default function ApiPage() {
  const endpoints = [
    {
      method: 'POST',
      path: '/api/agents',
      description: 'Создание нового агента',
      auth: 'Требуется',
    },
    {
      method: 'GET',
      path: '/api/agents',
      description: 'Получение списка агентов',
      auth: 'Требуется',
    },
    {
      method: 'GET',
      path: '/api/agents/{id}',
      description: 'Получение информации об агенте',
      auth: 'Требуется',
    },
    {
      method: 'POST',
      path: '/api/chat',
      description: 'Отправка сообщения агенту',
      auth: 'Требуется',
    },
    {
      method: 'GET',
      path: '/api/knowledge-base',
      description: 'Получение базы знаний',
      auth: 'Требуется',
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <PublicHeader showNav={true} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Code className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            API документация
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Полная документация по работе с REST API платформы TON 18 для интеграции с вашими приложениями
          </p>
        </div>

        {/* Authentication */}
        <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Key className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-xl">Аутентификация</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Все API запросы требуют аутентификации через Bearer токен:
            </p>
            <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-100 overflow-x-auto">
              <div className="text-green-400">Authorization: Bearer YOUR_API_TOKEN</div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Получить API токен можно в разделе настроек вашего аккаунта
            </p>
          </CardContent>
        </Card>

        {/* Base URL */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Terminal className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Базовый URL</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Базовый URL для API запросов необходимо уточнить у службы поддержки.
            </p>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Для получения актуального базового URL и настройки интеграции, пожалуйста, обратитесь в{' '}
                <Link href="/support" className="underline hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                  службу поддержки
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
            Основные endpoints
          </h2>
          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded text-sm font-semibold ${
                          endpoint.method === 'GET' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-lg font-mono text-gray-900 dark:text-gray-100">
                          {endpoint.path}
                        </code>
                      </div>
                      <CardDescription className="text-base mt-2">
                        {endpoint.description}
                      </CardDescription>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        endpoint.auth === 'Требуется'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {endpoint.auth}
                      </span>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Example */}
        <Card className="mb-16">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileCode className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Пример запроса</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Пример создания нового агента:
            </p>
            <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-100 overflow-x-auto">
              <div className="text-gray-400">{'// POST /api/agents'}</div>
              <div className="mt-2">
                <div className="text-purple-400">curl</div>
                <div className="text-blue-400"> -X POST</div>
                <div className="text-green-400"> {`{BASE_URL}`}/api/agents</div>
                <div className="text-yellow-400">{' -H "Authorization: Bearer YOUR_TOKEN"'}</div>
                <div className="text-yellow-400">{' -H "Content-Type: application/json"'}</div>
                <div className="text-blue-400"> -d</div>
                <div className="text-gray-300">{` '{`}</div>
                <div className="text-gray-300 ml-4">{'  "name": "Мой агент",'}</div>
                <div className="text-gray-300 ml-4">{'  "description": "Описание агента",'}</div>
                <div className="text-gray-300 ml-4">{'  "model": "gpt-4o"'}</div>
                <div className="text-gray-300">{' } \''}</div>
              </div>
              <div className="text-gray-500 text-xs mt-3">
                * Замените {`{BASE_URL}`} на актуальный базовый URL, полученный у поддержки
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800 mb-16">
          <CardHeader>
            <CardTitle className="text-xl">Лимиты запросов</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Бесплатный план: 100 запросов в час</li>
              <li>• Базовый план: 1000 запросов в час</li>
              <li>• Профессиональный план: 10000 запросов в час</li>
              <li>• Enterprise: без ограничений</li>
            </ul>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Link href="/docs/integrations">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Интеграции
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="ghost" className="w-full sm:w-auto">
              Вернуться к документации
            </Button>
          </Link>
          <Link href="/docs/examples">
            <Button variant="outline" className="w-full sm:w-auto">
              Примеры использования
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-950 transition-colors mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-4 lg:col-span-3 flex flex-col">
              <div className="mb-5">
                <Logo showTagline />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed mt-2">
                create infinity — Платформа для создания и автоматизации работы с AI-агентами
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 md:col-span-8 lg:col-span-9 sm:grid-cols-3 lg:grid-cols-4">
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Продукт</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link href="/#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Возможности
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Тарифы
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Аккаунт</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Войти
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Зарегистрироваться
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Поддержка</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link href="/support" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Помощь
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Документация
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} TON 18. Все права защищены.
              </p>
              <div className="flex gap-6">
                <Link href="/privacy" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Политика конфиденциальности
                </Link>
                <Link href="/terms" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Условия использования
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
