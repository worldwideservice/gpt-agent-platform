'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Bot, 
  Brain, 
  Database, 
  MessageSquare, 
  BarChart3, 
  Workflow,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@/components/ui'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Logo } from '@/components/ui/Logo'
import { useToast } from '@/components/ui/toast-context'
import { ScrollAnimation } from '@/components/ui/scroll-animation'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { GlassCard } from '@/components/ui/glass-card'
import { SkipLink } from '@/components/ui/skip-link'
import BlurText from '@/components/ui/BlurText'
import { AuroraBackground } from '@/components/ui/aurora-background'

export function LandingPageClient() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { push: toast } = useToast()

  const handleGoToApp = async () => {
    if (isRedirecting) return // Prevent double clicks

    if (status === 'authenticated' && session?.user) {
      setIsRedirecting(true)
      
      try {
        // Retry with exponential backoff for better reliability
        const { logger } = await import('@/lib/utils/logger')
        const { retry } = await import('@/lib/utils/retry')
        
        const data = await retry(
          async () => {
            const response = await fetch('/api/auth/get-tenant-redirect')
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            
            return response.json()
          },
          {
            maxAttempts: 3,
            initialDelay: 500,
            maxDelay: 2000,
            onRetry: (error, attempt, delay) => {
              logger.warn('[LandingPageClient] Retrying tenant redirect', {
                attempt,
                delay: `${delay}ms`,
                error: error instanceof Error ? error.message : String(error),
              })
            },
            shouldRetry: (error) => {
              // Don't retry on 401/403 - these are auth errors
              if (error instanceof Error && error.message.includes('401')) {
                return false
              }
              if (error instanceof Error && error.message.includes('403')) {
                return false
              }
              return true
            },
          }
        )
        
        if (data.success && data.tenantId) {
          // Используем window.location.href для гарантированного редиректа
          window.location.href = `/manage/${data.tenantId}`
        } else {
          toast({
            title: 'Ошибка',
            description: 'Не удалось получить доступ к приложению. Пожалуйста, войдите снова.',
            variant: 'error',
          })
          // Используем window.location.href для гарантированного редиректа
          window.location.href = '/login'
        }
      } catch (error) {
        const errorInstance = error instanceof Error ? error : new Error(String(error))
        
        // Import logger dynamically to avoid SSR issues
        const { logger } = await import('@/lib/utils/logger')
        logger.error('[LandingPageClient] Error getting tenant-id after retries', errorInstance, {
          userId: session?.user?.id,
          email: session?.user?.email,
        })
        
        toast({
          title: 'Ошибка подключения',
          description: 'Не удалось подключиться к серверу. Пожалуйста, попробуйте позже.',
          variant: 'error',
        })
        router.push('/login')
      } finally {
        setIsRedirecting(false)
      }
    } else {
      router.push('/login')
    }
  }

  // Show skeleton loader while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto flex h-20 md:h-24 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Logo href="/" />
            <div className="flex items-center gap-4">
              <div className="h-9 w-20 bg-gray-200 animate-pulse rounded" />
              <div className="h-9 w-32 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        </header>
        <div className="container mx-auto space-y-6 py-20 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-2" />
            <div className="h-12 w-full max-w-md bg-gray-200 animate-pulse rounded mb-4" />
            <div className="h-6 w-full max-w-2xl bg-gray-200 animate-pulse rounded mb-8" />
            <div className="flex gap-4">
              <div className="h-12 w-40 bg-gray-200 animate-pulse rounded" />
              <div className="h-12 w-40 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <SkipLink />
      {/* Navbar Section */}
      <PublicHeader showNav={true} />

      {/* Hero Section */}
      <section id="main-content" className="relative overflow-hidden" aria-label="Главная секция">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/50 to-pink-50 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,53,0.1),transparent_50%)] -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent_50%)] -z-10" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 -z-10" />
        
        <div className="container mx-auto space-y-6 py-20 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 relative">
          <ScrollAnimation direction="fade" delay={100}>
            <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
              <Badge variant="secondary" className="mb-2 animate-pulse">
                <Sparkles className="mr-2 h-3 w-3 animate-spin-slow" aria-hidden="true" />
                create infinity
              </Badge>
              <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Создавайте и автоматизируйте
                <br />
                <span className="bg-gradient-to-r from-[hsl(var(--brand-accent))] via-[hsl(var(--brand-accent-strong))] to-[hsl(var(--brand-accent))] bg-clip-text text-transparent animate-gradient">
                  с AI-агентами
                </span>
              </h1>
              <p className="max-w-[750px] text-lg text-gray-600 sm:text-xl">
                TON 18 — это приложение для создания умных виртуальных сотрудников, 
                которые автоматизируют общение с клиентами, обработку сделок и 
                выполнение задач через интеграцию с CRM системами.
              </p>
            </div>
          </ScrollAnimation>
          <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
            {status === 'authenticated' && session?.user ? (
              <>
                <Button 
                  size="lg" 
                  className="text-base"
                  onClick={handleGoToApp}
                  disabled={isRedirecting}
                >
                  {isRedirecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Переход на платформу...
                    </>
                  ) : (
                    <>
                      Перейти на платформу
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  className="group text-base transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                  asChild
                >
                  <Link href="/register" aria-label="Начать бесплатную регистрацию">
                    Начать бесплатно
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="group text-base hover:border-brand-accent hover:text-brand-accent"
                  asChild
                >
                  <Link href="/login" aria-label="Войти в аккаунт">
                    Войти в аккаунт
                  </Link>
                </Button>
              </>
            )}
          </div>
          <ScrollAnimation direction="up" delay={160}>
            <div className="relative mx-auto mt-8 max-w-5xl">
              <Image
                src="/brand/hero-illustration.svg"
                alt="Иллюстрация интерфейса TON 18 с панелями и графиками"
                width={640}
                height={480}
                priority
                className="w-full rounded-3xl border border-white/40 shadow-2xl ring-1 ring-brand-focus/10 dark:ring-brand-focus/20"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-brand-accent/10"
              />
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto space-y-6 py-8 md:py-12 lg:py-24 bg-gray-50 dark:bg-gray-900/50 px-4 sm:px-6 lg:px-8 transition-colors">
        <ScrollAnimation direction="fade" delay={100}>
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
              Всё что нужно для работы с AI-агентами
            </h2>
            <p className="max-w-[85%] leading-normal text-gray-600 sm:text-lg sm:leading-7">
              Мощное приложение с полным набором инструментов для создания, обучения и управления AI-агентами
            </p>
          </div>
        </ScrollAnimation>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <ScrollAnimation direction="up" delay={100}>
            <Card
              className="group hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-brand-accent/20 focus-within:ring-2 focus-within:ring-brand-focus focus-within:ring-offset-2 focus-within:ring-offset-background"
              role="article"
              aria-label="Умные AI-агенты"
            >
              <CardHeader>
                <div className="mb-4 h-10 w-10 rounded-lg bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent/20 transition-colors duration-300 group-hover:scale-110" aria-hidden="true">
                  <Bot className="h-6 w-6 text-brand-accent transition-transform duration-300" />
                </div>
                <CardTitle className="group-hover:text-brand-accent transition-colors duration-300">Умные AI-агенты</CardTitle>
                <CardDescription className="transition-colors duration-300">
                  Создавайте и настраивайте AI-агентов с помощью передовых моделей ИИ. 
                  Выбирайте из 100+ моделей, включая GPT-4o, Claude и другие.
                </CardDescription>
              </CardHeader>
            </Card>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={200}>
            <Card className="group hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500/20">
              <CardHeader>
                <div className="mb-4 h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300 group-hover:scale-110">
                  <Brain className="h-6 w-6 text-blue-600 transition-transform duration-300" />
                </div>
                <CardTitle className="group-hover:text-blue-600 transition-colors duration-300">Обучение и база знаний</CardTitle>
                <CardDescription className="transition-colors duration-300">
                  Обучайте агентов загружая файлы, создавая статьи и категории. 
                  Автоматическая индексация и векторный поиск для точных ответов.
                </CardDescription>
              </CardHeader>
            </Card>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={300}>
            <Card className="group hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-500/20">
              <CardHeader>
                <div className="mb-4 h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-300 group-hover:scale-110">
                  <Workflow className="h-6 w-6 text-purple-600 transition-transform duration-300" />
                </div>
                <CardTitle className="group-hover:text-purple-600 transition-colors duration-300">Автоматизация</CardTitle>
                <CardDescription className="transition-colors duration-300">
                  Настраивайте триггеры, правила и последовательности действий. 
                  Автоматизируйте работу с клиентами и сделками в CRM.
                </CardDescription>
              </CardHeader>
            </Card>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={400}>
            <Card className="group hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-green-500/20">
              <CardHeader>
                <div className="mb-4 h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors duration-300 group-hover:scale-110">
                  <Database className="h-6 w-6 text-green-600 transition-transform duration-300" />
                </div>
                <CardTitle className="group-hover:text-green-600 transition-colors duration-300">Интеграция с CRM</CardTitle>
                <CardDescription className="transition-colors duration-300">
                  Подключайте Kommo CRM и другие системы. Синхронизация данных, 
                  автоматические действия и работа с воронками продаж.
                </CardDescription>
              </CardHeader>
            </Card>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={500}>
            <Card className="group hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-yellow-500/20">
              <CardHeader>
                <div className="mb-4 h-10 w-10 rounded-lg bg-yellow-50 flex items-center justify-center group-hover:bg-yellow-100 transition-colors duration-300 group-hover:scale-110">
                  <MessageSquare className="h-6 w-6 text-yellow-600 transition-transform duration-300" />
                </div>
                <CardTitle className="group-hover:text-yellow-600 transition-colors duration-300">Мультиканальность</CardTitle>
                <CardDescription className="transition-colors duration-300">
                  Работайте с клиентами через Email, WhatsApp, Telegram и другие каналы. 
                  Единый интерфейс для всех коммуникаций.
                </CardDescription>
              </CardHeader>
            </Card>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={600}>
            <Card className="group hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-red-500/20">
              <CardHeader>
                <div className="mb-4 h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors duration-300 group-hover:scale-110">
                  <BarChart3 className="h-6 w-6 text-red-600 transition-transform duration-300" />
                </div>
                <CardTitle className="group-hover:text-red-600 transition-colors duration-300">Аналитика и мониторинг</CardTitle>
                <CardDescription className="transition-colors duration-300">
                  Отслеживайте метрики работы агентов, анализируйте производительность 
                  и оптимизируйте процессы с помощью детальной аналитики.
                </CardDescription>
              </CardHeader>
            </Card>
          </ScrollAnimation>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="container mx-auto space-y-6 py-8 md:py-12 lg:py-24 px-4 sm:px-6 lg:px-8">
        <ScrollAnimation direction="fade" delay={100}>
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
              Как это работает
            </h2>
            <p className="max-w-[85%] leading-normal text-gray-600 sm:text-lg sm:leading-7">
              Три простых шага для начала работы
            </p>
          </div>
        </ScrollAnimation>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            <ScrollAnimation direction="left" delay={200}>
              <div className="flex flex-col space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-accent text-brand-accentForeground group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <span className="text-xl font-bold">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold group-hover:text-brand-accent transition-colors duration-300">Создайте агента</h3>
                  <p className="text-gray-600">
                    Зарегистрируйтесь и создайте своего первого AI-агента. 
                    Настройте базовые параметры и инструкции.
                  </p>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="up" delay={300}>
              <div className="flex flex-col space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-accent text-brand-accentForeground group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <span className="text-xl font-bold">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold group-hover:text-brand-accent transition-colors duration-300">Обучите агента</h3>
                  <p className="text-gray-600">
                    Загрузите файлы, создайте базу знаний и настройте работу агента. 
                    Интегрируйте с вашей CRM системой.
                  </p>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="right" delay={400}>
              <div className="flex flex-col space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-accent text-brand-accentForeground group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <span className="text-xl font-bold">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold group-hover:text-brand-accent transition-colors duration-300">Автоматизируйте</h3>
                  <p className="text-gray-600">
                    Настройте автоматизацию и наблюдайте, как агент работает с клиентами 
                    и обрабатывает задачи в реальном времени.
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto space-y-6 py-8 md:py-12 lg:py-24 bg-gray-50 dark:bg-gray-900/50 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            <ScrollAnimation direction="up" delay={100}>
              <div className="flex flex-col items-center text-center space-y-2 group hover:scale-105 transition-transform duration-300">
                <AnimatedCounter
                  value={100}
                  suffix="+"
                  className="text-4xl font-bold text-brand-accent group-hover:text-brand-accentStrong transition-colors duration-300"
                />
                <div className="text-gray-600">Моделей ИИ</div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="up" delay={200}>
              <div className="flex flex-col items-center text-center space-y-2 group hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-brand-accent group-hover:text-brand-accentStrong transition-colors duration-300">24/7</div>
                <div className="text-gray-600">Работа агентов</div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="up" delay={300}>
              <div className="flex flex-col items-center text-center space-y-2 group hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-brand-accent group-hover:text-brand-accentStrong transition-colors duration-300">∞</div>
                <div className="text-gray-600">Масштабируемость</div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <AuroraBackground className="min-h-[500px] md:min-h-[600px]">
          <div className="container mx-auto space-y-6 py-8 md:py-12 lg:py-24 px-4 sm:px-6 lg:px-8 relative z-10">
            <ScrollAnimation direction="fade" delay={100}>
              <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                <div className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
                  <BlurText
                    text="Готовы начать автоматизацию?"
                    delay={150}
                    animateBy="words"
                    direction="top"
                    className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent"
                  />
                </div>
                <p className="max-w-[85%] leading-normal text-gray-600 dark:text-gray-400 sm:text-lg sm:leading-7">
                  Присоединяйтесь к TON 18 и создайте своего первого AI-агента уже сегодня. 
                  Бесплатная регистрация, без кредитной карты.
                </p>
                <div className="flex w-full items-center justify-center space-x-4 py-4">
                  <Button
                    size="lg"
                    className="group text-base transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                    asChild
                  >
                    <Link href="/register" aria-label="Начать бесплатную регистрацию">
                      Начать бесплатно
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group text-base hover:border-brand-accent hover:text-brand-accent"
                    asChild
                  >
                    <Link href="/login" aria-label="Войти в аккаунт">
                      Войти в аккаунт
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </AuroraBackground>
      </section>

      {/* Footer Section */}
      <footer className="border-t py-16 md:py-20 bg-white dark:bg-gray-950 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
            {/* Логотип и описание */}
            <div className="md:col-span-4 lg:col-span-3 flex flex-col">
              <div className="mb-5">
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
                    <Link href="#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-accent dark:hover:text-brand-accent transition-colors">
                      Возможности
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-accent dark:hover:text-brand-accent transition-colors">
                      Тарифы
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Аккаунт</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-accent dark:hover:text-brand-accent transition-colors">
                      Войти
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-accent dark:hover:text-brand-accent transition-colors">
                      Зарегистрироваться
                    </Link>
                  </li>
                  <li>
                    <Link href="/reset-password/request" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-accent dark:hover:text-brand-accent transition-colors">
                      Восстановить пароль
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Поддержка</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link href="/support" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-accent dark:hover:text-brand-accent transition-colors">
                      Помощь
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
