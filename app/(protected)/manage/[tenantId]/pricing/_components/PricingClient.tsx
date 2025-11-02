"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { KwidButton } from "@/components/kwid";

interface PlanFeature {
  label: string;
  value?: string;
  isDisabled?: boolean;
}

interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: PlanFeature[];
  perConversation?: string;
  availableModels?: string[];
  unavailableForResponses?: number[];
}

const plans: Plan[] = [
  {
    id: "launch",
    name: "Launch",
    priceMonthly: 18,
    priceYearly: 13,
    features: [
      { label: "1 агентов" },
      { label: "500 статей базы знаний" },
      { label: "Ответов / месяц", value: "select" },
      { label: "Начальные инструкции агента: До 20,000 символов" },
      { label: "Отправка изображений, аудио, видео и документов" },
      { label: "Входящие сообщения с изображениями" },
      { label: "Входящие голосовые сообщения" },
      { label: "Обновление полей сделок и контактов", isDisabled: true },
      { label: "Доступные модели ИИ:", value: "models", isDisabled: true },
    ],
    unavailableForResponses: [20000],
    availableModels: ["OpenAI GPT-4.1", "OpenAI GPT-5"],
  },
  {
    id: "scale",
    name: "Scale",
    priceMonthly: 578,
    priceYearly: 499,
    perConversation: "Около $0.13 за разговор",
    features: [
      { label: "10 агентов" },
      { label: "100,000 статей базы знаний" },
      { label: "Ответов / месяц", value: "select" },
      { label: "Начальные инструкции агента: До 20,000 символов" },
      { label: "Отправка изображений, аудио, видео и документов" },
      { label: "Входящие сообщения с изображениями" },
      { label: "Входящие голосовые сообщения" },
      { label: "Обновление полей сделок и контактов" },
      { label: "Доступные модели ИИ:", value: "models" },
    ],
    availableModels: ["OpenAI GPT-4.1", "OpenAI GPT-5", "Google Gemini 2.5 Flash", "Claude Sonnet 4"],
  },
  {
    id: "max",
    name: "Max",
    priceMonthly: 973,
    priceYearly: 799,
    perConversation: "Около $0.23 за разговор",
    features: [
      { label: "Неограниченное количество агентов" },
      { label: "Неограниченное количество статей базы знаний" },
      { label: "Ответов / месяц", value: "select" },
      { label: "Начальные инструкции агента: До 40,000 символов (20k для моделей Claude)" },
      { label: "Отправка изображений, аудио, видео и документов" },
      { label: "Входящие сообщения с изображениями" },
      { label: "Входящие голосовые сообщения" },
      { label: "Обновление полей сделок и контактов" },
      { label: "Доступные модели ИИ:", value: "models" },
    ],
    availableModels: ["OpenAI GPT-4.1", "OpenAI GPT-5", "Google Gemini 2.5 Flash", "Claude Sonnet 4"],
  },
];

const responseCounts = ["1,000", "2,500", "5,000", "10,000", "15,000", "20,000", "20,000+"];

const faqItems = [
  {
    question: "Могу ли я изменить свой план позже?",
    answer: 'Да, вы можете сменить план в любое время в разделе "Управление подпиской".',
  },
  {
    question: "Предоставляете ли вы возврат средств?",
    answer: "В течение 30 дней мы гарантируем возврат средств, если вас что-то не устроит.",
  },
  {
    question: "Что произойдет, если я превышу лимиты моего плана?",
    answer: "Мы уведомим вас и предложим активировать новый план или увеличить лимиты.",
  },
  {
    question: "Нужны ли мне собственные API‑ключи OpenAI?",
    answer: "Нет, все модели уже включены в подписку.",
  },
  {
    question: "Есть ли дополнительные платежи за разговоры?",
    answer: "Стоимость уже рассчитана исходя из лимитов. Дополнительные платежи не требуются.",
  },
];

interface SubscriptionData {
  plan: string;
  status: string;
  tokenQuota: number;
  tokenUsed: number;
  renewsAt: string | null;
}

interface PricingClientProps {
  tenantId: string;
}

export const PricingClient = ({ tenantId }: PricingClientProps) => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedResponses, setSelectedResponses] = useState("15,000");
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    try {
      const response = await fetch("/api/subscriptions");
      if (response.ok) {
        const payload = (await response.json()) as {
          success: boolean;
          data: SubscriptionData | null;
        };
        if (payload.success && payload.data) {
          setSubscription(payload.data);
          setSelectedResponses(payload.data.tokenQuota.toLocaleString("ru-RU"));
        }
      }
    } catch (error) {
      console.error("Failed to fetch subscription", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const currentPlan = useMemo(() => {
    if (!subscription) {
      return plans.find((plan) => plan.id === "scale");
    }
    return plans.find((plan) => plan.id === subscription.plan.toLowerCase());
  }, [subscription]);

  const formatPrice = (plan: Plan) => {
    if (billingCycle === "monthly") {
      return plan.priceMonthly;
    }
    return plan.priceYearly;
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) {
      return "—";
    }
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatResetDate = (dateString: string | null): string => {
    if (!dateString) {
      return "—";
    }
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  const usagePercentage = subscription
    ? Math.round((subscription.tokenUsed / subscription.tokenQuota) * 100)
    : 0;

  const nextResetDate = subscription?.renewsAt
    ? formatResetDate(subscription.renewsAt)
    : formatResetDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());

  const selectedResponsesNum = Number.parseInt(selectedResponses.replace(/,/g, ""), 10);
  const isUnavailableForPlan = (plan: Plan) => {
    if (!plan.unavailableForResponses) return false;
    return plan.unavailableForResponses.includes(selectedResponsesNum);
  };

  if (isLoading) {
    return (
      <section className="flex flex-col gap-y-8 py-8">
        <header className="fi-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="fi-header-heading text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Тарифные планы
          </h1>
        </header>
        <div className="text-center text-gray-500 dark:text-gray-400">Загрузка...</div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-y-8 py-8">
      <header className="fi-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="fi-header-heading text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
          Тарифные планы
        </h1>
      </header>

      {subscription && (
        <div className="p-4 rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
          <div className="flex justify-between items-center gap-4 mb-4">
            <div>
              <h2 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                Ваш текущий план:
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-primary-600 dark:text-primary-400">
                  {currentPlan?.name ?? subscription.plan} ({subscription.tokenQuota.toLocaleString("ru-RU")} ответов ИИ в месяц)
                </span>
                {billingCycle === "monthly" && (
                  <button
                    type="button"
                    onClick={() => setBillingCycle("yearly")}
                    className="text-xs inline-flex items-center px-2 py-1 ml-2 bg-primary-100 text-primary-800 hover:bg-primary-200 dark:bg-primary-900/40 dark:text-primary-300 dark:hover:bg-primary-900/60 rounded-full transition-colors"
                  >
                    Перейти на годовой
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-600 dark:text-gray-400">
                {subscription.renewsAt && (
                  <div className="flex items-center gap-1">
                    <span>Лицензия истекла:</span>
                    <span className="text-red-600 dark:text-red-400">{formatDate(subscription.renewsAt)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <span>Платежный цикл:</span>
                  <span>{billingCycle === "monthly" ? "Ежемесячно" : "Ежегодно"}</span>
                </div>
              </div>
            </div>
            <div>
              <KwidButton
                variant="danger"
                size="md"
                style={{
                  '--c-400': 'var(--danger-400)',
                  '--c-500': 'var(--danger-500)',
                  '--c-600': 'var(--danger-600)',
                } as React.CSSProperties}
                className="fi-color-custom"
              >
                <span className="fi-btn-label">Управление подпиской</span>
              </KwidButton>
            </div>
          </div>

          <div className="flex items-center justify-between mb-1 text-xs">
            <span>
              Использовано: {subscription.tokenUsed.toLocaleString("ru-RU")} из{" "}
              {subscription.tokenQuota.toLocaleString("ru-RU")} (Сбросится: {nextResetDate})
            </span>
            <span className="text-gray-500 dark:text-gray-500">{usagePercentage}% использовано</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                usagePercentage >= 100
                  ? "bg-red-500 dark:bg-red-600"
                  : usagePercentage >= 80
                    ? "bg-yellow-500 dark:bg-yellow-600"
                    : "bg-primary-600 dark:bg-primary-500"
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="p-4 rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center gap-4 mb-6">
          <span className="pl-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Ответов ИИ:
          </span>
          <select
            value={selectedResponses}
            onChange={(e) => setSelectedResponses(e.target.value)}
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0 rounded-full pr-8 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none hover:cursor-pointer"
          >
            {responseCounts.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 text-sm font-medium transition duration-200 ${
                billingCycle === "monthly"
                  ? "bg-primary-500 text-white shadow"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Ежемесячно
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2.5 text-sm font-medium transition duration-200 ${
                billingCycle === "yearly"
                  ? "bg-primary-500 text-white shadow"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Ежегодно
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrent = subscription && plan.id === subscription.plan.toLowerCase();
          const isUnavailable = isUnavailableForPlan(plan);
          const price = formatPrice(plan);

          return (
            <div
              key={plan.id}
              className={`p-6 relative flex flex-col ${
                isCurrent
                  ? "bg-primary-50 dark:bg-primary-900/20"
                  : isUnavailable
                    ? ""
                    : ""
              }`}
            >
              <div className="flex items-center mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{plan.name}</h3>
              </div>

              <div className="mt-5 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  ${price}
                </span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">/месяц</span>
              </div>

              {plan.perConversation && (
                <div className="mt-2 inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300">
                  {plan.perConversation}
                </div>
              )}

              {isUnavailable && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Недоступно для этого количества ответов
                </p>
              )}

              {billingCycle === "monthly" && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Оплачивается ежемесячно</p>
              )}

              <h3 className="font-medium text-gray-900 dark:text-white pb-4 mt-6">Что включено</h3>

              <div className="flex-grow p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => {
                    if (feature.value === "select") {
                      const responseNum = selectedResponsesNum;
                      const isHighlighted = plan.id === "scale";
                      return (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">{feature.label}</span>
                          <select
                            value={selectedResponses}
                            onChange={(e) => setSelectedResponses(e.target.value)}
                            className={`text-sm border rounded px-2 py-1 pr-6 w-20 focus:ring-1 focus:outline-none hover:cursor-pointer ${
                              isHighlighted
                                ? "bg-gray-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 border-gray-200 dark:border-gray-600 focus:ring-primary-500"
                                : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 focus:ring-gray-500"
                            }`}
                            style={{
                              backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%236b7280' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>")`,
                              backgroundPosition: "right 0.5rem center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "0.65rem",
                            }}
                          >
                            {responseCounts.map((count) => (
                              <option key={count} value={count}>
                                {count}
                              </option>
                            ))}
                          </select>
                        </li>
                      );
                    }
                    if (feature.value === "models" && plan.availableModels) {
                      return (
                        <li key={idx} className="px-3">
                          <span className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">
                            {feature.label}
                          </span>
                          <ul className="space-y-1">
                            {plan.availableModels.map((model) => (
                              <li key={model} className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                {model}
                              </li>
                            ))}
                          </ul>
                        </li>
                      );
                    }
                    return (
                      <li key={idx} className={`px-3 ${feature.isDisabled ? "opacity-50" : ""}`}>
                        <span className={`text-sm ${feature.isDisabled ? "text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-300"}`}>
                          {feature.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex items-center justify-center mt-6">
                <KwidButton
                  variant={isCurrent ? "primary" : "secondary"}
                  size="md"
                  disabled={isCurrent || isUnavailable}
                  style={
                    isCurrent
                      ? ({
                          '--c-400': 'var(--primary-400)',
                          '--c-500': 'var(--primary-500)',
                          '--c-600': 'var(--primary-600)',
                        } as React.CSSProperties)
                      : {}
                  }
                  className={isCurrent ? "fi-color-custom" : ""}
                >
                  <span className="fi-btn-label">
                    {isCurrent ? "Текущий план" : isUnavailable ? "Недоступно" : "Выбрать план"}
                  </span>
                </KwidButton>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-14 pb-14">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Часто задаваемые вопросы
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
            Найдите ответы на распространенные вопросы о наших тарифах и планах
          </p>
          <div className="h-1 w-20 bg-primary-500 mx-auto mt-6 rounded-full" />
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {faqItems.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-5 flex items-center justify-center">
          <div className="inline-flex items-center justify-center rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
            <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          30-дневная гарантия возврата денег
        </h3>
        <p className="text-sm py-1 text-gray-600 dark:text-gray-300">
          Попробуйте любой план без риска. Если вас что-то не устроит в течение первых 30 дней, мы вернём деньги.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Наша служба поддержки готова помочь вам сменить план или отменить подписку в любое время.
        </p>
      </div>
    </section>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full px-8 py-6 text-left focus:outline-none"
      >
        <span className="text-lg font-medium text-gray-900 dark:text-white">{question}</span>
        <div className={`rounded-full p-1.5 flex items-center justify-center transition-colors ${
          open 
            ? "bg-primary-50 dark:bg-primary-900/30" 
            : "bg-gray-50 dark:bg-gray-800"
        }`}>
          {open ? (
            <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </div>
      </button>
      {open && (
        <div className="px-8 pb-6 text-sm text-gray-600 dark:text-gray-300">
          {answer}
        </div>
      )}
    </div>
  );
};