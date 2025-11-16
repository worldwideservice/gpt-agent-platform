'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, Calendar, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface CurrentPlanCardProps {
  subscription: {
    plan: {
      name: string
      max_responses: number
    }
    status: 'active' | 'trialing' | 'cancelled' | 'expired'
    current_period_end: string
    interval: 'month' | 'year'
  }
  usage: {
    responses: number
    max_responses: number
    percentage: number
  }
  onCancel: () => void
  onSwitchToYearly?: () => void
}

/**
 * Карточка "Ваш текущий план" согласно KWID
 * Показывает текущую подписку, дату истечения, платежный цикл, progress bar использования
 */
export function CurrentPlanCard({
  subscription,
  usage,
  onCancel,
  onSwitchToYearly,
}: CurrentPlanCardProps) {
  const isExpired = subscription.status === 'expired'
  const isMonthly = subscription.interval === 'month'
  const periodEndDate = new Date(subscription.current_period_end)

  return (
    <Card className="border-primary shadow-lg">
      <CardHeader>
        <CardTitle>Ваш текущий план:</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Название плана и количество ответов */}
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          {subscription.plan.name} ({subscription.plan.max_responses.toLocaleString('ru-RU')}{' '}
          ответов ИИ в месяц)
        </div>

        {/* Информация об истечении лицензии */}
        {isExpired && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">
              Лицензия истекла: {format(periodEndDate, 'dd.MM.yyyy', { locale: ru })}
            </span>
          </div>
        )}

        {/* Платежный цикл */}
        <div className="flex items-center justify-between rounded-lg bg-muted p-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Платежный цикл: {isMonthly ? 'Ежемесячно' : 'Ежегодно'}
            </span>
          </div>
          {isMonthly && onSwitchToYearly && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSwitchToYearly}
              className="gap-2"
            >
              Перейти на годовой
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Прогресс использования */}
        <div className="space-y-2 rounded-lg bg-muted p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-gray-500" />
              <div className="text-sm">
                <div className="font-medium text-gray-700 dark:text-gray-300">
                  Использовано: {usage.responses.toLocaleString('ru-RU')} из{' '}
                  {usage.max_responses.toLocaleString('ru-RU')}
                </div>
                <div className="text-xs text-gray-500">{usage.percentage}% использовано</div>
              </div>
            </div>
          </div>
          <Progress value={usage.percentage} className="h-2" />
        </div>

        {/* Кнопка управления подпиской */}
        <div className="flex gap-2">
          <Button onClick={onCancel} variant="outline">
            Управление подпиской
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
