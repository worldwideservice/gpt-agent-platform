'use client'

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import type { PricingPlan } from '@/components/pricing/pricingData'

interface PricingPlanCardProps {
  plan: PricingPlan
  interval: 'month' | 'year'
  isCurrent: boolean
  isPopular?: boolean
  onChangePlan: (planId: string, interval: 'month' | 'year') => void
}

/**
 * Карточка тарифного плана согласно KWID
 * Показывает цену, фичи, модели AI, кнопку выбора
 */
export function PricingPlanCard({
  plan,
  interval,
  isCurrent,
  isPopular,
  onChangePlan,
}: PricingPlanCardProps) {
  // Вычисление цены на основе interval
  const billingCycle = interval === 'month' ? 'monthly' : 'yearly'
  const price = plan.calculatePrice
    ? plan.calculatePrice(15000, billingCycle) // Дефолтное значение 15,000 ответов
    : interval === 'month'
      ? plan.priceMonthly
      : plan.priceYearly

  const perConversation = plan.calculatePerConversation
    ? plan.calculatePerConversation(15000, billingCycle)
    : plan.perConversation

  const billingText = interval === 'month' ? 'Оплачивается ежемесячно' : 'Оплачивается ежегодно'

  return (
    <Card className={isCurrent ? 'border-2 border-primary' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          {isCurrent && <Badge>Текущий план</Badge>}
          {isPopular && !isCurrent && <Badge variant="secondary">Самый популярный</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Блок цены */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900 dark:text-gray-50">
              ${price}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">/месяц</span>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{billingText}</p>
          {perConversation && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {perConversation}
            </p>
          )}
        </div>

        {/* Что включено */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Что включено
          </h3>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 shrink-0 text-primary" />
                <span
                  className={`text-sm ${
                    feature.isDisabled
                      ? 'text-gray-400 line-through dark:text-gray-600'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {feature.label}
                  {feature.value && feature.value !== 'select' && feature.value !== 'models' && (
                    <span className="ml-1 font-medium">{feature.value}</span>
                  )}
                </span>
              </li>
            ))}
            {/* Список моделей AI */}
            {plan.availableModels && plan.availableModels.length > 0 && (
              <li className="ml-6 mt-2 space-y-1">
                {plan.availableModels.map((model, idx) => (
                  <div key={idx} className="text-xs text-gray-500 dark:text-gray-400">
                    • {model}
                  </div>
                ))}
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={isCurrent}
          onClick={() => onChangePlan(plan.id, interval)}
        >
          {isCurrent ? 'Текущий план' : 'Выбрать план'}
        </Button>
      </CardFooter>
    </Card>
  )
}
