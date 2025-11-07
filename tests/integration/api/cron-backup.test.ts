import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

describe('API: /api/cron/backup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear environment variables
    delete process.env.CRON_SECRET
    delete process.env.SUPABASE_PROJECT_REF
  })

  describe('GET /api/cron/backup', () => {
    it('should return 401 if CRON_SECRET is set and authorization header is missing', async () => {
      process.env.CRON_SECRET = 'test-secret'

      const route = await import('@/app/api/cron/backup/route')
      const request = new NextRequest('http://localhost:3000/api/cron/backup')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 401 if CRON_SECRET is set and authorization header is invalid', async () => {
      process.env.CRON_SECRET = 'test-secret'

      const route = await import('@/app/api/cron/backup/route')
      const request = new NextRequest('http://localhost:3000/api/cron/backup', {
        headers: {
          authorization: 'Bearer wrong-secret',
        },
      })

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should process backup request successfully with valid authorization', async () => {
      process.env.CRON_SECRET = 'test-secret'
      process.env.SUPABASE_PROJECT_REF = 'test-project-ref'

      const route = await import('@/app/api/cron/backup/route')
      const request = new NextRequest('http://localhost:3000/api/cron/backup', {
        headers: {
          authorization: 'Bearer test-secret',
        },
      })

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Backup request logged')
      expect(data.projectRef).toBe('test-project-ref')
      expect(data.timestamp).toBeDefined()
    })

    it('should process backup request successfully without CRON_SECRET', async () => {
      // No CRON_SECRET set
      process.env.SUPABASE_PROJECT_REF = 'test-project-ref'

      const route = await import('@/app/api/cron/backup/route')
      const request = new NextRequest('http://localhost:3000/api/cron/backup')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Backup request logged')
    })

    it('should use default project ref if SUPABASE_PROJECT_REF is not set', async () => {
      const route = await import('@/app/api/cron/backup/route')
      const request = new NextRequest('http://localhost:3000/api/cron/backup')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.projectRef).toBeDefined()
    })
  })
})

