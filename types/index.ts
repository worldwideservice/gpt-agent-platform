export interface AgentSettings {
 language?: string
 welcomeMessage?: string
 description?: string
 presencePenalty?: number
 frequencyPenalty?: number
 defaultChannels?: string[]
 maxResponseLength?: number
 enableMarkdown?: boolean
 knowledgeBaseAllCategories?: boolean
 createTaskOnNotFound?: boolean
 notFoundMessage?: string
 checkBeforeSending?: boolean
 dealFields?: string[]
 contactFields?: string[]
}

export interface Agent {
 id: string
 name: string
 status: 'active' | 'inactive' | 'draft'
 model: string | null
 messagesTotal: number
 lastActivityAt: string | null
 ownerName: string | null
 createdAt: string
 updatedAt: string
 temperature: number
 maxTokens: number
 responseDelaySeconds: number
 instructions?: string | null
 settings: AgentSettings
}

export interface DashboardStats {
 monthlyResponses: number
 monthlyChange: number
 weeklyResponses: number
 todayResponses: number
  todayChange?: number // Изменение для "Today's AI Responses" vs yesterday
 totalAgents: number
}

export interface KnowledgeBaseCategory {
 id: string
 name: string
 articlesCount: number
 createdAt: Date
 description: string | null
 parentId: string | null
}

export interface KnowledgeBaseArticle {
 id: string
 title: string
 categoryId: string | null
 content: string
 slug: string | null
 isPublished: boolean
 viewsCount: number
 createdAt: Date
 updatedAt: Date
}

export interface KnowledgeBaseStatsSummary {
 categoriesCount: number
 publishedArticlesCount: number
 pendingAssetsCount: number
}

export interface Integration {
 id: string
 name: string
 type: 'kommo' | 'telegram' | 'whatsapp' | 'facebook' | 'email'
 status: 'connected' | 'disconnected'
 isActive: boolean
}

export interface ChatMessage {
 id: string
 role: 'user' | 'assistant'
 content: string
 timestamp: Date
}

export interface PricingPlan {
 id: string
 name: string
 price: number
 currency: string
 limits: {
 agents: number
 monthlyResponses: number
 knowledgeBase: number
 }
 features: string[]
}

export interface Notification {
 id: string
 orgId: string
 userId: string | null
 type: 'info' | 'warning' | 'error' | 'success'
 title: string
 message: string | null
 linkUrl: string | null
 linkText: string | null
 isRead: boolean
 metadata: Record<string, unknown>
 createdAt: string
}
