import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock repositories
vi.mock('@/lib/repositories/passwordResets', () => ({
  findValidPasswordResetByToken: vi.fn(),
  markPasswordResetAsUsed: vi.fn(),
}))

vi.mock('@/lib/repositories/users', () => ({
  UserRepository: {
    updateUserPasswordHash: vi.fn(),
  },
}))

describe('API: /api/auth/reset-password/confirm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/auth/reset-password/confirm', () => {
    it('should return 400 for invalid token', async () => {
      const { findValidPasswordResetByToken } = await import('@/lib/repositories/passwordResets')
      vi.mocked(findValidPasswordResetByToken).mockResolvedValue(null)

      const route = await import('@/app/api/auth/reset-password/confirm/route')
      const request = new NextRequest('http://localhost:3000/api/auth/reset-password/confirm', {
        method: 'POST',
        body: JSON.stringify({
          token: 'invalid-token-12345678901234567890', // Valid length but not found in DB
          password: 'newpassword123',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('токен')
    })

    it('should return 400 for token too short', async () => {
      const route = await import('@/app/api/auth/reset-password/confirm/route')
      const request = new NextRequest('http://localhost:3000/api/auth/reset-password/confirm', {
        method: 'POST',
        body: JSON.stringify({
          token: 'short', // Invalid: less than 20 characters
          password: 'newpassword123',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should return 400 for invalid password', async () => {
      const route = await import('@/app/api/auth/reset-password/confirm/route')
      const request = new NextRequest('http://localhost:3000/api/auth/reset-password/confirm', {
        method: 'POST',
        body: JSON.stringify({
          token: 'valid-token-12345678901234567890',
          password: 'short', // Invalid: less than 8 characters
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should return 400 for missing token', async () => {
      const route = await import('@/app/api/auth/reset-password/confirm/route')
      const request = new NextRequest('http://localhost:3000/api/auth/reset-password/confirm', {
        method: 'POST',
        body: JSON.stringify({
          password: 'newpassword123',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should successfully reset password', async () => {
      const { findValidPasswordResetByToken } = await import('@/lib/repositories/passwordResets')
      const { markPasswordResetAsUsed } = await import('@/lib/repositories/passwordResets')
      const { UserRepository } = await import('@/lib/repositories/users')

      const mockResetEntry = {
        id: 'reset-123',
        user_id: 'user-123',
        token: 'valid-token-12345678901234567890',
        expires_at: new Date(Date.now() + 3600000), // 1 hour from now
      }

      vi.mocked(findValidPasswordResetByToken).mockResolvedValue(mockResetEntry as any)
      vi.mocked(UserRepository.updateUserPasswordHash).mockResolvedValue(undefined)
      vi.mocked(markPasswordResetAsUsed).mockResolvedValue(undefined)

      const route = await import('@/app/api/auth/reset-password/confirm/route')
      const request = new NextRequest('http://localhost:3000/api/auth/reset-password/confirm', {
        method: 'POST',
        body: JSON.stringify({
          token: 'valid-token-12345678901234567890',
          password: 'newpassword123',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(UserRepository.updateUserPasswordHash).toHaveBeenCalledWith('user-123', expect.any(String))
      expect(markPasswordResetAsUsed).toHaveBeenCalledWith('reset-123', 'user-123')
    })

    it('should return 500 on unexpected error', async () => {
      const { findValidPasswordResetByToken } = await import('@/lib/repositories/passwordResets')

      vi.mocked(findValidPasswordResetByToken).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/auth/reset-password/confirm/route')
      const request = new NextRequest('http://localhost:3000/api/auth/reset-password/confirm', {
        method: 'POST',
        body: JSON.stringify({
          token: 'valid-token-12345678901234567890',
          password: 'newpassword123',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })
})

