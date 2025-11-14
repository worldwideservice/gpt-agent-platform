import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/agents', () => ({
  getAgentById: vi.fn(),
  updateAgent: vi.fn(),
  deleteAgent: vi.fn(),
}))

describe('API: /api/agents/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents/[id]', () => {
    it('должен вернуть 401 если не авторизован', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123')

      const response = await route.GET(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('должен вернуть агента по id', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      const mockAgent = {
        id: 'agent-123',
        name: 'Тестовый агент',
        org_id: 'org-123',
        status: 'active',
        model: 'gpt-4',
        instructions: 'Ты полезный ассистент',
      }

      vi.mocked(getAgentById).mockResolvedValue(mockAgent as any)

      const route = await import('@/app/api/agents/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123')

      const response = await route.GET(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('agent-123')
      expect(data.data.name).toBe('Тестовый агент')
      expect(getAgentById).toHaveBeenCalledWith('agent-123', 'org-123')
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

      const route = await import('@/app/api/agents/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-999')

      const response = await route.GET(request, { params: Promise.resolve({ id: 'agent-999' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Агент не найден')
    })

    it('должен вернуть 500 при ошибке БД', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getAgentById).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/agents/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123')

      const response = await route.GET(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })

  describe('PATCH /api/agents/[id]', () => {
    it('должен вернуть 401 если не авторизован', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Новое имя' }),
      })

      const response = await route.PATCH(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('должен обновить агента', async () => {
      const { auth } = await import('@/auth')
      const { updateAgent } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      const updatedAgent = {
        id: 'agent-123',
        name: 'Обновленный агент',
        org_id: 'org-123',
        status: 'active',
        model: 'gpt-4-turbo',
        instructions: 'Обновленные инструкции',
      }

      vi.mocked(updateAgent).mockResolvedValue(updatedAgent as any)

      const route = await import('@/app/api/agents/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123', {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Обновленный агент',
          model: 'gpt-4-turbo',
          instructions: 'Обновленные инструкции',
        }),
      })

      const response = await route.PATCH(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe('Обновленный агент')
      expect(updateAgent).toHaveBeenCalledWith(
        'agent-123',
        'org-123',
        expect.objectContaining({
          name: 'Обновленный агент',
          model: 'gpt-4-turbo',
          instructions: 'Обновленные инструкции',
        }),
      )
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

      const route = await import('@/app/api/agents/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123', {
        method: 'PATCH',
        body: JSON.stringify({
          name: '', // пустое имя
        }),
      })

      const response = await route.PATCH(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
    })

    it('должен обновить настройки агента', async () => {
      const { auth } = await import('@/auth')
      const { updateAgent } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(updateAgent).mockResolvedValue({
        id: 'agent-123',
        settings: {
          language: 'ru',
          creativity: 'balanced',
        },
      } as any)

      const route = await import('@/app/api/agents/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123', {
        method: 'PATCH',
        body: JSON.stringify({
          settings: {
            language: 'ru',
            creativity: 'balanced',
          },
        }),
      })

      const response = await route.PATCH(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(updateAgent).toHaveBeenCalledWith(
        'agent-123',
        'org-123',
        expect.objectContaining({
          settings: {
            language: 'ru',
            creativity: 'balanced',
          },
        }),
      )
    })

    it('должен вернуть 500 при ошибке обновления', async () => {
      const { auth } = await import('@/auth')
      const { updateAgent } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(updateAgent).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/agents/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Новое имя' }),
      })

      const response = await route.PATCH(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })

  describe('DELETE /api/agents/[id]', () => {
    it('должен вернуть 401 если не авторизован', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123', {
        method: 'DELETE',
      })

      const response = await route.DELETE(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('должен удалить агента', async () => {
      const { auth } = await import('@/auth')
      const { deleteAgent } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(deleteAgent).mockResolvedValue(undefined)

      const route = await import('@/app/api/agents/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123', {
        method: 'DELETE',
      })

      const response = await route.DELETE(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(deleteAgent).toHaveBeenCalledWith('agent-123', 'org-123')
    })

    it('должен вернуть 500 при ошибке удаления', async () => {
      const { auth } = await import('@/auth')
      const { deleteAgent } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(deleteAgent).mockRejectedValue(new Error('Cannot delete agent with active conversations'))

      const route = await import('@/app/api/agents/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123', {
        method: 'DELETE',
      })

      const response = await route.DELETE(request, { params: Promise.resolve({ id: 'agent-123' }) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })
})
