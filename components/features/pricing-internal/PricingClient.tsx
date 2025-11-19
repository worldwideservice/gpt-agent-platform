'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { initializePaddle, type Paddle } from '@paddle/paddle-js'
import { CurrentPlanCard } from './CurrentPlanCard'
import { PeriodToggle } from './PeriodToggle'
import { PricingPlanCard } from './PricingPlanCard'
import { FAQAccordion } from './FAQAccordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { PRICING_PLANS } from '@/components/pricing/pricingData'
import { useToast } from '@/hooks/use-toast'

type Interval = 'month' | 'year'

// Paddle configuration
const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
const PADDLE_ENVIRONMENT = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production'

// Paddle Price IDs mapping - TODO: Replace with real Price IDs from Paddle Dashboard
const PADDLE_PRICE_IDS: Record<string, { month: string; year: string }> = {
  starter: {
    month: 'pri_starter_monthly',
    year: 'pri_starter_yearly',
  },
  scale: {
    month: 'pri_scale_monthly',
    year: 'pri_scale_yearly',
  },
  enterprise: {
    month: 'pri_enterprise_monthly',
    year: 'pri_enterprise_yearly',
  },
}

/**
 * Главный клиентский компонент для внутренней страницы тарифов
 * Объединяет все компоненты согласно KWID + Paddle Checkout
 */
export function PricingClient() {
  const params = useParams()
  const tenantId = params?.tenantId as string
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [interval, setInterval] = useState<Interval>('month')
  const [paddle, setPaddle] = useState<Paddle | null>(null)
  const [isPaddleLoading, setIsPaddleLoading] = useState(true)

  const queryKey = ['currentSubscription', tenantId]

  // Инициализация Paddle при монтировании компонента
  useEffect(() => {
    if (PADDLE_CLIENT_TOKEN) {
      setIsPaddleLoading(true)
      initializePaddle({
        token: PADDLE_CLIENT_TOKEN,
        environment: PADDLE_ENVIRONMENT,
        eventCallback: (data) => {
          // Обработка событий Paddle
          if (data.name === 'checkout.completed') {
            toast({
              title: 'Оплата успешна!',
              description: 'Ваша подписка активирована.',
            })
            // Обновляем данные подписки после успешной оплаты
            queryClient.invalidateQueries({ queryKey })
          }

          if (data.name === 'checkout.closed') {
            console.log('[Paddle] Checkout closed by user')
          }

          if (data.name === 'checkout.error') {
            toast({
              title: 'Ошибка оплаты',
              description: 'Не удалось завершить оплату. Попробуйте еще раз.',
              variant: 'destructive',
            })
          }
        },
      })
        .then((paddleInstance) => {
          if (paddleInstance) {
            setPaddle(paddleInstance)
            console.log('[Paddle] Initialized successfully')
          }
        })
        .catch((error) => {
          console.error('[Paddle] Initialization failed:', error)
          toast({
            title: 'Ошибка инициализации платежей',
            description: 'Не удалось загрузить платежную систему. Попробуйте обновить страницу.',
            variant: 'destructive',
          })
        })
        .finally(() => {
          setIsPaddleLoading(false)
        })
    } else {
      setIsPaddleLoading(false)
      console.warn('[Paddle] Client token is not configured')
    }
  }, [queryClient, toast])

  // Получение текущей подписки
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!tenantId) throw new Error('Tenant ID is not available')
      const res = await fetch(`/api/manage/${tenantId}/subscription/current`)
      if (!res.ok) throw new Error('Failed to fetch subscription')
      return res.json()
    },
    enabled: !!tenantId,
  })

  // Мутация для смены плана
  const { mutate: changePlan, isPending: isChangingPlan } = useMutation({
    mutationFn: async ({ newPlanId, interval }: { newPlanId: string; interval: Interval }) => {
      const res = await fetch(`/api/manage/${tenantId}/subscription/change-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPlanId, interval }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to change plan')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast({
        title: 'План обновлен',
        description: 'Ваш тарифный план успешно изменен.',
      })
    },
    onError: (e: Error) => {
      toast({
        title: 'Ошибка',
        description: e.message,
        variant: 'destructive',
      })
    },
  })

  // Мутация для отмены подписки
  const { mutate: cancelPlan, isPending: isCancellingPlan } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/manage/${tenantId}/subscription/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to cancel subscription')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast({
        title: 'Подписка отменена',
        description: 'Ваша подписка была успешно отменена.',
      })
    },
    onError: (e: Error) => {
      toast({
        title: 'Ошибка',
        description: e.message,
        variant: 'destructive',
      })
    },
  })

  const handleSwitchToYearly = () => {
    setInterval('year')
  }

  const handleCancelSubscription = () => {
    if (confirm('Вы уверены, что хотите отменить подписку?')) {
      cancelPlan()
    }
  }

  /**
   * Обработчик выбора тарифного плана
   * Для новых пользователей - открывает Paddle Checkout
   * Для существующих подписчиков - вызывает API смены плана
   */
  const handlePlanSelection = (planId: string, interval: Interval) => {
    const hasActiveSubscription = data?.subscription?.status === 'active'

    if (!hasActiveSubscription) {
      // Новая покупка через Paddle Checkout
      if (!paddle) {
        toast({
          title: 'Платежная система загружается',
          description: isPaddleLoading
            ? 'Пожалуйста, подождите...'
            : 'Не удалось загрузить платежную систему. Попробуйте обновить страницу.',
          variant: isPaddleLoading ? 'default' : 'destructive',
        })
        return
      }

      const priceId = PADDLE_PRICE_IDS[planId]?.[interval]

      if (!priceId) {
        toast({
          title: 'Ошибка конфигурации',
          description: `Price ID не найден для плана: ${planId} (${interval})`,
          variant: 'destructive',
        })
        console.error(`[Paddle] Missing Price ID for plan: ${planId}, interval: ${interval}`)
        return
      }

      console.log(`[Paddle] Opening checkout for plan: ${planId}, price: ${priceId}`)

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: {
          email: session?.user?.email || '',
        },
        customData: {
          orgId: tenantId,
          planId: planId,
          interval: interval,
        },
      })
    } else {
      // Смена существующего плана через API
      console.log(`[API] Changing plan to: ${planId} (${interval})`)
      changePlan({ newPlanId: planId, interval })
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Ошибка</AlertTitle>
        <AlertDescription>{(error as Error).message}</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="h-12 w-64 animate-pulse self-center rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="h-96 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-96 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-96 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Предупреждение если Paddle не загружен (только для новых пользователей) */}
      {!paddle && !isPaddleLoading && !data?.subscription?.status && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Платежная система недоступна</AlertTitle>
          <AlertDescription>
            Не удалось загрузить платежную систему. Обновите страницу или свяжитесь с поддержкой.
          </AlertDescription>
        </Alert>
      )}

      {/* Блок "Ваш текущий план" + Progress bar */}
      <CurrentPlanCard
        subscription={data.subscription}
        usage={data.usage}
        onCancel={handleCancelSubscription}
        onSwitchToYearly={handleSwitchToYearly}
      />

      {/* Переключатель Ежемесячно/Ежегодно */}
      <div className="flex justify-center">
        <PeriodToggle interval={interval} onIntervalChange={setInterval} />
      </div>

      {/* Карточки тарифных планов */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PRICING_PLANS.map((plan, index) => (
          <PricingPlanCard
            key={plan.id}
            plan={plan}
            interval={interval}
            isCurrent={plan.id === data.subscription?.plan?.id}
            isPopular={index === 1} // Scale - самый популярный
            onChangePlan={handlePlanSelection}
          />
        ))}
      </div>

      {/* FAQ секция */}
      <FAQAccordion />

      {/* Блок "30-дневная гарантия возврата денег" */}
      <div className="mx-auto max-w-3xl rounded-lg bg-muted p-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            30-дневная гарантия возврата денег
          </h3>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Попробуйте любой план без риска. Если вас что-то не устроит в течение первых 30 дней,
          мы вернём деньги.
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Наша служба поддержки готова помочь вам сменить план или отменить подписку в любое
          время.
        </p>
      </div>
    </div>
  )
}
