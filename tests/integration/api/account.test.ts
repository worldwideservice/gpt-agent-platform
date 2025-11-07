import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/users', () => ({
  UserRepository: {
    findUserById: vi.fn(),
    getUserById: vi.fn(),
    updateUser: vi.fn(),
  },
}))

describe('API: /api/account', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/account', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/account/route')
      const response = await route.GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return account data', async () => {
      const { auth } = await import('@/auth')
      const { UserRepository } = await import('@/lib/repositories/users')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        image: 'https://example.com/avatar.jpg',
      }

      vi.mocked(UserRepository.findUserById).mockResolvedValue(mockUser as any)

      const route = await import('@/app/api/account/route')
      const response = await route.GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('user-123')
      expect(data.data.email).toBe('test@example.com')
      expect(data.data.fullName).toBe('Test User')
    })

    it('should return 404 if user not found', async () => {
      const { auth } = await import('@/auth')
      const { UserRepository } = await import('@/lib/repositories/users')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(UserRepository.findUserById).mockResolvedValue(null)

      const route = await import('@/app/api/account/route')
      const response = await route.GET()
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
    })
  })

  describe('PATCH /api/account', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/account/route')
      const request = new NextRequest('http://localhost:3000/api/account', {
        method: 'PATCH',
        body: JSON.stringify({
          fullName: 'New Name',
        }),
      })
      const response = await route.PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should update account', async () => {
      const { auth } = await import('@/auth')
      const { UserRepository } = await import('@/lib/repositories/users')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockUpdatedUser = {
        id: 'user-123',
        email: 'new@example.com',
        name: 'New Name',
        image: 'https://example.com/new-avatar.jpg',
      }

      vi.mocked(UserRepository.updateUser).mockResolvedValue(mockUpdatedUser as any)
      vi.mocked(UserRepository.getUserById).mockResolvedValue(mockUpdatedUser as any)

      const route = await import('@/app/api/account/route')
      const request = new NextRequest('http://localhost:3000/api/account', {
        method: 'PATCH',
        body: JSON.stringify({
          fullName: 'New Name',
          email: 'new@example.com',
        }),
      })
      const response = await route.PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.fullName).toBe('New Name')
      expect(data.data.email).toBe('new@example.com')
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/account/route')
      const request = new NextRequest('http://localhost:3000/api/account', {
        method: 'PATCH',
        body: JSON.stringify({
          email: 'invalid-email', // Invalid email
        }),
      })
      const response = await route.PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })
})

