import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock services
vi.mock('@/lib/services/analytics', () => ({
  generateDashboardStats: vi.fn(),
}))

describe('API: /api/analytics/export', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/analytics/export', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/analytics/export/route')
      const request = new NextRequest('http://localhost:3000/api/analytics/export')
      const response = await route.GET(request)

      expect(response.status).toBe(401)
    })

    it('should export analytics as CSV', async () => {
      const { auth } = await import('@/auth')
      const { generateDashboardStats } = await import('@/lib/services/analytics')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockStats = {
        totalAgents: 10,
        activeAgents: 8,
        totalConversations: 100,
        totalMessages: 500,
        totalTokensUsed: 10000,
        averageResponseTime: 1.5,
        successRate: 95.5,
        performanceMetrics: {
          averageFirstResponseTime: 0.5,
          averageResolutionTime: 2.0,
          customerSatisfaction: 0.9,
          automationRate: 0.8,
        },
        topPerformingAgents: [
          {
            name: 'Agent 1',
            conversationsCount: 50,
            messagesCount: 250,
            tokensUsed: 5000,
          },
        ],
        usageByPeriod: [
          {
            period: '2024-01',
            conversations: 50,
            messages: 250,
            tokens: 5000,
          },
        ],
      }

      vi.mocked(generateDashboardStats).mockResolvedValue(mockStats as any)

      const route = await import('@/app/api/analytics/export/route')
      const request = new NextRequest('http://localhost:3000/api/analytics/export?range=7d')
      const response = await route.GET(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toContain('text/csv')
      expect(response.headers.get('Content-Disposition')).toContain('attachment')
      
      const text = await response.text()
      expect(text).toContain('Метрика,Значение')
      expect(text).toContain('Всего агентов,10')
    })

    it('should handle different date ranges', async () => {
      const { auth } = await import('@/auth')
      const { generateDashboardStats } = await import('@/lib/services/analytics')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(generateDashboardStats).mockResolvedValue({
        totalAgents: 0,
        activeAgents: 0,
        totalConversations: 0,
        totalMessages: 0,
        totalTokensUsed: 0,
        averageResponseTime: 0,
        successRate: 0,
        performanceMetrics: {
          averageFirstResponseTime: 0,
          averageResolutionTime: 0,
          customerSatisfaction: 0,
          automationRate: 0,
        },
        topPerformingAgents: [],
        usageByPeriod: [],
      } as any)

      const route = await import('@/app/api/analytics/export/route')
      const request = new NextRequest('http://localhost:3000/api/analytics/export?range=30d')
      const response = await route.GET(request)

      expect(response.status).toBe(200)
      expect(generateDashboardStats).toHaveBeenCalled()
    })

    it('should return 400 for invalid range', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/analytics/export/route')
      const request = new NextRequest('http://localhost:3000/api/analytics/export?range=invalid')
      const response = await route.GET(request)

      expect(response.status).toBe(400)
    })
  })
})

