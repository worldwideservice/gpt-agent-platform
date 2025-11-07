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

describe('API: /api/integrations/kommo/messages/send', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/integrations/kommo/messages/send', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/integrations/kommo/messages/send/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/messages/send', {
        method: 'POST',
        body: JSON.stringify({
          dealId: 'deal-123',
          channel: 'email',
          message: {
            body: 'Test message',
          },
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should send message successfully', async () => {
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
        messageId: 'msg-123',
      }

      vi.mocked(backendFetch).mockResolvedValue(mockResponse)

      const route = await import('@/app/api/integrations/kommo/messages/send/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/messages/send', {
        method: 'POST',
        body: JSON.stringify({
          dealId: 'deal-123',
          channel: 'email',
          message: {
            subject: 'Test Subject',
            body: 'Test message body',
          },
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockResponse)
      expect(backendFetch).toHaveBeenCalledWith('/kommo/messages/send', {
        method: 'POST',
        body: JSON.stringify({
          orgId: 'org-123',
          dealId: 'deal-123',
          channel: 'email',
          message: {
            subject: 'Test Subject',
            body: 'Test message body',
          },
        }),
      })
    })

    it('should send message with attachments', async () => {
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
        messageId: 'msg-123',
      }

      vi.mocked(backendFetch).mockResolvedValue(mockResponse)

      const route = await import('@/app/api/integrations/kommo/messages/send/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/messages/send', {
        method: 'POST',
        body: JSON.stringify({
          dealId: 'deal-123',
          channel: 'chat',
          message: {
            body: 'Test message with attachments',
            attachments: [
              {
                url: 'https://example.com/file.pdf',
                name: 'document.pdf',
              },
            ],
          },
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockResponse)
      expect(backendFetch).toHaveBeenCalledWith('/kommo/messages/send', {
        method: 'POST',
        body: JSON.stringify({
          orgId: 'org-123',
          dealId: 'deal-123',
          channel: 'chat',
          message: {
            body: 'Test message with attachments',
            attachments: [
              {
                url: 'https://example.com/file.pdf',
                name: 'document.pdf',
              },
            ],
          },
        }),
      })
    })

    it('should return 400 for invalid dealId', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/integrations/kommo/messages/send/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/messages/send', {
        method: 'POST',
        body: JSON.stringify({
          dealId: '', // Invalid: empty string
          channel: 'email',
          message: {
            body: 'Test message',
          },
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные для отправки сообщения')
    })

    it('should return 400 for invalid channel', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/integrations/kommo/messages/send/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/messages/send', {
        method: 'POST',
        body: JSON.stringify({
          dealId: 'deal-123',
          channel: 'invalid', // Invalid: not in enum
          message: {
            body: 'Test message',
          },
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные для отправки сообщения')
    })

    it('should return 400 for missing message body', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/integrations/kommo/messages/send/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/messages/send', {
        method: 'POST',
        body: JSON.stringify({
          dealId: 'deal-123',
          channel: 'email',
          message: {
            // Missing required body field
          },
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные для отправки сообщения')
    })

    it('should return 400 for invalid attachment URL', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/integrations/kommo/messages/send/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/messages/send', {
        method: 'POST',
        body: JSON.stringify({
          dealId: 'deal-123',
          channel: 'email',
          message: {
            body: 'Test message',
            attachments: [
              {
                url: 'not-a-valid-url', // Invalid URL
                name: 'file.pdf',
              },
            ],
          },
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные для отправки сообщения')
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

      const route = await import('@/app/api/integrations/kommo/messages/send/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/messages/send', {
        method: 'POST',
        body: JSON.stringify({
          dealId: 'deal-123',
          channel: 'email',
          message: {
            body: 'Test message',
          },
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось отправить сообщение через Kommo')
    })
  })
})
