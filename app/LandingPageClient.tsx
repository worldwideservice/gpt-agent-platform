'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  Bot, 
  Brain, 
  Database, 
  MessageSquare, 
  BarChart3, 
  Workflow,
  ArrowRight,
  Sparkles
} from 'lucide-react'

import { Button } from '@/components/ui'
import { Logo } from '@/components/ui/Logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { Badge } from '@/components/ui'

export function LandingPageClient() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    // If user is authenticated, redirect to /manage/[tenantId]
    if (status === 'authenticated' && session?.user) {
      console.log('User authenticated, getting tenant-id...')
      
      // Получаем tenant-id через API
      fetch('/api/auth/get-tenant-redirect')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.tenantId) {
            console.log('Tenant-id received, redirecting to /manage/' + data.tenantId)
            router.replace(`/manage/${data.tenantId}`)
          } else {
            // Если не удалось получить tenant-id, редиректим на вход
            console.log('No tenant-id, redirecting to /login')
            router.replace('/login')
          }
        })
        .catch(error => {
          console.error('Error getting tenant-id:', error)
          router.replace('/login')
        })
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Logo showTagline className="mb-4" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Section */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo href="/" />
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Возможности
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Как это работает
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Тарифы
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Войти</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Начать бесплатно</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto space-y-6 py-20 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <Badge variant="secondary" className="mb-2">
            <Sparkles className="mr-2 h-3 w-3" />
            Create and Automate
          </Badge>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
            Создавайте и автоматизируйте
            <br />
            <span className="text-[#E63946]">с AI-агентами</span>
          </h1>
          <p className="max-w-[750px] text-lg text-gray-600 sm:text-xl">
            T11 — это платформа для создания умных виртуальных сотрудников, 
            которые автоматизируют общение с клиентами, обработку сделок и 
            выполнение задач через интеграцию с CRM системами.
          </p>
          <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
            <Link href="/register">
              <Button size="lg" className="text-base">
                Начать бесплатно
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-base">
                Войти в аккаунт
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Уже есть аккаунт?</span>
            <Link href="/login" className="font-medium text-[#E63946] hover:underline">
              Войти
            </Link>
            <span>или</span>
            <Link href="/reset-password/request" className="font-medium text-[#E63946] hover:underline">
              восстановить пароль
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto space-y-6 py-8 md:py-12 lg:py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
            Всё что нужно для работы с AI-агентами
          </h2>
          <p className="max-w-[85%] leading-normal text-gray-600 sm:text-lg sm:leading-7">
            Мощная платформа с полным набором инструментов для создания, обучения и управления AI-агентами
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-4 h-10 w-10 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-[#FF6B35]" />
              </div>
              <CardTitle>Умные AI-агенты</CardTitle>
              <CardDescription>
                Создавайте и настраивайте AI-агентов с помощью передовых моделей ИИ. 
                Выбирайте из 100+ моделей, включая GPT-4o, Claude и другие.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="mb-4 h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Обучение и база знаний</CardTitle>
              <CardDescription>
                Обучайте агентов загружая файлы, создавая статьи и категории. 
                Автоматическая индексация и векторный поиск для точных ответов.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="mb-4 h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Workflow className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Автоматизация</CardTitle>
              <CardDescription>
                Настраивайте триггеры, правила и последовательности действий. 
                Автоматизируйте работу с клиентами и сделками в CRM.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="mb-4 h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Интеграция с CRM</CardTitle>
              <CardDescription>
                Подключайте Kommo CRM и другие системы. Синхронизация данных, 
                автоматические действия и работа с воронками продаж.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="mb-4 h-10 w-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle>Мультиканальность</CardTitle>
              <CardDescription>
                Работайте с клиентами через Email, WhatsApp, Telegram и другие каналы. 
                Единый интерфейс для всех коммуникаций.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="mb-4 h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Аналитика и мониторинг</CardTitle>
              <CardDescription>
                Отслеживайте метрики работы агентов, анализируйте производительность 
                и оптимизируйте процессы с помощью детальной аналитики.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="container mx-auto space-y-6 py-8 md:py-12 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
            Как это работает
          </h2>
          <p className="max-w-[85%] leading-normal text-gray-600 sm:text-lg sm:leading-7">
            Три простых шага для начала работы
          </p>
        </div>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FF6B35] text-white">
                <span className="text-xl font-bold">1</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Создайте агента</h3>
                <p className="text-gray-600">
                  Зарегистрируйтесь и создайте своего первого AI-агента. 
                  Настройте базовые параметры и инструкции.
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FF6B35] text-white">
                <span className="text-xl font-bold">2</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Обучите агента</h3>
                <p className="text-gray-600">
                  Загрузите файлы, создайте базу знаний и настройте работу агента. 
                  Интегрируйте с вашей CRM системой.
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FF6B35] text-white">
                <span className="text-xl font-bold">3</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Автоматизируйте</h3>
                <p className="text-gray-600">
                  Настройте автоматизацию и наблюдайте, как агент работает с клиентами 
                  и обрабатывает задачи в реальном времени.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto space-y-6 py-8 md:py-12 lg:py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="text-4xl font-bold text-[#E63946]">100+</div>
              <div className="text-gray-600">Моделей ИИ</div>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="text-4xl font-bold text-[#E63946]">24/7</div>
              <div className="text-gray-600">Работа агентов</div>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="text-4xl font-bold text-[#E63946]">∞</div>
              <div className="text-gray-600">Масштабируемость</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto space-y-6 py-8 md:py-12 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
            Готовы начать автоматизацию?
          </h2>
          <p className="max-w-[85%] leading-normal text-gray-600 sm:text-lg sm:leading-7">
            Присоединяйтесь к T11 и создайте своего первого AI-агента уже сегодня. 
            Бесплатная регистрация, без кредитной карты.
          </p>
          <div className="flex w-full items-center justify-center space-x-4 py-4">
            <Link href="/register">
              <Button size="lg" className="text-base">
                Начать бесплатно
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-base">
                Войти в аккаунт
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Уже есть аккаунт?</span>
            <Link href="/login" className="font-medium text-[#E63946] hover:underline">
              Войти
            </Link>
            <span>или</span>
            <Link href="/reset-password/request" className="font-medium text-[#E63946] hover:underline">
              восстановить пароль
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:gap-16">
            <div className="flex flex-col gap-4 md:max-w-xs">
              <Logo />
              <p className="text-sm text-gray-600">
                Create and Automate — Платформа для создания и автоматизации работы с AI-агентами
              </p>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-medium">Продукт</h4>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900">
                      Возможности
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
                      Тарифы
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-medium">Аккаунт</h4>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                      Войти
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="text-sm text-gray-600 hover:text-gray-900">
                      Регистрация
                    </Link>
                  </li>
                  <li>
                    <Link href="/reset-password/request" className="text-sm text-gray-600 hover:text-gray-900">
                      Восстановить пароль
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-medium">Поддержка</h4>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link href="/support" className="text-sm text-gray-600 hover:text-gray-900">
                      Помощь
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs" className="text-sm text-gray-600 hover:text-gray-900">
                      Документация
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-8">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} T11 Platform. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
