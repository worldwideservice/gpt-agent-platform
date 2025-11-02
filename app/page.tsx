import Link from 'next/link'
import { ArrowRight, Bot, MessageSquare, Shield, Zap } from 'lucide-react'

import { KwidButton } from '@/components/kwid'

// Force dynamic rendering for landing page
export const dynamic = 'force-dynamic'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-slate-900">GPT Agent</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900">
                Тарифы
              </Link>
              <Link href="/support" className="text-sm text-slate-600 hover:text-slate-900">
                Поддержка
              </Link>
              <Link href="/demo" className="text-sm text-slate-600 hover:text-slate-900">
                Демо
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <KwidButton variant="outline" size="sm">
                  Войти
                </KwidButton>
              </Link>
              <Link href="/register">
                <KwidButton variant="primary" size="sm" className="gap-2">
                  Начать <ArrowRight className="h-4 w-4" />
                </KwidButton>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Обучаемый виртуальный{' '}
              <span className="text-primary-600">сотрудник</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              Автоматизируйте общение с клиентами с помощью ИИ-агентов.
              Обучайте их на ваших данных и интегрируйте с CRM-системами.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/register">
                <KwidButton variant="primary" size="lg" className="gap-2">
                  Начать бесплатно <ArrowRight className="h-5 w-5" />
                </KwidButton>
              </Link>
              <Link href="/demo">
                <KwidButton variant="outline" size="lg">
                  Посмотреть демо
                </KwidButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">
              Почему выбирают GPT Agent?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Современная платформа для создания и управления ИИ-агентами
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Bot className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                Умные агенты
              </h3>
              <p className="mt-2 text-slate-600">
                Создавайте агентов с индивидуальными инструкциями и базой знаний
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <MessageSquare className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                CRM интеграция
              </h3>
              <p className="mt-2 text-slate-600">
                Автоматическая синхронизация с Kommo CRM и другими системами
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Zap className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                Быстрые ответы
              </h3>
              <p className="mt-2 text-slate-600">
                Мгновенные ответы на запросы клиентов 24/7
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                Безопасность
              </h3>
              <p className="mt-2 text-slate-600">
                Ваши данные защищены современными технологиями шифрования
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Готовы автоматизировать общение с клиентами?
            </h2>
            <p className="mt-4 text-xl text-primary-100">
              Начните с бесплатного плана и убедитесь в преимуществах ИИ-агентов
            </p>
            <div className="mt-10">
              <Link href="/register">
                <KwidButton size="lg" variant="secondary" className="gap-2">
                  Создать аккаунт <ArrowRight className="h-5 w-5" />
                </KwidButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-primary-600" />
              <span className="font-semibold text-slate-900">GPT Agent</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2025 GPT Agent. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
