import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock backend client
vi.mock('@/lib/backend/client', () => ({
  backendFetch: vi.fn(),
}))

describe('API: /api/integrations/kommo/oauth/start', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/integrations/kommo/oauth/start', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/integrations/kommo/oauth/start/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/oauth/start', {
        method: 'POST',
        body: JSON.stringify({
          baseDomain: 'example.kommo.ru',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should start OAuth flow with valid baseDomain', async () => {
      const { auth } = await import('@/auth')
      const { backendFetch } = await import('@/lib/backend/client')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockResponse = {
        success: true,
        authUrl: 'https://example.kommo.ru/oauth/authorize?client_id=123&state=state-123',
        state: 'state-123',
      }

      vi.mocked(backendFetch).mockResolvedValue(mockResponse)

      const route = await import('@/app/api/integrations/kommo/oauth/start/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/oauth/start', {
        method: 'POST',
        body: JSON.stringify({
          baseDomain: 'example.kommo.ru',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.authUrl).toBe(mockResponse.authUrl)
      expect(data.state).toBe(mockResponse.state)
      expect(backendFetch).toHaveBeenCalledWith('/kommo/oauth/start', {
        method: 'POST',
        body: JSON.stringify({
          orgId: 'org-123',
          baseDomain: 'example.kommo.ru',
        }),
      })
    })

    it('should return 400 if baseDomain is missing', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/integrations/kommo/oauth/start/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/oauth/start', {
        method: 'POST',
        body: JSON.stringify({
          // Missing baseDomain
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные параметры запроса')
    })

    it('should return 400 if baseDomain is empty', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/integrations/kommo/oauth/start/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/oauth/start', {
        method: 'POST',
        body: JSON.stringify({
          baseDomain: '',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные параметры запроса')
    })

    it('should handle backend errors gracefully', async () => {
      const { auth } = await import('@/auth')
      const { backendFetch } = await import('@/lib/backend/client')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(backendFetch).mockRejectedValue(new Error('Backend error'))

      const route = await import('@/app/api/integrations/kommo/oauth/start/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/oauth/start', {
        method: 'POST',
        body: JSON.stringify({
          baseDomain: 'example.kommo.ru',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось запустить OAuth авторизацию Kommo')
    })

    it('should handle validation errors', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/integrations/kommo/oauth/start/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/oauth/start', {
        method: 'POST',
        body: JSON.stringify({
          baseDomain: 123, // Invalid type
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные параметры запроса')
    })
  })
})


