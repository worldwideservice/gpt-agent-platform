import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Logo } from '@/components/ui/Logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { BookOpen, Code, Zap, Settings, Database, MessageSquare, FileText, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Документация — TON 18',
  description: 'Полная документация по использованию платформы TON 18',
}

export default function DocsPage() {
  const docsSections = [
    {
      icon: Zap,
      title: 'Быстрый старт',
      description: 'Начните работу с платформой за 5 минут',
      href: '/docs/quick-start',
      color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    },
    {
      icon: Settings,
      title: 'Настройка агентов',
      description: 'Создание и настройка AI-агентов',
      href: '/docs/agents',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      icon: Database,
      title: 'База знаний',
      description: 'Работа с базой знаний и обучение агентов',
      href: '/docs/knowledge-base',
      color: 'bg-green-500/10 text-green-600 dark:text-green-400',
    },
    {
      icon: MessageSquare,
      title: 'Интеграции',
      description: 'Подключение CRM и других систем',
      href: '/docs/integrations',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    {
      icon: Code,
      title: 'API документация',
      description: 'Работа с API платформы',
      href: '/docs/api',
      color: 'bg-red-500/10 text-red-600 dark:text-red-400',
    },
    {
      icon: FileText,
      title: 'Примеры использования',
      description: 'Готовые примеры и кейсы',
      href: '/docs/examples',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <PublicHeader showNav={true} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Документация
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Полное руководство по использованию платформы TON 18. Найдите ответы на все вопросы и изучите все возможности.
          </p>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {docsSections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.href} href={section.href}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {section.title}
                    </CardTitle>
                    <CardDescription>
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                      Читать далее
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Quick Links */}
        <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
            Популярные разделы
          </h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <Link href="/docs/quick-start" className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-gray-900 dark:text-gray-100">Быстрый старт</span>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
            <Link href="/docs/agents" className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-gray-900 dark:text-gray-100">Создание агентов</span>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
            <Link href="/docs/integrations" className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-gray-900 dark:text-gray-100">Интеграция с CRM</span>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
            <Link href="/docs/api" className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-gray-900 dark:text-gray-100">API документация</span>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </section>

        {/* Getting Started CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Готовы начать?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Зарегистрируйтесь и начните создавать своих AI-агентов уже сегодня
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Начать бесплатно
              </button>
            </Link>
            <Link href="/support">
              <button className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-gray-900 dark:text-gray-100">
                Связаться с поддержкой
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-950 transition-colors mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
            {/* Логотип и описание */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col -ml-8 md:-ml-16 lg:-ml-24 pl-0">
              <div className="mb-5 scale-125 md:scale-150 origin-left">
                <Logo showTagline />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed mt-2">
                create infinity — Платформа для создания и автоматизации работы с AI-агентами
              </p>
            </div>
            
            {/* Навигация */}
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
                  <li>
                    <Link href="/reset-password/request" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Восстановить пароль
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
          
          {/* Разделитель и копирайт */}
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

