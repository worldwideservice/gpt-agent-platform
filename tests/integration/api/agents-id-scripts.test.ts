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

// Mock Supabase
const mockSupabaseQuery = () => ({
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  or: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
})

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(),
}))

describe('API: /api/agents/[id]/scripts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents/[id]/scripts', () => {
    it('должен вернуть 401 если не авторизован', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts')

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

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-999/scripts')

      const response = await route.GET(request, { params: Promise.resolve({ id: 'agent-999' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Агент не найден')
    })

    it('должен вернуть скрипты агента', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

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

      const mockScripts = [
        {
          id: 'script-1',
          org_id: 'org-123',
          agent_id: 'agent-123',
          title: 'Приветствие',
          script_type: 'greeting',
          content: 'Добрый день! Как я могу вам помочь?',
          variables: {},
          conditions: {},
          effectiveness_score: 0.8,
          usage_count: 100,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'script-2',
          org_id: 'org-123',
          agent_id: 'agent-123',
          title: 'Презентация продукта',
          script_type: 'presentation',
          content: 'Наш продукт...',
          variables: { product_name: 'default' },
          conditions: {},
          effectiveness_score: 0.9,
          usage_count: 50,
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ]

      const mockQuery = mockSupabaseQuery()
      // order() вызывается дважды - сначала возвращает this, потом Promise
      mockQuery.order
        .mockReturnValueOnce(mockQuery) // первый .order()
        .mockResolvedValueOnce({ data: mockScripts, error: null }) // второй .order()

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockQuery as any)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts')

      const response = await route.GET(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(2)
      expect(data.data[0].title).toBe('Приветствие')
      expect(data.data[1].title).toBe('Презентация продукта')
    })

    it('должен фильтровать по типу скрипта', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

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

      const mockQuery = mockSupabaseQuery()
      mockQuery.order
        .mockReturnValueOnce(mockQuery)
        .mockResolvedValueOnce({ data: [], error: null })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockQuery as any)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest(
        'http://localhost:3000/api/agents/agent-123/scripts?scriptType=greeting',
      )

      const response = await route.GET(request, { params: Promise.resolve({ id: 'agent-123' }) })

      expect(response.status).toBe(200)
      expect(mockQuery.eq).toHaveBeenCalledWith('script_type', 'greeting')
    })

    it('должен фильтровать по этапу воронки', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

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

      const mockQuery = mockSupabaseQuery()
      mockQuery.order
        .mockReturnValueOnce(mockQuery)
        .mockResolvedValueOnce({ data: [], error: null })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockQuery as any)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest(
        'http://localhost:3000/api/agents/agent-123/scripts?stageId=stage-456',
      )

      const response = await route.GET(request, { params: Promise.resolve({ id: 'agent-123' }) })

      expect(response.status).toBe(200)
      expect(mockQuery.or).toHaveBeenCalledWith('pipeline_stage_id.is.null,pipeline_stage_id.eq.stage-456')
    })

    it('должен вернуть 500 при ошибке БД', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

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

      const mockQuery = mockSupabaseQuery()
      mockQuery.order.mockResolvedValue({ data: null, error: new Error('Database error') })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockQuery as any)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts')

      const response = await route.GET(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })

  describe('POST /api/agents/[id]/scripts', () => {
    it('должен вернуть 401 если не авторизован', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Новый скрипт',
          scriptType: 'greeting',
          content: 'Здравствуйте!',
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

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-999/scripts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Новый скрипт',
          scriptType: 'greeting',
          content: 'Здравствуйте!',
        }),
      })

      const response = await route.POST(request, { params: Promise.resolve({ id: 'agent-999' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
    })

    it('должен создать скрипт продаж', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

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

      const createdScript = {
        id: 'script-new',
        org_id: 'org-123',
        agent_id: 'agent-123',
        title: 'Новый скрипт приветствия',
        script_type: 'greeting',
        content: 'Добрый день! Меня зовут Иван.',
        variables: {},
        conditions: {},
        effectiveness_score: 0.5,
        usage_count: 0,
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
      }

      const mockQuery = mockSupabaseQuery()
      mockQuery.single.mockResolvedValue({ data: createdScript, error: null })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockQuery as any)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Новый скрипт приветствия',
          scriptType: 'greeting',
          content: 'Добрый день! Меня зовут Иван.',
        }),
      })

      const response = await route.POST(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.title).toBe('Новый скрипт приветствия')
      expect(data.data.scriptType).toBe('greeting')
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

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts', {
        method: 'POST',
        body: JSON.stringify({
          title: '', // пустой title
          scriptType: 'invalid_type', // неверный тип
          content: '',
        }),
      })

      const response = await route.POST(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
    })

    it('должен создать скрипт с переменными и условиями', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

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

      const createdScript = {
        id: 'script-new',
        org_id: 'org-123',
        agent_id: 'agent-123',
        title: 'Персонализированный скрипт',
        script_type: 'presentation',
        content: 'Здравствуйте, {{customer_name}}!',
        variables: { customer_name: 'default' },
        conditions: { stage: 'qualification' },
        effectiveness_score: 0.5,
        usage_count: 0,
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
      }

      const mockQuery = mockSupabaseQuery()
      mockQuery.single.mockResolvedValue({ data: createdScript, error: null })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockQuery as any)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Персонализированный скрипт',
          scriptType: 'presentation',
          content: 'Здравствуйте, {{customer_name}}!',
          variables: { customer_name: 'default' },
          conditions: { stage: 'qualification' },
        }),
      })

      const response = await route.POST(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.variables).toEqual({ customer_name: 'default' })
      expect(data.data.conditions).toEqual({ stage: 'qualification' })
    })

    it('должен вернуть 500 при ошибке создания', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

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

      const mockQuery = mockSupabaseQuery()
      mockQuery.single.mockResolvedValue({ data: null, error: new Error('Database error') })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockQuery as any)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Новый скрипт',
          scriptType: 'greeting',
          content: 'Здравствуйте!',
        }),
      })

      const response = await route.POST(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })
})
