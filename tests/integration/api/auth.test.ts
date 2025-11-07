import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/repositories/users', () => ({
  UserRepository: {
    findUserByEmail: vi.fn(),
    createUser: vi.fn(),
  },
}))

vi.mock('@/lib/repositories/notifications', () => ({
  createNotification: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/repositories/passwordResets', () => ({
  createPasswordReset: vi.fn(),
}))

vi.mock('@/lib/services/email', () => ({
  sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(),
}))

vi.mock('@/lib/env/supabase', () => ({
  loadSupabaseServerEnv: vi.fn(),
}))

describe('API: /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/auth/register', () => {
    it('should return 400 if required fields are missing', async () => {
      const route = await import('@/app/api/auth/register/route')
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          // Missing password, firstName, lastName
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Все поля обязательны для заполнения')
    })

    it('should return 400 if password is too short', async () => {
      const route = await import('@/app/api/auth/register/route')
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: '12345', // Less than 6 characters
          firstName: 'John',
          lastName: 'Doe',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Пароль должен содержать минимум 6 символов')
    })

    it('should return 400 if email is invalid', async () => {
      const route = await import('@/app/api/auth/register/route')
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Некорректный email адрес')
    })

    it('should return 409 if user already exists', async () => {
      const { UserRepository } = await import('@/lib/repositories/users')
      vi.mocked(UserRepository.findUserByEmail).mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
      } as any)

      const route = await import('@/app/api/auth/register/route')
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Пользователь с таким email уже существует')
    })

    it('should create user and organization successfully', async () => {
      const { UserRepository } = await import('@/lib/repositories/users')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(UserRepository.findUserByEmail).mockResolvedValue(null)
      vi.mocked(UserRepository.createUser).mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        full_name: 'John Doe',
      } as any)

      const mockSupabaseClient = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'org-123',
                  name: 'John Doe',
                  slug: 'john-doe',
                },
                error: null,
              }),
            }),
          }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      }

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockSupabaseClient as any)

      const route = await import('@/app/api/auth/register/route')
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          organizationName: 'Test Org',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.user).toBeDefined()
      expect(data.user.email).toBe('test@example.com')
      expect(UserRepository.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      })
    })

    it('should handle user creation failure', async () => {
      const { UserRepository } = await import('@/lib/repositories/users')

      vi.mocked(UserRepository.findUserByEmail).mockResolvedValue(null)
      vi.mocked(UserRepository.createUser).mockResolvedValue(null)

      const route = await import('@/app/api/auth/register/route')
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Не удалось создать пользователя')
    })

    it('should handle errors gracefully', async () => {
      const { UserRepository } = await import('@/lib/repositories/users')

      vi.mocked(UserRepository.findUserByEmail).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/auth/register/route')
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })
  })
})

describe('API: /api/auth/reset-password/request', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/auth/reset-password/request', () => {
    it('should return 400 for invalid email', async () => {
      const route = await import('@/app/api/auth/reset-password/request/route')
      const request = new NextRequest('http://localhost:3000/api/auth/reset-password/request', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
    })

    it('should return success even if user does not exist (security)', async () => {
      const { UserRepository } = await import('@/lib/repositories/users')
      vi.mocked(UserRepository.findUserByEmail).mockResolvedValue(null)

      const route = await import('@/app/api/auth/reset-password/request/route')
      const request = new NextRequest('http://localhost:3000/api/auth/reset-password/request', {
        method: 'POST',
        body: JSON.stringify({
          email: 'nonexistent@example.com',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should create password reset and send email for existing user', async () => {
      const { UserRepository } = await import('@/lib/repositories/users')
      const { createPasswordReset } = await import('@/lib/repositories/passwordResets')
      const { sendPasswordResetEmail } = await import('@/lib/services/email')

      vi.mocked(UserRepository.findUserByEmail).mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
      } as any)

      vi.mocked(createPasswordReset).mockResolvedValue({
        token: 'reset-token-123',
        expiresAt: new Date(Date.now() + 3600000),
      })

      const route = await import('@/app/api/auth/reset-password/request/route')
      const request = new NextRequest('http://localhost:3000/api/auth/reset-password/request', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(createPasswordReset).toHaveBeenCalledWith('user-123')
      expect(sendPasswordResetEmail).toHaveBeenCalled()
    })

    it('should handle errors gracefully', async () => {
      const { UserRepository } = await import('@/lib/repositories/users')
      vi.mocked(UserRepository.findUserByEmail).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/auth/reset-password/request/route')
      const request = new NextRequest('http://localhost:3000/api/auth/reset-password/request', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось создать запрос на сброс пароля')
    })
  })
})


