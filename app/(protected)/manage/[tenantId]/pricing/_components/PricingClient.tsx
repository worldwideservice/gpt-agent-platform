'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, Info, Star, X } from 'lucide-react'

import { KwidButton, KwidSelect, KwidSwitch } from '@/components/kwid'

interface Plan {
  id: string
  name: string
  priceMonthly: number
  priceYearly: number
  description: string
  features: string[]
  isCurrent?: boolean
}

/**
 * Тарифные планы Kwid - точная копия структуры и цен
 * Источник: https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/pricing
 * 
 * Арифметика цен:
 * - Launch: $18/мес ($216/год) → $13/мес при годовом ($156/год) = экономия $60 (28%)
 * - Scale: $578/мес ($6,936/год) → $499/мес при годовом ($5,988/год) = экономия $948 (14%)
 * - Max: $973/мес ($11,676/год) → $799/мес при годовом ($9,588/год) = экономия $2,088 (18%)
 */
const plans: Plan[] = [
  {
    id: 'launch',
    name: 'Launch',
    priceMonthly: 18,
    priceYearly: 13,
    description: 'Идеально для старта малого бизнеса',
    features: [
      '1 AI агент',
      '500 статей базы знаний',
      '15,000 ответов ИИ / месяц',
      'Отправка изображений, аудио, видео и документов',
      'Базовая интеграция с CRM',
      'Email поддержка',
      'Стандартные модели ИИ',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    priceMonthly: 578,
    priceYearly: 499,
    description: 'Около $0.23 за разговор - для масштабирования бизнеса',
    features: [
      '10 AI агентов',
      '100,000 статей базы знаний',
      '15,000 ответов ИИ / месяц',
      'Начальные инструкции агента: до 20,000 символов',
      'Входящие голосовые сообщения',
      'Обновление полей сделок и контактов в CRM',
      'Автоматизация воронок продаж',
      'Настройка работы агента по этапам воронки',
      'Расширенная аналитика и отчеты',
      'Приоритетная поддержка',
    ],
    isCurrent: true,
  },
  {
    id: 'max',
    name: 'Max',
    priceMonthly: 973,
    priceYearly: 799,
    description: 'Около $0.23 за разговор - максимальные возможности',
    features: [
      'Неограниченное количество AI агентов',
      'Неограниченное количество статей базы знаний',
      '15,000 ответов ИИ / месяц',
      'Доступные модели ИИ: OpenAI GPT-4.1, OpenAI GPT-5, Google Gemini 2.5 Flash, Claude Sonnet 4',
      'Неограниченные инструкции агента',
      'Все функции Scale плана',
      'Кастомные интеграции и API доступ',
      'Выделенная поддержка 24/7',
      'Персональный менеджер аккаунта',
      'SLA гарантии и приоритет обработки',
    ],
  },
]

const faqItems = [
  {
    question: 'Могу ли я изменить свой план позже?',
    answer: 'Да, вы можете сменить план в любое время в разделе "Управление подпиской".',
  },
  {
    question: 'Предоставляете ли вы возврат средств?',
    answer: 'В течение 30 дней мы гарантируем возврат средств, если вас что-то не устроит.',
  },
  {
    question: 'Что произойдёт, если я превышу лимиты моего плана?',
    answer: 'Мы уведомим вас и предложим активировать новый план или увеличить лимиты.',
  },
  {
    question: 'Нужны ли мне собственные API-ключи OpenAI?',
    answer: 'Нет, все модели уже включены в подписку.',
  },
  {
    question: 'Есть ли дополнительные платежи за разговоры?',
    answer: 'Стоимость уже рассчитана исходя из лимитов. Дополнительные платежи не требуются.',
  },
]

const mockNotifications = [
  {
    id: '1',
    title: 'Месячный лимит достигнут: ответы ИИ отключены',
    timestamp: '21 минуту назад',
  },
  {
    id: '2',
    title: 'Месячный лимит достигнут: ответы ИИ отключены',
    timestamp: '46 минут назад',
  },
  {
    id: '3',
    title: 'Месячный лимит достигнут: ответы ИИ отключены',
    timestamp: '1 час назад',
  },
]

const responsesOptions = [
  { value: '10000', label: '10,000' },
  { value: '15000', label: '15,000' },
  { value: '20000', label: '20,000' },
]

interface SubscriptionData {
  plan: string
  status: string
  tokenQuota: number
  tokenUsed: number
  renewsAt: string | null
}

interface PricingClientProps {
  tenantId: string
}

export const PricingClient = ({ tenantId }: PricingClientProps) => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedResponses, setSelectedResponses] = useState('15000')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [autoRenew, setAutoRenew] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSubscription = useCallback(async () => {
    try {
      const response = await fetch('/api/subscriptions')
      if (response.ok) {
        const payload = (await response.json()) as { success: boolean; data: SubscriptionData | null }
        if (payload.success && payload.data) {
          setSubscription(payload.data)
          setSelectedResponses(payload.data.tokenQuota.toString())
        }
      }
    } catch (error) {
      console.error('Failed to fetch subscription', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  const currentPlan = useMemo(() => {
    if (!subscription) {
      return plans.find((plan) => plan.isCurrent)
    }
    return plans.find((plan) => plan.id === subscription.plan.toLowerCase())
  }, [subscription])

  const formatPrice = (plan: Plan) => {
    if (billingCycle === 'monthly') {
      return `$${plan.priceMonthly}`
    }

    return `$${plan.priceYearly}`
  }

  const formatDate = (dateString: string | null): string => {
    if (!dateString) {
      return '—'
    }
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString))
  }

  const usagePercentage = subscription
    ? Math.min((subscription.tokenUsed / subscription.tokenQuota) * 100, 100)
    : 0

  const defaultDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  const nextResetDate = subscription?.renewsAt
    ? formatDate(subscription.renewsAt)
    : formatDate(defaultDate)

  if (isLoading) {
    return (
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Тарифные планы</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">Загрузка...</p>
        </header>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Тарифные планы</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">Выберите подходящий тариф и управляйте лимитами ответов ИИ</p>
        </div>
        <div className="flex items-center gap-3">
          <KwidButton variant="outline" size="sm" className="gap-2" onClick={() => setNotificationsOpen(true)}>
            <Info className="h-4 w-4" /> Уведомления
          </KwidButton>
          <KwidButton variant="outline" size="sm" className="gap-2">
            Управление подпиской
          </KwidButton>
        </div>
      </header>

      {subscription && (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500">Ваш текущий план</p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {currentPlan?.name ?? subscription.plan} ({subscription.tokenQuota.toLocaleString('ru-RU')} ответов ИИ в месяц)
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-gray-400">
              {subscription.renewsAt && <span>Активно до: {formatDate(subscription.renewsAt)}</span>}
              <span>Платёжный цикл: {billingCycle === 'monthly' ? 'Ежемесячно' : 'Ежегодно'}</span>
              <button type="button" className="text-custom-600 hover:underline dark:text-custom-400">
                Перейти на годовой
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-gray-400">
            <span>
              Использовано: {subscription.tokenUsed.toLocaleString('ru-RU')} из{' '}
              {subscription.tokenQuota.toLocaleString('ru-RU')} (Сбросится: {nextResetDate})
            </span>
            <div className="w-72 rounded-full bg-slate-100 dark:bg-gray-800">
              <div
                className={`h-2 rounded-full transition-all ${
                  usagePercentage >= 100 
                    ? 'bg-rose-500 dark:bg-rose-600' 
                    : usagePercentage >= 80 
                      ? 'bg-yellow-500 dark:bg-yellow-600' 
                      : 'bg-custom-600 dark:bg-custom-500'
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>
        </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            Ответов ИИ: {Number(selectedResponses).toLocaleString('ru-RU')}
          </div>
          <KwidSelect
            label=" "
            value={selectedResponses}
            options={responsesOptions}
            className="w-48"
            onChange={(value: string) => setSelectedResponses(value)}
          />
          <div className="rounded-full border border-slate-200 bg-slate-50 px-1 py-1 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-1">
              <KwidButton
                variant={billingCycle === 'monthly' ? 'primary' : 'outline'}
                size="sm"
                className="rounded-full px-4"
                onClick={() => setBillingCycle('monthly')}
              >
                Ежемесячно
              </KwidButton>
              <KwidButton
                variant={billingCycle === 'yearly' ? 'primary' : 'outline'}
                size="sm"
                className="rounded-full px-4"
                onClick={() => setBillingCycle('yearly')}
              >
                Ежегодно
              </KwidButton>
            </div>
          </div>
          <KwidSwitch
            checked={autoRenew}
            onCheckedChange={setAutoRenew}
            label="Автопродление"
            description="30-дневная гарантия возврата денег"
          />
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = subscription && plan.id === subscription.plan.toLowerCase()
          return (
            <div
              key={plan.id}
              className={`flex flex-col gap-5 rounded-2xl border p-6 shadow-sm ${
                isCurrent 
                  ? 'border-custom-600 bg-custom-50 dark:border-custom-500 dark:bg-custom-900/20' 
                  : 'border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500">Тариф</p>
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
                </div>
                {isCurrent ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-custom-600 px-3 py-1 text-xs font-semibold text-white dark:bg-custom-500">
                    <Star className="h-3.5 w-3.5" /> Текущий план
                  </span>
                ) : null}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-slate-900 dark:text-white">
                    {billingCycle === 'monthly' ? `$${plan.priceMonthly}` : `$${plan.priceYearly}`}
                  </p>
                  <span className="text-sm text-slate-500 dark:text-gray-400">/мес</span>
                </div>
                {billingCycle === 'yearly' && plan.priceYearly < plan.priceMonthly && (
                  <p className="mt-1 text-xs font-semibold text-green-600 dark:text-green-400">
                    Экономия ${((plan.priceMonthly - plan.priceYearly) * 12).toLocaleString('ru-RU')} в год ({Math.round((1 - (plan.priceYearly * 12) / (plan.priceMonthly * 12)) * 100)}%)
                  </p>
                )}
                {billingCycle === 'monthly' && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                    Итого: ${(plan.priceMonthly * 12).toLocaleString('ru-RU')}/год
                  </p>
                )}
                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{plan.description}</p>
              </div>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-custom-600 dark:text-custom-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <KwidButton
                variant={isCurrent ? 'secondary' : 'primary'}
                disabled={isCurrent ?? false}
                size="sm"
                className="mt-auto"
              >
                {isCurrent ? 'Текущий план' : 'Выбрать план'}
              </KwidButton>
            </div>
          )
        })}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Часто задаваемые вопросы</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Найдите ответы на распространённые вопросы о наших тарифах и планах</p>
        <div className="mt-4 space-y-3">
          {faqItems.map((item) => (
            <AccordionItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">30-дневная гарантия возврата денег</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
          Попробуйте любой план без риска. Если вас что-то не устроит в течение первых 30 дней, мы вернём деньги. Наша служба поддержки готова помочь вам сменить план или отменить подписку в любое время.
        </p>
      </section>

      {notificationsOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-slate-900/40" onClick={() => setNotificationsOpen(false)} />
          <aside className="h-full w-96 bg-white shadow-2xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Уведомления</h2>
              <button type="button" onClick={() => setNotificationsOpen(false)} aria-label="Закрыть">
                <X className="h-5 w-5 text-slate-400 dark:text-gray-500" />
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto px-6 py-4">
              {mockNotifications.map((notification) => (
                <div key={notification.id} className="rounded-xl border border-slate-200 p-4 dark:border-gray-800 dark:bg-gray-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-gray-400">{notification.timestamp}</p>
                  <KwidButton variant="outline" size="sm" className="mt-3">
                    Обновить план
                  </KwidButton>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

const AccordionItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-gray-800 dark:bg-gray-800">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-gray-300"
        onClick={() => setOpen((prev) => !prev)}
      >
        {question}
        <span className="text-custom-600 dark:text-custom-400">{open ? '−' : '+'}</span>
      </button>
      {open ? (
        <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-600 dark:border-gray-700 dark:text-gray-400">
          {answer}
        </div>
      ) : null}
    </div>
  )
}

