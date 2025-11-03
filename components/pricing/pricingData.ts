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
 features: PricingPlanFeature[];
 perConversation?: string;
 availableModels?: string[];
 unavailableForResponses?: number[];
}

export const PRICING_PLANS: PricingPlan[] = [
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
 availableModels: [
 "OpenAI GPT-4.1",
 "OpenAI GPT-5",
 "Google Gemini 2.5 Flash",
 "Claude Sonnet 4",
 ],
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
