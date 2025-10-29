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
}

export interface DashboardStats {
  monthlyResponses: number
  monthlyChange: number
  weeklyResponses: number
  todayResponses: number
  totalAgents: number
}

export interface KnowledgeBaseCategory {
  id: string
  name: string
  articlesCount: number
  createdAt: Date
}

export interface KnowledgeBaseArticle {
  id: string
  title: string
  categoryId: string
  content: string
  createdAt: Date
  updatedAt: Date
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

