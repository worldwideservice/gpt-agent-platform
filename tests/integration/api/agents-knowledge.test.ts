import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/agents', () => ({
  getAgentById: vi.fn(),
}))

vi.mock('@/lib/repositories/company-knowledge', () => ({
  getCompanyKnowledgeForContext: vi.fn(),
  createCompanyKnowledge: vi.fn(),
}))

describe('API: /api/agents/[id]/knowledge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents/[id]/knowledge', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return knowledge for agent', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getCompanyKnowledgeForContext } = await import('@/lib/repositories/company-knowledge')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      const mockKnowledge = [
        {
          id: 'knowledge-1',
          category: 'product',
          title: 'Product Info',
          content: 'Product details',
        },
      ]

      vi.mocked(getCompanyKnowledgeForContext).mockResolvedValue(mockKnowledge as any)

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockKnowledge)
    })

    it('should filter knowledge by category', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getCompanyKnowledgeForContext } = await import('@/lib/repositories/company-knowledge')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      vi.mocked(getCompanyKnowledgeForContext).mockResolvedValue([])

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge?category=product')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should return 404 if agent not found', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
    })
  })

  describe('POST /api/agents/[id]/knowledge', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge', {
        method: 'POST',
        body: JSON.stringify({
          category: 'product',
          title: 'Test',
          content: 'Test content',
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should create knowledge', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { createCompanyKnowledge } = await import('@/lib/repositories/company-knowledge')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      const mockKnowledge = {
        id: 'knowledge-123',
        category: 'product',
        title: 'Test Knowledge',
        content: 'Test content',
      }

      vi.mocked(createCompanyKnowledge).mockResolvedValue(mockKnowledge as any)

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge', {
        method: 'POST',
        body: JSON.stringify({
          category: 'product',
          title: 'Test Knowledge',
          content: 'Test content',
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockKnowledge)
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required fields
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })
})

