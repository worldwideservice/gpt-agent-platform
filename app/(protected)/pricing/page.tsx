'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, Info, Star, X } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Toggle } from '@/components/ui/Toggle'

interface Plan {
  id: string
  name: string
  priceMonthly: number
  priceYearly: number
  description: string
  features: string[]
  isCurrent?: boolean
}

const plans: Plan[] = [
  {
    id: 'launch',
    name: 'Launch',
    priceMonthly: 18,
    priceYearly: 13,
    description: 'Недоступно для 15 000 ответов ИИ',
    features: ['1 агент', '500 статей базы знаний', '15,000 ответов / месяц', 'Отправка изображений, аудио, видео и документов'],
  },
  {
    id: 'scale',
    name: 'Scale',
    priceMonthly: 578,
    priceYearly: 499,
    description: 'Около $0.23 за разговор',
    features: [
      '10 агентов',
      '100,000 статей базы знаний',
      '15,000 ответов / месяц',
      'Начальные инструкции агента: до 20,000 символов',
      'Входящие голосовые сообщения',
      'Обновление полей сделок и контактов',
    ],
    isCurrent: true,
  },
  {
    id: 'max',
    name: 'Max',
    priceMonthly: 973,
    priceYearly: 799,
    description: 'Около $0.23 за разговор',
    features: [
      'Неограниченное количество агентов',
      'Неограниченное количество статей базы знаний',
      '15,000 ответов / месяц',
      'Доступные модели ИИ: OpenAI GPT-4.1, OpenAI GPT-5, Google Gemini 2.5 Flash, Claude Sonnet 4',
    ],
  },
]

const faqItems = [
  {
    question: 'Могу ли я изменить свой план позже?',
    answer: 'Да, вы можете сменить план в любое время в разделе “Управление подпиской”.',
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

const PricingPage = () => {
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
          <h1 className="text-3xl font-semibold text-slate-900">Тарифные планы</h1>
          <p className="text-sm text-slate-500">Загрузка...</p>
        </header>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Тарифные планы</h1>
          <p className="text-sm text-slate-500">Выберите подходящий тариф и управляйте лимитами ответов ИИ</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 text-sm" onClick={() => setNotificationsOpen(true)}>
            <Info className="h-4 w-4" /> Уведомления
          </Button>
          <Button variant="outline" className="gap-2 text-sm">
            Управление подпиской
          </Button>
        </div>
      </header>

      {subscription && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Ваш текущий план</p>
              <h2 className="text-lg font-semibold text-slate-900">
                {currentPlan?.name ?? subscription.plan} ({subscription.tokenQuota.toLocaleString('ru-RU')} ответов ИИ в месяц)
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                {subscription.renewsAt && <span>Активно до: {formatDate(subscription.renewsAt)}</span>}
                <span>Платёжный цикл: {billingCycle === 'monthly' ? 'Ежемесячно' : 'Ежегодно'}</span>
                <button type="button" className="text-primary-600 hover:underline">
                  Перейти на годовой
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm text-slate-500">
              <span>
                Использовано: {subscription.tokenUsed.toLocaleString('ru-RU')} из{' '}
                {subscription.tokenQuota.toLocaleString('ru-RU')} (Сбросится: {nextResetDate})
              </span>
              <div className="w-72 rounded-full bg-slate-100">
                <div
                  className={`h-2 rounded-full ${
                    usagePercentage >= 100 ? 'bg-rose-500' : usagePercentage >= 80 ? 'bg-yellow-500' : 'bg-primary-500'
                  }`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            Ответов ИИ: {Number(selectedResponses).toLocaleString('ru-RU')}
          </div>
          <Select
            label=" "
            defaultValue={selectedResponses}
            options={responsesOptions}
            className="w-48"
            onChange={(event) => setSelectedResponses(event.target.value)}
          />
          <div className="rounded-full border border-slate-200 bg-slate-50 px-1 py-1">
            <div className="flex items-center gap-1">
              <Button
                variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
                className="rounded-full px-4 text-sm"
                onClick={() => setBillingCycle('monthly')}
              >
                Ежемесячно
              </Button>
              <Button
                variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
                className="rounded-full px-4 text-sm"
                onClick={() => setBillingCycle('yearly')}
              >
                Ежегодно
              </Button>
            </div>
          </div>
          <Toggle
            checked={autoRenew}
            onChange={setAutoRenew}
            label="Автопродление"
            description="30-дневная гарантия возврата денег"
          />
          </div>
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
                isCurrent ? 'border-primary-600 bg-primary-50' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Тариф</p>
                  <h3 className="text-2xl font-semibold text-slate-900">{plan.name}</h3>
                </div>
                {isCurrent ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                    <Star className="h-3.5 w-3.5" /> Текущий план
                  </span>
                ) : null}
              </div>
              <div>
                <p className="text-4xl font-bold text-slate-900">{formatPrice(plan)}/мес</p>
                <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-primary-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={isCurrent ? 'secondary' : 'default'}
                disabled={isCurrent}
                className="mt-auto text-sm"
              >
                {isCurrent ? 'Текущий план' : 'Выбрать план'}
              </Button>
            </div>
          )
        })}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Часто задаваемые вопросы</h2>
        <p className="mt-1 text-sm text-slate-500">Найдите ответы на распространённые вопросы о наших тарифах и планах</p>
        <div className="mt-4 space-y-3">
          {faqItems.map((item) => (
            <AccordionItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900">30-дневная гарантия возврата денег</h3>
        <p className="mt-2 text-sm text-slate-500">
          Попробуйте любой план без риска. Если вас что-то не устроит в течение первых 30 дней, мы вернём деньги. Наша служба поддержки готова помочь вам сменить план или отменить подписку в любое время.
        </p>
      </section>

      {notificationsOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-slate-900/40" onClick={() => setNotificationsOpen(false)} />
          <aside className="h-full w-96 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Уведомления</h2>
              <button type="button" onClick={() => setNotificationsOpen(false)} aria-label="Закрыть">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto px-6 py-4">
              {mockNotifications.map((notification) => (
                <div key={notification.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                  <p className="mt-2 text-xs text-slate-500">{notification.timestamp}</p>
                  <Button variant="outline" size="sm" className="mt-3 text-xs">
                    Обновить план
                  </Button>
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
    <div className="rounded-2xl border border-slate-200 bg-slate-50">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-700"
        onClick={() => setOpen((prev) => !prev)}
      >
        {question}
        <span className="text-primary-600">{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-600">{answer}</div> : null}
    </div>
  )
}

export default PricingPage
