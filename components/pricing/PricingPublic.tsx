'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

import { KwidButton } from '@/components/kwid'
import {
  PRICING_FAQ,
  PRICING_PLANS,
  PRICING_RESPONSE_COUNTS,
  type PricingPlan,
} from '@/components/pricing/pricingData'

type BillingCycle = 'monthly' | 'yearly'

const RECOMMENDED_PLAN_ID = 'scale'

export const PricingPublic = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [selectedResponses, setSelectedResponses] = useState('15,000')

  const selectedResponsesNum = useMemo(
    () => Number.parseInt(selectedResponses.replace(/,/g, ''), 10),
    [selectedResponses]
  )

  const formatPrice = (plan: PricingPlan) =>
    billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly

  const isUnavailableForPlan = (plan: PricingPlan) =>
    plan.unavailableForResponses?.includes(selectedResponsesNum) ?? false

  return (
    <div className="space-y-16">
      <section className="text-center space-y-6">
        <p className="inline-flex rounded-full bg-primary-50 px-4 py-1 text-sm font-medium text-primary-700">
          30 дней гарантии возврата денег
        </p>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Подберите подходящий план для вашей команды
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Запускайте AI-агентов, подключайте CRM и управляйте коммуникациями без ограничений.
            Все модели и инструменты включены в подписку.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className="text-sm font-medium text-slate-700">Ответов ИИ:</span>
            <select
              value={selectedResponses}
              onChange={(event) => setSelectedResponses(event.target.value)}
              className="rounded-full border-0 bg-transparent pr-6 text-sm font-semibold text-primary-600 outline-none focus:ring-2 focus:ring-primary-500"
            >
              {PRICING_RESPONSE_COUNTS.map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>

          <div className="inline-flex items-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 text-sm font-medium transition ${
                billingCycle === 'monthly'
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Ежемесячно
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 text-sm font-medium transition ${
                billingCycle === 'yearly'
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Ежегодно
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-3">
        {PRICING_PLANS.map((plan) => {
          const isRecommended = plan.id === RECOMMENDED_PLAN_ID
          const isUnavailable = isUnavailableForPlan(plan)
          const price = formatPrice(plan)

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 ${
                isRecommended ? 'border-primary-300 shadow-lg ring-1 ring-primary-200' : ''
              }`}
            >
              {isRecommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  Рекомендуем
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                    ${price}
                  </span>
                  <span className="text-sm text-slate-500">/мес</span>
                </div>
                {plan.perConversation && (
                  <p className="mt-2 inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                    {plan.perConversation}
                  </p>
                )}
                {isUnavailable && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                    Недоступно для выбранного количества ответов
                  </p>
                )}
              </div>

              <div className="flex flex-1 flex-col rounded-xl bg-slate-50 p-5 dark:bg-slate-800/50">
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Что включено
                </h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => {
                    if (feature.value === 'select') {
                      return (
                        <li key={index} className="flex items-center justify-between gap-3">
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {feature.label}
                          </span>
                          <select
                            value={selectedResponses}
                            onChange={(event) => setSelectedResponses(event.target.value)}
                            className="rounded border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-primary-600 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-900 dark:text-primary-300"
                          >
                            {PRICING_RESPONSE_COUNTS.map((count) => (
                              <option key={count} value={count}>
                                {count}
                              </option>
                            ))}
                          </select>
                        </li>
                      )
                    }

                    if (feature.value === 'models' && plan.availableModels) {
                      return (
                        <li key={index} className="text-sm text-slate-600 dark:text-slate-300">
                          <span className="block text-sm text-slate-500 dark:text-slate-400">
                            {feature.label}
                          </span>
                          <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                            {plan.availableModels.map((model) => (
                              <li key={model}>{model}</li>
                            ))}
                          </ul>
                        </li>
                      )
                    }

                    return (
                      <li
                        key={index}
                        className={`flex items-start gap-3 text-sm ${
                          feature.isDisabled
                            ? 'text-slate-400 line-through dark:text-slate-500'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span className="mt-1 grid h-5 w-5 place-items-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-3 w-3"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 5.288a1 1 0 0 1 0 1.414l-7.49 7.49a1 1 0 0 1-1.414 0l-3.004-3.004a1 1 0 1 1 1.414-1.414l2.297 2.297 6.783-6.783a1 1 0 0 1 1.414 0Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        <span>{feature.label}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="mt-6">
                <KwidButton
                  asChild
                  size="md"
                  variant={isUnavailable ? 'outline' : isRecommended ? 'primary' : 'secondary'}
                  disabled={isUnavailable}
                  className="w-full justify-center"
                >
                  <Link href="/register">
                    {isUnavailable ? 'Недоступно' : 'Выбрать план'}
                  </Link>
                </KwidButton>
                <p className="mt-3 text-center text-xs text-slate-500">
                  Нет скрытых платежей. Отмена в один клик.
                </p>
              </div>
            </div>
          )
        })}
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Остались вопросы?
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Напишите на{' '}
            <a
              className="font-medium text-primary-600 hover:underline dark:text-primary-400"
              href="mailto:sales@gptagent.com"
            >
              sales@gptagent.com
            </a>{' '}
            — подберем план и поможем с запуском.
          </p>
          <div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-400">
            <p>Всем тарифам доступны:</p>
            <ul className="space-y-2">
              <li>• Подключение Kommo CRM и вебхуков</li>
              <li>• Управление базой знаний и сценариями</li>
              <li>• Безлимитные агенты-тестировщики</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">FAQ</h2>
          <dl className="space-y-4">
            {PRICING_FAQ.map((item, index) => (
              <div key={index} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                  {item.question}
                </dt>
                <dd className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  )
}

