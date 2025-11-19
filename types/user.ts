import { UserTier } from '@/lib/rate-limit'

export { UserTier }

export interface DatabaseUser {
    id: string
    email: string
    full_name?: string
    password_hash?: string
    default_org_id?: string
    avatar_url?: string
    locale?: string
    invited_at?: string
    last_sign_in_at?: string
    created_at: string
    updated_at: string
}

export interface User {
    id: string
    email: string
    name?: string
    image?: string
    orgId?: string
    tier: UserTier
    subscription?: Subscription
    createdAt: Date
    updatedAt: Date
}

export interface Subscription {
    id: string
    userId: string
    planId: string
    status: 'active' | 'canceled' | 'past_due' | 'incomplete'
    currentPeriodStart: Date
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
    paddleSubscriptionId?: string
    createdAt: Date
    updatedAt: Date
}

export interface Plan {
    id: string
    name: string
    description: string
    tier: UserTier
    price: number
    currency: string
    interval: 'month' | 'year'
    features: string[]
    paddlePriceId?: string
    isPopular?: boolean
    maxAgents: number
    maxKnowledgeBases: number
    maxMonthlyRequests: number
    maxMonthlyMessages: number
    maxStorageGB: number
    supportLevel: 'basic' | 'priority' | 'dedicated'
}

export const DEFAULT_PLANS: Plan[] = [
    {
        id: 'free',
        name: 'Бесплатный',
        description: 'Идеально для тестирования и небольших проектов',
        tier: UserTier.FREE,
        price: 0,
        currency: 'RUB',
        interval: 'month',
        features: [
            'До 3 AI агентов',
            'До 1 базы знаний',
            '50 API запросов в минуту',
            '10 сообщений в чате в минуту',
            '5 загрузок файлов в час',
            'Базовая поддержка',
        ],
        maxAgents: 3,
        maxKnowledgeBases: 1,
        maxMonthlyRequests: 10000,
        maxMonthlyMessages: 1000,
        maxStorageGB: 1,
        supportLevel: 'basic',
    },
    {
        id: 'premium',
        name: 'Премиум',
        description: 'Для растущего бизнеса и команд',
        tier: UserTier.PREMIUM,
        price: 2990,
        currency: 'RUB',
        interval: 'month',
        features: [
            'До 20 AI агентов',
            'До 10 баз знаний',
            '200 API запросов в минуту',
            '50 сообщений в чате в минуту',
            '50 загрузок файлов в час',
            'Приоритетная поддержка',
            'Расширенная аналитика',
            'Экспорт данных',
        ],
        maxAgents: 20,
        maxKnowledgeBases: 10,
        maxMonthlyRequests: 100000,
        maxMonthlyMessages: 10000,
        maxStorageGB: 10,
        supportLevel: 'priority',
        isPopular: true,
    },
    {
        id: 'vip',
        name: 'VIP',
        description: 'Максимальные возможности для крупных компаний',
        tier: UserTier.VIP,
        price: 9990,
        currency: 'RUB',
        interval: 'month',
        features: [
            'Неограниченное количество AI агентов',
            'Неограниченное количество баз знаний',
            '1000 API запросов в минуту',
            '200 сообщений в чате в минуту',
            '200 загрузок файлов в час',
            'Выделенная поддержка 24/7',
            'Пользовательские интеграции',
            'SLA гарантии',
            'Персональный менеджер',
        ],
        maxAgents: -1, // unlimited
        maxKnowledgeBases: -1, // unlimited
        maxMonthlyRequests: 1000000,
        maxMonthlyMessages: 100000,
        maxStorageGB: 100,
        supportLevel: 'dedicated',
    },
]

export interface UserLimits {
    maxAgents: number
    maxKnowledgeBases: number
    maxMonthlyRequests: number
    maxMonthlyMessages: number
    maxStorageGB: number
    supportLevel: 'basic' | 'priority' | 'dedicated'
}

export function getUserLimits(tier: UserTier): UserLimits {
    const plan = DEFAULT_PLANS.find(p => p.tier === tier)
    if (!plan) {
        return DEFAULT_PLANS[0] // fallback to free plan
    }

    return {
        maxAgents: plan.maxAgents,
        maxKnowledgeBases: plan.maxKnowledgeBases,
        maxMonthlyRequests: plan.maxMonthlyRequests,
        maxMonthlyMessages: plan.maxMonthlyMessages,
        maxStorageGB: plan.maxStorageGB,
        supportLevel: plan.supportLevel,
    }
}
