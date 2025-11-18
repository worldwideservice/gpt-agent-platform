// Force dynamic rendering to avoid prerender errors
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Logo } from '@/components/ui/Logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui'
import { Bot, Settings, Brain, MessageSquare, ArrowRight, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Настройка агентов — TON 18',
  description: 'Руководство по созданию и настройке AI-агентов на платформе TON 18',
}

export default function AgentsPage() {
  const sections = [
    {
      icon: Bot,
      title: 'Создание агента',
      description: 'Основы создания нового AI-агента',
      content: [
        'Перейдите в раздел "Агенты" в вашем личном кабинете',
        'Нажмите кнопку "Создать агента"',
        'Заполните основную информацию:',
        '  • Имя агента (например, "Помощник по продажам")',
        '  • Описание и назначение агента',
        '  • Категория (опционально)',
        'Выберите модель LLM из доступных (GPT-4o, Claude, Gemini и др.)',
        'Сохраните агента',
      ],
    },
    {
      icon: Brain,
      title: 'Настройка инструкций',
      description: 'Как правильно настроить поведение агента',
      content: [
        'Откройте созданного агента и перейдите в раздел "Инструкции"',
        'Опишите роль и задачи агента:',
        '  • Кто такой агент (роль, специализация)',
        '  • Как он должен общаться с клиентами',
        '  • Какие задачи он должен выполнять',
        '  • Стиль общения (формальный/неформальный)',
        'Используйте конкретные примеры для лучшего понимания',
        'Сохраните инструкции',
      ],
    },
    {
      icon: MessageSquare,
      title: 'Каналы коммуникации',
      description: 'Настройка каналов для работы агента',
      content: [
        'Перейдите в раздел "Каналы" в настройках агента',
        'Выберите каналы, через которые будет работать агент:',
        '  • Email',
        '  • WhatsApp',
        '  • Telegram',
        '  • Веб-чат',
        'Настройте параметры для каждого канала',
        'Активируйте нужные каналы',
      ],
    },
    {
      icon: Settings,
      title: 'Дополнительные настройки',
      description: 'Продвинутые параметры конфигурации',
      content: [
        'Температура модели: контролирует креативность ответов (0-1)',
        'Максимальная длина ответа: ограничение на размер ответа',
        'Контекстное окно: количество предыдущих сообщений для анализа',
        'Автоматические действия: настройка триггеров и правил',
        'Интеграции: подключение CRM и других систем',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <PublicHeader showNav={true} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Настройка агентов
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Полное руководство по созданию, настройке и оптимизации AI-агентов на платформе TON 18
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 mb-16">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{section.title}</CardTitle>
                      <CardDescription className="text-base">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tips */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 mb-16">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-xl">Советы по настройке</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span>Начинайте с простых инструкций и постепенно усложняйте</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span>Тестируйте агента на реальных сценариях перед запуском</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span>Используйте базу знаний для улучшения точности ответов</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span>Регулярно обновляйте инструкции на основе обратной связи</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Link href="/docs/knowledge-base">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              База знаний
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="ghost" className="w-full sm:w-auto">
              Вернуться к документации
            </Button>
          </Link>
          <Link href="/docs/integrations">
            <Button variant="outline" className="w-full sm:w-auto">
              Интеграции
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

