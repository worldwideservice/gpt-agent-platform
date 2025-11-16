'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { CurrentPlanCard } from './CurrentPlanCard'
import { PeriodToggle } from './PeriodToggle'
import { PricingPlanCard } from './PricingPlanCard'
import { FAQAccordion } from './FAQAccordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { PRICING_PLANS } from '@/components/pricing/pricingData'
import { useToast } from '@/hooks/use-toast'

type Interval = 'month' | 'year'

/**
 * Главный клиентский компонент для внутренней страницы тарифов
 * Объединяет все компоненты согласно KWID
 */
export function PricingClient() {
  const params = useParams()
  const tenantId = params?.tenantId as string
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [interval, setInterval] = useState<Interval>('month')

  const queryKey = ['currentSubscription', tenantId]

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
            isCurrent={plan.id === data.subscription.plan.id}
            isPopular={index === 1} // Scale - самый популярный
            onChangePlan={(planId, interval) => changePlan({ newPlanId: planId, interval })}
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
