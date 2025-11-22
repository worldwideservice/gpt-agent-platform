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
    it('должен вернуть 401 если не авторизован', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge')

      const response = await route.GET(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('должен вернуть 404 если агент не найден', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-999/knowledge')

      const response = await route.GET(request, { params: Promise.resolve({ id: 'agent-999' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Агент не найден')
    })

    it('должен вернуть знания агента', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getCompanyKnowledgeForContext } = await import('@/lib/repositories/company-knowledge')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        name: 'Тестовый агент',
        org_id: 'org-123',
      } as any)

      const mockKnowledge = [
        {
          id: 'know-1',
          category: 'product',
          title: 'Продукт A',
          content: 'Описание продукта A',
        },
        {
          id: 'know-2',
          category: 'service',
          title: 'Услуга B',
          content: 'Описание услуги B',
        },
      ]

      vi.mocked(getCompanyKnowledgeForContext).mockResolvedValue(mockKnowledge as any)

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge')

      const response = await route.GET(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(2)
      expect(data.data[0].title).toBe('Продукт A')
      expect(getCompanyKnowledgeForContext).toHaveBeenCalledWith('org-123', 'agent-123', null, undefined)
    })

    it('должен фильтровать по категории', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getCompanyKnowledgeForContext } = await import('@/lib/repositories/company-knowledge')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      vi.mocked(getCompanyKnowledgeForContext).mockResolvedValue([])

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge?category=product')

      const response = await route.GET(request, { params: Promise.resolve({ id: 'agent-123' }) })

      expect(response.status).toBe(200)
      expect(getCompanyKnowledgeForContext).toHaveBeenCalledWith(
        'org-123',
        'agent-123',
        null,
        ['product'],
      )
    })

    it('должен фильтровать по stageId', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getCompanyKnowledgeForContext } = await import('@/lib/repositories/company-knowledge')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      vi.mocked(getCompanyKnowledgeForContext).mockResolvedValue([])

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge?stageId=stage-456')

      const response = await route.GET(request, { params: Promise.resolve({ id: 'agent-123' }) })

      expect(response.status).toBe(200)
      expect(getCompanyKnowledgeForContext).toHaveBeenCalledWith(
        'org-123',
        'agent-123',
        'stage-456',
        undefined,
      )
    })

    it('должен вернуть 500 при ошибке БД', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getCompanyKnowledgeForContext } = await import('@/lib/repositories/company-knowledge')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      vi.mocked(getCompanyKnowledgeForContext).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge')

      const response = await route.GET(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })

  describe('POST /api/agents/[id]/knowledge', () => {
    it('должен вернуть 401 если не авторизован', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge', {
        method: 'POST',
        body: JSON.stringify({
          category: 'product',
          title: 'Новый продукт',
          content: 'Описание продукта',
        }),
      })

      const response = await route.POST(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('должен вернуть 404 если агент не найден', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-999/knowledge', {
        method: 'POST',
        body: JSON.stringify({
          category: 'product',
          title: 'Новый продукт',
          content: 'Описание продукта',
        }),
      })

      const response = await route.POST(request, { params: Promise.resolve({ id: 'agent-999' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
    })

    it('должен создать знание для агента', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { createCompanyKnowledge } = await import('@/lib/repositories/company-knowledge')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      const createdKnowledge = {
        id: 'know-new',
        category: 'product',
        title: 'Новый продукт',
        content: 'Описание продукта',
        org_id: 'org-123',
        agent_id: 'agent-123',
      }

      vi.mocked(createCompanyKnowledge).mockResolvedValue(createdKnowledge as any)

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge', {
        method: 'POST',
        body: JSON.stringify({
          category: 'product',
          title: 'Новый продукт',
          content: 'Описание продукта',
        }),
      })

      const response = await route.POST(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.title).toBe('Новый продукт')
      expect(createCompanyKnowledge).toHaveBeenCalledWith(
        'org-123',
        expect.objectContaining({
          agentId: 'agent-123',
          category: 'product',
          title: 'Новый продукт',
          content: 'Описание продукта',
        }),
      )
    })

    it('должен вернуть 400 при некорректных данных', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
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
          category: 'invalid_category', // неверная категория
          title: '',
          content: '',
        }),
      })

      const response = await route.POST(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
    })

    it('должен создать знание с метаданными', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { createCompanyKnowledge } = await import('@/lib/repositories/company-knowledge')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      vi.mocked(createCompanyKnowledge).mockResolvedValue({
        id: 'know-new',
        metadata: { price: 1000, currency: 'RUB' },
      } as any)

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge', {
        method: 'POST',
        body: JSON.stringify({
          category: 'product',
          title: 'Продукт с ценой',
          content: 'Описание',
          metadata: {
            price: 1000,
            currency: 'RUB',
          },
        }),
      })

      const response = await route.POST(request, { params: Promise.resolve({ id: 'agent-123' }) })

      expect(response.status).toBe(200)
      expect(createCompanyKnowledge).toHaveBeenCalledWith(
        'org-123',
        expect.objectContaining({
          metadata: { price: 1000, currency: 'RUB' },
        }),
      )
    })

    it('должен вернуть 500 при ошибке создания', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { createCompanyKnowledge } = await import('@/lib/repositories/company-knowledge')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      vi.mocked(createCompanyKnowledge).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/agents/[id]/knowledge/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/knowledge', {
        method: 'POST',
        body: JSON.stringify({
          category: 'product',
          title: 'Новый продукт',
          content: 'Описание',
        }),
      })

      const response = await route.POST(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })
})
