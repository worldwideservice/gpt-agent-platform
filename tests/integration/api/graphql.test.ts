import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

describe('API: /api/graphql', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/graphql', () => {
    it('should return 503 with maintenance message', async () => {
      const route = await import('@/app/api/graphql/route')
      const request = new NextRequest('http://localhost:3000/api/graphql')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.status).toBe('maintenance')
      expect(data.message).toContain('GraphQL API temporarily disabled')
    })
  })

  describe('POST /api/graphql', () => {
    it('should return 503 with maintenance message', async () => {
      const route = await import('@/app/api/graphql/route')
      const request = new NextRequest('http://localhost:3000/api/graphql', {
        method: 'POST',
        body: JSON.stringify({ query: '{ test }' }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.status).toBe('maintenance')
      expect(data.message).toContain('GraphQL API temporarily disabled')
    })
  })
})

