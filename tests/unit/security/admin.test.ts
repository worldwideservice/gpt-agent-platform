/**
 * Admin Authentication Tests
 *
 * Задача 5.1: Security Audit
 * Тесты для проверки admin аутентификации
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { isAdmin, requireAdmin } from '@/lib/auth/admin'

// Mock auth module
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

describe('Admin Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear env variables
    delete process.env.ADMIN_API_TOKEN
    delete process.env.ADMIN_EMAILS
  })

  describe('isAdmin', () => {
    it('should return true when valid Bearer token is provided', async () => {
      process.env.ADMIN_API_TOKEN = 'secret-admin-token'

      const request = new NextRequest('https://example.com/api/admin/test', {
        headers: {
          'Authorization': 'Bearer secret-admin-token',
        },
      })

      const result = await isAdmin(request)
      expect(result).toBe(true)
    })

    it('should return false when invalid Bearer token is provided', async () => {
      process.env.ADMIN_API_TOKEN = 'secret-admin-token'

      const request = new NextRequest('https://example.com/api/admin/test', {
        headers: {
          'Authorization': 'Bearer wrong-token',
        },
      })

      const result = await isAdmin(request)
      expect(result).toBe(false)
    })

    it('should return false when no token is provided and no session', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const request = new NextRequest('https://example.com/api/admin/test')

      const result = await isAdmin(request)
      expect(result).toBe(false)
    })

    it('should return true when user has admin role in session', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'admin@example.com',
          role: 'admin',
        },
        expires: '2025-12-31',
      })

      const request = new NextRequest('https://example.com/api/admin/test')

      const result = await isAdmin(request)
      expect(result).toBe(true)
    })

    it('should return true when user email is in ADMIN_EMAILS list', async () => {
      process.env.ADMIN_EMAILS = 'admin1@example.com,admin2@example.com'

      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'admin1@example.com',
          role: 'user',
        },
        expires: '2025-12-31',
      })

      const request = new NextRequest('https://example.com/api/admin/test')

      const result = await isAdmin(request)
      expect(result).toBe(true)
    })

    it('should return false when user is not admin', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'user@example.com',
          role: 'user',
        },
        expires: '2025-12-31',
      })

      const request = new NextRequest('https://example.com/api/admin/test')

      const result = await isAdmin(request)
      expect(result).toBe(false)
    })

    it('should handle errors gracefully', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockRejectedValue(new Error('Auth error'))

      const request = new NextRequest('https://example.com/api/admin/test')

      const result = await isAdmin(request)
      expect(result).toBe(false)
    })
  })

  describe('requireAdmin', () => {
    it('should return null when user is admin', async () => {
      process.env.ADMIN_API_TOKEN = 'secret-admin-token'

      const request = new NextRequest('https://example.com/api/admin/test', {
        headers: {
          'Authorization': 'Bearer secret-admin-token',
        },
      })

      const result = await requireAdmin(request)
      expect(result).toBeNull()
    })

    it('should return 401 response when user is not admin', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const request = new NextRequest('https://example.com/api/admin/test')

      const result = await requireAdmin(request)
      expect(result).not.toBeNull()
      expect(result?.status).toBe(401)

      const json = await result?.json()
      expect(json).toEqual({
        success: false,
        error: 'Unauthorized - Admin access required',
      })
    })
  })
})
