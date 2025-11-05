'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, CreditCard, Check } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Progress } from '@/components/ui/progress'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/toast-context'
import { PRICING_PLANS, PRICING_RESPONSE_COUNTS, PRICING_FAQ, type PricingPlan } from '@/components/pricing/pricingData'

type BillingCycle = 'monthly' | 'yearly'

interface Subscription {
  id: string
  plan_id: string
  status: string
  current_period_end: string
  cancel_at_period_end: boolean
  usage_limits: {
    messages_per_month?: number
  }
}

interface UsageStats {
  messages_used: number
  messages_limit: number
}

export default function PricingPage() {
  const params = useParams()
  const tenantId = (params?.tenantId as string) || ''
  const { push } = useToast()

  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [selectedResponses, setSelectedResponses] = useState('15,000')

  const selectedResponsesNum = useMemo(
    () => Number.parseInt(selectedResponses.replace(/,/g, ''), 10),
    [selectedResponses]
  )

  // Определяем текущий план
  const currentPlan = useMemo(() => {
    if (!subscription) return null
    // В реальности здесь нужно получить план по subscription.plan_id
    // Для примера используем Scale как текущий
    return PRICING_PLANS.find((p) => p.id === 'scale') || null
  }, [subscription])

  // Загружаем данные
  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем подписку
        const subResponse = await fetch('/api/billing?action=subscription')
        if (subResponse.ok) {
          const subData = await subResponse.json()
          if (subData.success && subData.data) {
            setSubscription(subData.data)
          }
          // Если нет подписки - это нормально, не показываем ошибку
        }

        // Загружаем использование (за последний месяц)
        const now = new Date()
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        const usageResponse = await fetch(
          `/api/billing?action=usage&start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`
        )
        if (usageResponse.ok) {
          const usageData = await usageResponse.json()
          if (usageData.success && usageData.data) {
            setUsage(usageData.data)
          }
          // Если нет статистики - это нормально
        }
      } catch (error) {
        console.error('Failed to load pricing data', error)
        // Показываем ошибку только если это критическая проблема
        if (error instanceof Error && !error.message.includes('fetch')) {
          push({
            title: 'Ошибка',
            description: 'Не удалось загрузить некоторые данные',
            variant: 'error',
          })
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [push])

  const formatPrice = (plan: PricingPlan) => {
    // Если есть функция расчета динамической цены - используем её
    if (plan.calculatePrice) {
      return plan.calculatePrice(selectedResponsesNum, billingCycle)
    }
    // Иначе используем статичную цену
    return billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly
  }

  // Рассчитываем цену за разговор для динамического отображения
  const calculatePerConversation = (plan: PricingPlan, price: number) => {
    if (selectedResponsesNum === 0) return ''
    const perConversation = price / selectedResponsesNum
    return `Около $${perConversation.toFixed(2)} за разговор`
  }

  const isUnavailableForPlan = (plan: PricingPlan) =>
    plan.unavailableForResponses?.includes(selectedResponsesNum) ?? false

  const handleSelectPlan = async (planId: string) => {
    try {
      const response = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_subscription_session',
          plan_id: planId,
          success_url: `${window.location.origin}/manage/${tenantId}/pricing?success=true`,
          cancel_url: `${window.location.origin}/manage/${tenantId}/pricing?canceled=true`,
        }),
      })

      const data = await response.json()
      if (data.success && data.data?.session_url) {
        window.location.href = data.data.session_url
      } else {
        throw new Error(data.error || 'Не удалось создать сессию')
      }
    } catch (error) {
      console.error('Failed to create subscription session', error)
      push({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось выбрать план',
        variant: 'error',
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Загрузка...</div>
      </div>
    )
  }

  const usagePercentage = usage
    ? Math.round((usage.messages_used / usage.messages_limit) * 100)
    : 0

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/manage/${tenantId}`}>Инфопанель</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Тарифные планы</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-2xl font-semibold">Тарифные планы</h1>

        {/* Текущий план */}
        {subscription && currentPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Ваш текущий план:</CardTitle>
              <CardDescription>
                {currentPlan.name} ({selectedResponses} ответов ИИ в месяц)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-gray-500">Лицензия истекла:</div>
                    <div className="font-medium">{formatDate(subscription.current_period_end)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-gray-500">Платежный цикл:</div>
                    <div className="font-medium">Ежемесячно</div>
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Перейти на годовой
                  </Button>
                </div>
              </div>

              {/* Прогресс использования */}
              {usage && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Использовано: {usage.messages_used.toLocaleString()} из {usage.messages_limit.toLocaleString()}</span>
                    <span className="font-medium">{usagePercentage}% использовано</span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                </div>
              )}

              <div>
                <Button variant="outline">Управление подпиской</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Выбор тарифа */}
        <Card>
          <CardHeader>
            <CardTitle>Выберите тарифный план</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Ответов ИИ:</label>
              <select
                value={selectedResponses}
                onChange={(e) => setSelectedResponses(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                {PRICING_RESPONSE_COUNTS.map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={billingCycle === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBillingCycle('monthly')}
              >
                Ежемесячно
              </Button>
              <Button
                variant={billingCycle === 'yearly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBillingCycle('yearly')}
              >
                Ежегодно
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Тарифные планы */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => {
            const isCurrent = Boolean(subscription && (subscription.plan_id === plan.id || (plan.id === 'scale' && subscription)))
            const isUnavailable = isUnavailableForPlan(plan)
            const price = formatPrice(plan)

            return (
              <Card key={plan.id} className={isCurrent ? 'ring-2 ring-primary' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {isCurrent && <Badge variant="secondary">Текущий план</Badge>}
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">${price.toLocaleString()}</div>
                    <CardDescription>/ {billingCycle === 'monthly' ? 'месяц' : 'год'}</CardDescription>
                    {(plan.perConversation || plan.calculatePrice) && (
                      <CardDescription className="text-xs">
                        {plan.perConversation || calculatePerConversation(plan, price)}
                      </CardDescription>
                    )}
                  </div>
                  {isCurrent && (
                    <Badge variant="outline" className="w-fit">
                      Оплачивается ежемесячно
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        {feature.isDisabled ? (
                          <span className="text-gray-400">○</span>
                        ) : (
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        )}
                        <span className={feature.isDisabled ? 'text-gray-400' : ''}>
                          {feature.label}
                          {feature.value === 'select' && (
                            <span className="ml-1 font-medium">{selectedResponses}</span>
                          )}
                          {feature.value === 'models' && plan.availableModels && (
                            <div className="mt-1 text-xs text-gray-500">
                              {plan.availableModels.join(', ')}
                            </div>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={isUnavailable || isCurrent}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {isCurrent ? 'Текущий план' : isUnavailable ? 'Недоступно' : 'Выбрать план'}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Гарантия */}
        <Card>
          <CardHeader>
            <CardTitle>30-дневная гарантия возврата денег</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>
              Попробуйте любой план без риска. Если вас что-то не устроит в течение первых 30 дней,
              мы вернём деньги.
            </p>
            <p>
              Наша служба поддержки готова помочь вам сменить план или отменить подписку в любое
              время.
            </p>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Часто задаваемые вопросы</CardTitle>
            <CardDescription>
              Найдите ответы на распространенные вопросы о наших тарифах и планах
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {PRICING_FAQ.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

