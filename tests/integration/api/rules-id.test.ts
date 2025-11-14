import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock Supabase
const createMockQuery = (result?: { data: any; error: any }) => {
  const query: any = {}

  query.select = vi.fn().mockReturnValue(query)
  query.update = vi.fn().mockReturnValue(query)
  query.delete = vi.fn().mockReturnValue(query)
  query.eq = vi.fn().mockReturnValue(query)
  query.maybeSingle = vi.fn().mockResolvedValue(result || { data: null, error: null })

  return query
}

const mockSupabaseClient = {
  from: vi.fn(),
}

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('API: /api/rules/[ruleId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('PATCH /api/rules/[ruleId]', () => {
    it('должен вернуть 401 если не авторизован', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/rules/[ruleId]/route')
      const request = new NextRequest('http://localhost:3000/api/rules/rule-123', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Updated Rule' }),
      })

      const response = await route.PATCH(request, { params: { ruleId: 'rule-123' } })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('должен вернуть 404 если правило не найдено', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      const selectQuery = createMockQuery({ data: null, error: null })
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const route = await import('@/app/api/rules/[ruleId]/route')
      const request = new NextRequest('http://localhost:3000/api/rules/rule-123', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Updated Rule' }),
      })

      const response = await route.PATCH(request, { params: { ruleId: 'rule-123' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Правило не найдено')
    })

    it('должен обновить правило успешно', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      const existingRule = { id: 'rule-123' }
      const updatedRule = {
        id: 'rule-123',
        name: 'Updated Rule',
        description: 'New description',
        is_active: true,
        org_id: 'org-123',
      }

      // Первый запрос - проверка существования
      const selectQuery = createMockQuery({ data: existingRule, error: null })

      // Второй запрос - обновление
      const updateQuery = createMockQuery({ data: updatedRule, error: null })
      updateQuery.select = vi.fn().mockReturnValue(updateQuery)

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery) // select для проверки
        .mockReturnValueOnce(updateQuery) // update

      const route = await import('@/app/api/rules/[ruleId]/route')
      const request = new NextRequest('http://localhost:3000/api/rules/rule-123', {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Updated Rule',
          description: 'New description',
          is_active: true,
        }),
      })

      const response = await route.PATCH(request, { params: { ruleId: 'rule-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe('Updated Rule')
    })

    it('должен вернуть 400 при некорректных данных', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      const route = await import('@/app/api/rules/[ruleId]/route')
      const request = new NextRequest('http://localhost:3000/api/rules/rule-123', {
        method: 'PATCH',
        body: JSON.stringify({
          name: '', // Пустое имя - невалидно
        }),
      })

      const response = await route.PATCH(request, { params: { ruleId: 'rule-123' } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
    })

    it('должен обновить conditions и actions', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      const existingRule = { id: 'rule-123' }
      const updatedRule = {
        id: 'rule-123',
        conditions: [
          {
            field: 'lead_stage',
            operator: 'equals',
            value: 'new',
          },
        ],
        actions: [
          {
            type: 'send_message',
            template: 'Welcome message',
          },
        ],
      }

      const selectQuery = createMockQuery({ data: existingRule, error: null })
      const updateQuery = createMockQuery({ data: updatedRule, error: null })
      updateQuery.select = vi.fn().mockReturnValue(updateQuery)

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery)
        .mockReturnValueOnce(updateQuery)

      const route = await import('@/app/api/rules/[ruleId]/route')
      const request = new NextRequest('http://localhost:3000/api/rules/rule-123', {
        method: 'PATCH',
        body: JSON.stringify({
          conditions: [
            {
              field: 'lead_stage',
              operator: 'equals',
              value: 'new',
            },
          ],
          actions: [
            {
              type: 'send_message',
              template: 'Welcome message',
            },
          ],
        }),
      })

      const response = await route.PATCH(request, { params: { ruleId: 'rule-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('должен обновить priority', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      const existingRule = { id: 'rule-123' }
      const updatedRule = { id: 'rule-123', priority: 50 }

      const selectQuery = createMockQuery({ data: existingRule, error: null })
      const updateQuery = createMockQuery({ data: updatedRule, error: null })
      updateQuery.select = vi.fn().mockReturnValue(updateQuery)

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery)
        .mockReturnValueOnce(updateQuery)

      const route = await import('@/app/api/rules/[ruleId]/route')
      const request = new NextRequest('http://localhost:3000/api/rules/rule-123', {
        method: 'PATCH',
        body: JSON.stringify({ priority: 50 }),
      })

      const response = await route.PATCH(request, { params: { ruleId: 'rule-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.priority).toBe(50)
    })
  })

  describe('DELETE /api/rules/[ruleId]', () => {
    it('должен вернуть 401 если не авторизован', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/rules/[ruleId]/route')
      const request = new NextRequest('http://localhost:3000/api/rules/rule-123', {
        method: 'DELETE',
      })

      const response = await route.DELETE(request, { params: { ruleId: 'rule-123' } })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('должен удалить правило успешно', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      const deleteQuery: any = {
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      }

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      const route = await import('@/app/api/rules/[ruleId]/route')
      const request = new NextRequest('http://localhost:3000/api/rules/rule-123', {
        method: 'DELETE',
      })

      const response = await route.DELETE(request, { params: { ruleId: 'rule-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('должен вернуть 500 при ошибке удаления', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      const deleteQuery: any = {
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: { message: 'Database error' } }),
          }),
        }),
      }

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      const route = await import('@/app/api/rules/[ruleId]/route')
      const request = new NextRequest('http://localhost:3000/api/rules/rule-123', {
        method: 'DELETE',
      })

      const response = await route.DELETE(request, { params: { ruleId: 'rule-123' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось удалить правило')
    })
  })
})
