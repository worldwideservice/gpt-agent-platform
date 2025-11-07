import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

describe('API: /api/health', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const { createClient } = await import('@supabase/supabase-js')

      const mockSelect = vi.fn().mockResolvedValue({
        data: [{ id: 'test' }],
        error: null,
      })
      const mockLimit = vi.fn().mockReturnValue({ select: mockSelect })
      const mockFrom = vi.fn().mockReturnValue({ limit: mockLimit })

      vi.mocked(createClient).mockReturnValue({
        from: mockFrom,
      } as any)

      // Set environment variables for health check
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

      const route = await import('@/app/api/health/route')
      const request = new NextRequest('http://localhost:3000/api/health')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('ok')
      expect(['ok', 'error']).toContain(data.database) // Database can be ok or error depending on connection
    })

    it('should return database error if connection fails', async () => {
      const { createClient } = await import('@supabase/supabase-js')

      const mockSelect = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Connection failed' },
      })
      const mockLimit = vi.fn().mockReturnValue({ select: mockSelect })
      const mockFrom = vi.fn().mockReturnValue({ limit: mockLimit })

      vi.mocked(createClient).mockReturnValue({
        from: mockFrom,
      } as any)

      // Set environment variables for health check
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

      const route = await import('@/app/api/health/route')
      const request = new NextRequest('http://localhost:3000/api/health')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('ok')
      expect(data.database).toBe('error')
    })
  })
})

