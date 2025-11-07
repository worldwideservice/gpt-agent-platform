import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

describe('API: /api/health/ready', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/health/ready', () => {
    it('should return ready status', async () => {
      const route = await import('@/app/api/health/ready/route')
      const request = new NextRequest('http://localhost:3000/api/health/ready')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('ready')
      expect(data.timestamp).toBeDefined()
      expect(data.uptime).toBeDefined()
      expect(data.memory).toBeDefined()
    })

    it('should return not_ready on error', async () => {
      // Mock process.uptime to throw an error
      const originalUptime = process.uptime
      process.uptime = vi.fn(() => {
        throw new Error('Uptime error')
      })

      try {
        const route = await import('@/app/api/health/ready/route')
        const request = new NextRequest('http://localhost:3000/api/health/ready')
        const response = await route.GET(request)
        const data = await response.json()

        expect(response.status).toBe(503)
        expect(data.status).toBe('not_ready')
        expect(data.error).toBeDefined()
      } finally {
        process.uptime = originalUptime
      }
    })
  })
})

