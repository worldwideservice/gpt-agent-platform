import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Logo } from '@/components/ui/Logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui'
import { Lightbulb, MessageSquare, ShoppingCart, HeadphonesIcon, ArrowRight, Code } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Примеры использования — TON 18',
  description: 'Готовые примеры и кейсы использования AI-агентов на платформе TON 18',
}

export default function ExamplesPage() {
  const examples = [
    {
      icon: ShoppingCart,
      title: 'Агент по продажам',
      description: 'Автоматизация процесса продаж и работы с клиентами',
      useCases: [
        'Обработка входящих запросов о продуктах',
        'Квалификация лидов',
        'Предложение релевантных товаров',
        'Обработка возражений',
        'Создание сделок в CRM',
      ],
      color: 'from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-800',
    },
    {
      icon: HeadphonesIcon,
      title: 'Агент поддержки',
      description: 'Обработка обращений в службу поддержки',
      useCases: [
        'Ответы на частые вопросы',
        'Решение типовых проблем',
        'Эскалация сложных вопросов',
        'Сбор обратной связи',
        'Создание тикетов',
      ],
      color: 'from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800',
    },
    {
      icon: MessageSquare,
      title: 'Агент-консультант',
      description: 'Консультирование клиентов по продуктам и услугам',
      useCases: [
        'Консультации по выбору продукта',
        'Сравнение вариантов',
        'Расчет стоимости',
        'Бронирование и оформление',
        'Напоминания о встречах',
      ],
      color: 'from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800',
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <PublicHeader showNav={true} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Lightbulb className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Примеры использования
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Готовые примеры и кейсы использования AI-агентов для различных бизнес-задач
          </p>
        </div>

        {/* Examples */}
        <div className="space-y-8 mb-16">
          {examples.map((example, index) => {
            const Icon = example.icon
            return (
              <Card key={index} className={`hover:shadow-lg transition-shadow bg-gradient-to-br ${example.color}`}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{example.title}</CardTitle>
                      <CardDescription className="text-base">
                        {example.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Примеры применения:
                  </h4>
                  <ul className="space-y-2">
                    {example.useCases.map((useCase, useCaseIndex) => (
                      <li key={useCaseIndex} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                        <span className="text-primary mt-1">•</span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Implementation Tips */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800 mb-16">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Code className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              <CardTitle className="text-xl">Советы по реализации</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-amber-600 dark:text-amber-400 mt-1">✓</span>
                <span>Начните с простых сценариев и постепенно усложняйте</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 dark:text-amber-400 mt-1">✓</span>
                <span>Используйте базу знаний для обучения агента специфике вашего бизнеса</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 dark:text-amber-400 mt-1">✓</span>
                <span>Интегрируйте с CRM для автоматизации процессов</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 dark:text-amber-400 mt-1">✓</span>
                <span>Регулярно анализируйте метрики и оптимизируйте работу агента</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Готовы создать своего агента?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Начните с быстрого старта или изучите подробную документацию
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/docs/quick-start">
              <Button size="lg">
                Быстрый старт
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">
                Зарегистрироваться
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-950 transition-colors mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-5 lg:col-span-4 flex flex-col -ml-8 md:-ml-16 lg:-ml-24 pl-0">
              <div className="mb-5 scale-125 md:scale-150 origin-left">
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

