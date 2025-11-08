"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import {
  CheckIcon,
  UsersIcon,
  FileTextIcon,
  DollarSignIcon,
  FileIcon,
  ImageIcon,
  MessageSquareIcon,
  MailIcon,
  BrainIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@/components/icons"

const COST_PER_CONVERSATION = {
  Launch: {
    monthly: { 1000: "0.06", 2500: null, 5000: null, 10000: null, 15000: null, 20000: null },
    yearly: { 1000: "0.05", 2500: null, 5000: null, 10000: null, 15000: null, 20000: null },
  },
  Scale: {
    monthly: { 1000: "0.16", 2500: "0.15", 5000: "0.14", 10000: "0.14", 15000: "0.13", 20000: "0.13" },
    yearly: { 1000: "0.13", 2500: "0.12", 5000: "0.12", 10000: "0.11", 15000: "0.11", 20000: "0.11" },
  },
  Max: {
    monthly: { 1000: "0.32", 2500: "0.26", 5000: "0.25", 10000: "0.23", 15000: "0.23", 20000: "0.22" },
    yearly: { 1000: "0.26", 2500: "0.22", 5000: "0.20", 10000: "0.19", 15000: "0.19", 20000: "0.19" },
  },
}

const PRICING_TABLE = {
  Launch: {
    monthly: { 1000: 18, 2500: 18, 5000: 18, 10000: 18, 15000: 18, 20000: 18 },
    yearly: { 1000: 15, 2500: 15, 5000: 15, 10000: 15, 15000: 15, 20000: 15 },
  },
  Scale: {
    monthly: { 1000: 45, 2500: 105, 5000: 205, 10000: 390, 15000: 578, 20000: 760 },
    yearly: { 1000: 38, 2500: 88, 5000: 171, 10000: 325, 15000: 482, 20000: 633 },
  },
  Max: {
    monthly: { 1000: 90, 2500: 188, 5000: 350, 10000: 660, 15000: 973, 20000: 1280 },
    yearly: { 1000: 75, 2500: 157, 5000: 292, 10000: 550, 15000: 811, 20000: 1067 },
  },
}

const calculatePrice = (
  tierName: string,
  responseCount: number,
  billingCycle: "monthly" | "yearly",
  isCustom = false,
) => {
  if (isCustom) return null

  const tierPricing = PRICING_TABLE[tierName as keyof typeof PRICING_TABLE]
  if (!tierPricing) return 0

  const cyclePrice = tierPricing[billingCycle]
  return cyclePrice[responseCount as keyof typeof cyclePrice] || 0
}

const getCostPerConversation = (
  tierName: string,
  responseCount: number,
  billingCycle: "monthly" | "yearly",
): string | null => {
  const tierCosts = COST_PER_CONVERSATION[tierName as keyof typeof COST_PER_CONVERSATION]
  if (!tierCosts) return "0.00"

  const cycleCosts = tierCosts[billingCycle]
  return cycleCosts[responseCount as keyof typeof cycleCosts] || null
}

interface PricingTier {
  name: string
  period: string
  description: string
  isCurrent?: boolean
  badge?: string
  icon: React.ReactNode
  features: {
    label: string
    icon: React.ReactNode
    value?: string
    subItems?: string[]
  }[]
}

const getTierFeatures = (tierName: string, responseCount: number): PricingTier["features"] => {
  const baseFeatures: PricingTier["features"] = [
    {
      label:
        tierName === "Launch" ? "1 агентов" : tierName === "Scale" ? "10 агентов" : "Неограниченное количество агентов",
      icon: <UsersIcon className="h-4 w-4" />,
    },
    {
      label:
        tierName === "Launch"
          ? "500 статей базы знаний"
          : tierName === "Scale"
            ? "100,000 статей базы знаний"
            : "Неограниченное количество статей базы знаний",
      icon: <FileTextIcon className="h-4 w-4" />,
    },
    {
      label: `${responseCount.toLocaleString()} $ Ответов / месяц`,
      icon: <DollarSignIcon className="h-4 w-4" />,
    },
  ]

  const commonFeatures: PricingTier["features"] = [
    {
      label:
        tierName === "Max"
          ? "Начальные инструкции агента: До 40,000 символов (2X для моделей Claude)"
          : "Начальные инструкции агента: До 20,000 символов",
      icon: <FileIcon className="h-4 w-4" />,
    },
    {
      label: "Отправка изображений, аудио, видео и документов",
      icon: <ImageIcon className="h-4 w-4" />,
    },
    {
      label: "Входящие голосовые сообщения",
      icon: <MessageSquareIcon className="h-4 w-4" />,
    },
    {
      label: "Входящие сообщения с изображениями",
      icon: <MailIcon className="h-4 w-4" />,
    },
    {
      label: "Обновление полей сделок и контактов",
      icon: <FileIcon className="h-4 w-4" />,
    },
  ]

  if (tierName !== "Launch") {
    commonFeatures.push({
      label: "Доступные модели ИИ:",
      icon: <BrainIcon className="h-4 w-4" />,
      subItems:
        tierName === "Max"
          ? ["OpenAI GPT-4.1", "OpenAI GPT-5", "Google Gemini 2.5 Flash", "Claude Sonnet 4"]
          : ["OpenAI GPT-4.1", "OpenAI GPT-5", "Google Gemini 2.5 Flash"],
    })
  }

  return [...baseFeatures, ...commonFeatures]
}

const faqs = [
  "Могу ли я изменить свой план позже?",
  "Предоставляете ли вы возврат средств?",
  "Что происходит, если я превышу лимиты моего плана?",
  "Нужны ли мне собственные API-ключи OpenAI?",
  "Есть ли дополнительные платежи за разговоры?",
]

export function PricingContentV0() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [responseCount, setResponseCount] = useState(15000)

  const responseCountOptions = [
    { value: 1000, label: "1,000" },
    { value: 2500, label: "2,500" },
    { value: 5000, label: "5,000" },
    { value: 10000, label: "10,000" },
    { value: 15000, label: "15,000" },
    { value: 20000, label: "20,000" },
    { value: 20001, label: "20,000+", isCustom: true },
  ]

  const selectedOption = responseCountOptions.find((opt) => opt.value === responseCount)
  const isCustomPlan = selectedOption?.isCustom || false

  const pricingTiers: PricingTier[] = [
    {
      name: "Launch",
      period: billingCycle === "yearly" ? "/год" : "/месяц",
      description:
        billingCycle === "yearly" ? "Идеально для агентств малого масштаба и стартапов" : "Оплачивается ежемесячно",
      icon: <FileIcon className="h-5 w-5 text-gray-600" />,
      features: getTierFeatures("Launch", responseCount),
    },
    {
      name: "Scale",
      period: billingCycle === "yearly" ? "/год" : "/месяц",
      description: "Оплачивается ежемесячно",
      isCurrent: true,
      badge: "Самый популярный",
      icon: (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
          <span className="text-sm font-bold text-white">S</span>
        </div>
      ),
      features: getTierFeatures("Scale", responseCount),
    },
    {
      name: "Max",
      period: billingCycle === "yearly" ? "/год" : "/месяц",
      description: "Оплачивается ежемесячно",
      icon: <span className="text-2xl">🏆</span>,
      features: getTierFeatures("Max", responseCount),
    },
  ]

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <div className="mx-auto max-w-[1400px] p-8">
        {/* Current Plan Banner */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Ваш текущий план:</span>
                <span className="font-semibold text-blue-600">Scale</span>
                <span className="text-gray-500">(15,000 ответов ИИ в месяц)</span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                  <span>Лицензия истекла: 30.10.2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-gray-400" />
                  <span>Платёжный цикл: {billingCycle === "yearly" ? "Ежегодно" : "Ежемесячно"}</span>
                </div>
                <button
                  onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                  className="text-blue-600 hover:underline"
                >
                  Перейти на {billingCycle === "monthly" ? "годовой" : "месячный"}
                </button>
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: "10%" }} />
                  </div>
                  <span className="text-xs text-gray-600">1,574 из 15,000</span>
                </div>
              </div>
            </div>
            <Button variant="destructive" className="ml-4">
              Управление подпиской
            </Button>
          </div>
        </div>

        {/* Page Header */}
        <h1 className="mb-8 text-3xl font-semibold text-gray-900">Тарифные планы</h1>

        {/* Billing Toggle */}
        <div className="mb-6 flex items-center justify-center gap-4">
          <span className="text-sm text-gray-700">Ответов ИИ:</span>
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={responseCount}
            onChange={(e) => setResponseCount(Number(e.target.value))}
          >
            {responseCountOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="ml-4 inline-flex rounded-lg border border-gray-300 bg-white">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-sm ${billingCycle === "monthly" ? "bg-blue-600 text-white" : "text-gray-700"} rounded-l-lg transition-colors`}
            >
              Ежемесячно
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 text-sm ${billingCycle === "yearly" ? "bg-blue-600 text-white" : "text-gray-700"} rounded-r-lg transition-colors`}
            >
              Ежегодно
            </button>
          </div>
          {billingCycle === "yearly" && <span className="text-sm font-medium text-green-600">Экономия 20%</span>}
        </div>

        {/* Pricing Cards */}
        <div className="mb-12 grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => {
            const price = calculatePrice(tier.name, responseCount, billingCycle, isCustomPlan)
            const showContactUs = price === null && tier.name !== "Launch"

            const costPerConversation = getCostPerConversation(tier.name, responseCount, billingCycle)

            const isLaunchUnavailable = tier.name === "Launch" && responseCount !== 1000

            return (
              <div
                key={tier.name}
                className={`relative rounded-lg border ${tier.isCurrent ? "border-blue-500 shadow-lg" : "border-gray-200"} bg-white p-6 flex flex-col`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="mb-2 flex items-center gap-2">
                    {tier.icon}
                    <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                  </div>
                  <div className="mb-2">
                    {showContactUs ? (
                      <>
                        <h4 className="text-2xl font-bold text-gray-900">Связаться с нами</h4>
                        <p className="text-sm text-gray-600">Оплачивается ежемесячно</p>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-gray-900">${price}</span>
                        <span className="text-gray-600">{tier.period}</span>
                      </>
                    )}
                  </div>
                  {!showContactUs && <p className="text-sm text-gray-600">{tier.description}</p>}
                  {!showContactUs && responseCount > 0 && costPerConversation && !isLaunchUnavailable && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="text-blue-600">💬 Около ${costPerConversation} за разговор</span>
                    </div>
                  )}
                </div>

                <div className="mb-6 space-y-3">
                  <h4 className="text-sm font-medium text-gray-900">Что включено</h4>
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="mt-0.5 text-gray-600">{feature.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 leading-relaxed">{feature.label}</p>
                        {feature.value && <p className="text-xs text-gray-500">{feature.value}</p>}
                        {feature.subItems && (
                          <ul className="mt-1 space-y-1 pl-4">
                            {feature.subItems.map((item, subIdx) => (
                              <li key={subIdx} className="text-xs text-gray-600">
                                • {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <Button
                    disabled={isLaunchUnavailable}
                    className={`w-full ${
                      isLaunchUnavailable
                        ? "bg-white !text-black border-2 border-black hover:bg-white cursor-not-allowed opacity-100"
                        : "bg-black hover:bg-gray-900 text-white"
                    }`}
                  >
                    {isLaunchUnavailable
                      ? "Недоступно"
                      : showContactUs
                        ? "Связаться с нами"
                        : tier.isCurrent
                          ? "Выбрать план"
                          : "Выбрать план"}
                    {!isLaunchUnavailable && !showContactUs && <ChevronRightIcon className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* 30-day Guarantee */}
        <div className="mb-12 rounded-lg border border-gray-200 bg-white p-6 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">30-дневная гарантия возврата денег</h3>
          <p className="text-sm text-gray-600">
            Попробуйте любой план без риска. Если вас что-то не устроит в течение первых 30 дней, мы вернём деньги.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Наша служба поддержки готова помочь вам решить все вопросы или помочь вернуть подписку в любое время.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="mb-4 text-center text-2xl font-semibold text-gray-900">Часто задаваемые вопросы</h2>
          <p className="mb-6 text-center text-sm text-gray-600">
            Найдите ответы на распространённые вопросы о наших тарифах и планах
          </p>
          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <span className="font-medium text-gray-900">{faq}</span>
                  {openFaqIndex === index ? (
                    <ChevronDownIcon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-blue-600" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="border-t border-gray-200 p-4">
                    <p className="text-sm text-gray-600">
                      Ответ на вопрос "{faq}" будет здесь. Это место для подробного описания и пояснений.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
