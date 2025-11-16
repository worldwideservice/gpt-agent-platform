import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

describe('API: Account Settings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/user/profile', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/user/profile/route')
      const response = await route.GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return user profile', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
          image: 'https://example.com/avatar.jpg',
        },
      } as any)

      const route = await import('@/app/api/user/profile/route')
      const response = await route.GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('user-123')
      expect(data.email).toBe('john@example.com')
      expect(data.firstName).toBe('John')
      expect(data.lastName).toBe('Doe')
      expect(data.avatarUrl).toBe('https://example.com/avatar.jpg')
    })
  })

  describe('PUT /api/user/profile', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/user/profile/route')
      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
        }),
      })

      const response = await route.PUT(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should update user profile with valid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
        },
      } as any)

      const route = await import('@/app/api/user/profile/route')
      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
        }),
      })

      const response = await route.PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.firstName).toBe('Jane')
      expect(data.lastName).toBe('Smith')
      expect(data.email).toBe('jane@example.com')
    })

    it('should return 400 with invalid email', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      const route = await import('@/app/api/user/profile/route')
      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'invalid-email',
        }),
      })

      const response = await route.PUT(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation error')
    })
  })

  describe('POST /api/user/change-password', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/user/change-password/route')
      const request = new NextRequest('http://localhost:3000/api/user/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: 'oldpass123',
          newPassword: 'newpass123',
          confirmPassword: 'newpass123',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 400 if passwords do not match', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      const route = await import('@/app/api/user/change-password/route')
      const request = new NextRequest('http://localhost:3000/api/user/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: 'oldpass123',
          newPassword: 'newpass123',
          confirmPassword: 'different123',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation error')
    })

    it('should return 400 if new password is too short', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      const route = await import('@/app/api/user/change-password/route')
      const request = new NextRequest('http://localhost:3000/api/user/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: 'oldpass123',
          newPassword: 'short',
          confirmPassword: 'short',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation error')
    })

    it('should change password with valid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      const route = await import('@/app/api/user/change-password/route')
      const request = new NextRequest('http://localhost:3000/api/user/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: 'oldpass123',
          newPassword: 'newpass123',
          confirmPassword: 'newpass123',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Password changed successfully')
    })
  })

  describe('GET /api/account/settings', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/account/settings/route')
      const response = await route.GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return account settings', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      const route = await import('@/app/api/account/settings/route')
      const response = await route.GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.settings).toBeDefined()
      expect(data.settings).toHaveProperty('stopAiAgentsOnManualMessage')
    })
  })

  describe('PUT /api/account/settings', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/account/settings/route')
      const request = new NextRequest('http://localhost:3000/api/account/settings', {
        method: 'PUT',
        body: JSON.stringify({
          stopAiAgentsOnManualMessage: true,
        }),
      })

      const response = await route.PUT(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should update account settings', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      const route = await import('@/app/api/account/settings/route')
      const request = new NextRequest('http://localhost:3000/api/account/settings', {
        method: 'PUT',
        body: JSON.stringify({
          stopAiAgentsOnManualMessage: true,
        }),
      })

      const response = await route.PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.settings.stopAiAgentsOnManualMessage).toBe(true)
      expect(data.message).toBe('Settings updated successfully')
    })
  })

  describe('GET /api/api-keys', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/api-keys/route')
      const response = await route.GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return list of API keys', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      const route = await import('@/app/api/api-keys/route')
      const response = await route.GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
    })
  })

  describe('POST /api/api-keys', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/api-keys/route')
      const request = new NextRequest('http://localhost:3000/api/api-keys', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Key',
          description: 'For testing',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should create a new API key', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      const route = await import('@/app/api/api-keys/route')
      const request = new NextRequest('http://localhost:3000/api/api-keys', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Key',
          description: 'For testing',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.name).toBe('Test Key')
      expect(data.description).toBe('For testing')
      expect(data.key).toBeDefined()
      expect(data.key).toContain('pk_live_')
    })

    it('should return 400 with invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      const route = await import('@/app/api/api-keys/route')
      const request = new NextRequest('http://localhost:3000/api/api-keys', {
        method: 'POST',
        body: JSON.stringify({
          name: '', // Empty name should fail
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation error')
    })
  })
})
