export interface PricingPlanFeature {
 label: string;
 value?: string;
 isDisabled?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  // Динамическая цена на основе количества ответов
  calculatePrice?: (responses: number, billingCycle: 'monthly' | 'yearly') => number;
  features: PricingPlanFeature[];
  perConversation?: string;
  // Динамический расчет цены за разговор на основе количества ответов
  calculatePerConversation?: (responses: number, billingCycle: 'monthly' | 'yearly') => string | null;
  availableModels?: string[];
  unavailableForResponses?: number[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "launch",
    name: "Launch",
    priceMonthly: 18,
    priceYearly: 13,
    // Launch - фиксированная цена $18, не зависит от количества ответов
    calculatePrice: (responses: number, billingCycle: 'monthly' | 'yearly') => {
      return billingCycle === 'monthly' ? 18 : 13;
    },
    perConversation: "Около $0.06 за разговор", // Fallback для старых версий
    calculatePerConversation: (responses: number, billingCycle: 'monthly' | 'yearly') => {
      // Launch доступен только для 1,000 ответов
      if (responses > 1000) return null; // Недоступно для большего количества
      
      const cost = billingCycle === 'monthly' ? "0.06" : "0.05";
      return `Около $${cost} за разговор`;
    },
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
    unavailableForResponses: [5000, 10000, 15000, 20000, 20001], // Недоступен для всех кроме 1,000 и 2,500
    availableModels: ["OpenAI GPT-4.1", "OpenAI GPT-5"],
  },
  {
    id: "scale",
    name: "Scale",
    priceMonthly: 578, // Для 15,000 ответов (базовая цена)
    priceYearly: 499,
    // Scale - динамическая цена на основе данных KWID
    // Формула: базовая цена + (ответы * множитель)
    // Данные: 1K=$45, 5K=$205, 15K=$578, 20K=$760
    calculatePrice: (responses: number, billingCycle: 'monthly' | 'yearly') => {
      if (billingCycle === 'yearly') {
        // Для годового используем скидку ~15%
        const basePrice = 25;
        const pricePerResponse = 0.032;
        return Math.round(basePrice + (responses * pricePerResponse));
      }
      // Для месячного: базовая $8 + $0.0376 за ответ (более точная формула)
      const basePrice = 8;
      const pricePerResponse = 0.0376;
      const calculated = basePrice + (responses * pricePerResponse);
      return Math.round(calculated);
    },
    perConversation: "Около $0.13 за разговор", // Fallback для старых версий
    calculatePerConversation: (responses: number, billingCycle: 'monthly' | 'yearly') => {
      // Данные тарифного плана
      const COST_PER_CONVERSATION: Record<string, Record<string, Record<number, string | null>>> = {
        Scale: {
          monthly: { 1000: "0.16", 2500: "0.15", 5000: "0.14", 10000: "0.14", 15000: "0.13", 20000: "0.13" },
          yearly: { 1000: "0.13", 2500: "0.12", 5000: "0.12", 10000: "0.11", 15000: "0.11", 20000: "0.11" },
        },
      };
      
      const costs = COST_PER_CONVERSATION.Scale[billingCycle];
      // Находим ближайшее значение или используем последнее доступное
      const responseKeys = Object.keys(costs).map(Number).sort((a, b) => a - b);
      let selectedKey = responseKeys[0];
      
      for (const key of responseKeys) {
        if (responses <= key) {
          selectedKey = key;
          break;
        }
        selectedKey = key; // Используем последнее доступное
      }
      
      const cost = costs[selectedKey];
      return cost ? `Около $${cost} за разговор` : null;
    },
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
    availableModels: [
      "OpenAI GPT-4.1",
      "OpenAI GPT-5",
      "Google Gemini 2.5 Flash",
    ],
  },
  {
    id: "max",
    name: "Max",
    priceMonthly: 973, // Для 15,000 ответов (базовая цена)
    priceYearly: 799,
    // Max - динамическая цена на основе данных KWID
    // Формула: базовая цена + (ответы * множитель)
    // Данные: 1K=$90, 5K=$350, 15K=$973, 20K=$1,280
    calculatePrice: (responses: number, billingCycle: 'monthly' | 'yearly') => {
      if (billingCycle === 'yearly') {
        // Для годового используем скидку ~15%
        const basePrice = 35;
        const pricePerResponse = 0.053;
        return Math.round(basePrice + (responses * pricePerResponse));
      }
      // Для месячного: базовая $27 + $0.0626 за ответ (более точная формула)
      const basePrice = 27;
      const pricePerResponse = 0.0626;
      const calculated = basePrice + (responses * pricePerResponse);
      return Math.round(calculated);
    },
    perConversation: "Около $0.23 за разговор", // Fallback для старых версий
    calculatePerConversation: (responses: number, billingCycle: 'monthly' | 'yearly') => {
      // Данные тарифного плана
      const COST_PER_CONVERSATION: Record<string, Record<string, Record<number, string | null>>> = {
        Max: {
          monthly: { 1000: "0.32", 2500: "0.26", 5000: "0.25", 10000: "0.23", 15000: "0.23", 20000: "0.22" },
          yearly: { 1000: "0.26", 2500: "0.22", 5000: "0.20", 10000: "0.19", 15000: "0.19", 20000: "0.19" },
        },
      };
      
      const costs = COST_PER_CONVERSATION.Max[billingCycle];
      // Находим ближайшее значение или используем последнее доступное
      const responseKeys = Object.keys(costs).map(Number).sort((a, b) => a - b);
      let selectedKey = responseKeys[0];
      
      for (const key of responseKeys) {
        if (responses <= key) {
          selectedKey = key;
          break;
        }
        selectedKey = key; // Используем последнее доступное
      }
      
      const cost = costs[selectedKey];
      return cost ? `Около $${cost} за разговор` : null;
    },
    features: [
      { label: "Неограниченное количество агентов" },
      { label: "Неограниченное количество статей базы знаний" },
      { label: "Ответов / месяц", value: "select" },
      {
        label:
          "Начальные инструкции агента: До 40,000 символов (20k для моделей Claude)",
      },
      { label: "Отправка изображений, аудио, видео и документов" },
      { label: "Входящие сообщения с изображениями" },
      { label: "Входящие голосовые сообщения" },
      { label: "Обновление полей сделок и контактов" },
      { label: "Доступные модели ИИ:", value: "models" },
    ],
    availableModels: [
      "OpenAI GPT-4.1",
      "OpenAI GPT-5",
      "Google Gemini 2.5 Flash",
      "Claude Sonnet 4",
    ],
  },
];

export const PRICING_RESPONSE_COUNTS = [
 "1,000",
 "2,500",
 "5,000",
 "10,000",
 "15,000",
 "20,000",
 "20,000+",
];

export const PRICING_FAQ = [
 {
 question: "Могу ли я изменить свой план позже?",
 answer:
 'Да, вы можете сменить план в любое время в разделе "Управление подпиской".',
 },
 {
 question: "Предоставляете ли вы возврат средств?",
 answer:
 "В течение 30 дней мы гарантируем возврат средств, если вас что-то не устроит.",
 },
 {
 question: "Что произойдет, если я превышу лимиты моего плана?",
 answer:
 "Мы уведомим вас и предложим активировать новый план или увеличить лимиты.",
 },
 {
 question: "Нужны ли мне собственные API‑ключи OpenAI?",
 answer: "Нет, все модели уже включены в подписку.",
 },
 {
 question: "Есть ли дополнительные платежи за разговоры?",
 answer:
 "Стоимость уже рассчитана исходя из лимитов. Дополнительные платежи не требуются.",
 },
];
