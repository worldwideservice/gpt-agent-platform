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
vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(),
}))

describe('API: /api/agents/[id]/fields', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents/[id]/fields', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/fields/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/fields')
      const params = { id: 'agent-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should return fields for agent', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockAgent = {
        id: 'agent-123',
        settings: {
          dealFields: ['name', 'price'],
          contactFields: ['email', 'phone'],
        },
      }

      vi.mocked(getAgentById).mockResolvedValue(mockAgent as any)

      const route = await import('@/app/api/agents/[id]/fields/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/fields')
      const params = { id: 'agent-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.dealFields).toEqual(['name', 'price'])
      expect(data.data.contactFields).toEqual(['email', 'phone'])
    })

    it('should return empty arrays if fields not set', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockAgent = {
        id: 'agent-123',
        settings: {},
      }

      vi.mocked(getAgentById).mockResolvedValue(mockAgent as any)

      const route = await import('@/app/api/agents/[id]/fields/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/fields')
      const params = { id: 'agent-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.dealFields).toEqual([])
      expect(data.data.contactFields).toEqual([])
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

      const route = await import('@/app/api/agents/[id]/fields/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/fields')
      const params = { id: 'agent-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Агент не найден')
    })
  })

  describe('POST /api/agents/[id]/fields', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/fields/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/fields', {
        method: 'POST',
        body: JSON.stringify({
          dealFields: ['name'],
          contactFields: ['email'],
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should save fields for agent', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockAgent = {
        id: 'agent-123',
        settings: {},
      }

      vi.mocked(getAgentById).mockResolvedValue(mockAgent as any)

      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/fields/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/fields', {
        method: 'POST',
        body: JSON.stringify({
          dealFields: ['name', 'price'],
          contactFields: ['email', 'phone'],
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
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

      const mockAgent = {
        id: 'agent-123',
        settings: {},
      }

      vi.mocked(getAgentById).mockResolvedValue(mockAgent as any)

      const route = await import('@/app/api/agents/[id]/fields/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/fields', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required fields
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
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

      const route = await import('@/app/api/agents/[id]/fields/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/fields', {
        method: 'POST',
        body: JSON.stringify({
          dealFields: ['name'],
          contactFields: ['email'],
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Агент не найден')
    })
  })
})

