import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock rate limit
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(),
  rateLimitConfigs: {
    api: {},
  },
}))

// Mock sharp
vi.mock('sharp', () => {
  const mockMetadata = vi.fn().mockResolvedValue({
    width: 1000,
    height: 800,
    size: 50000,
  })

  const mockToBuffer = vi.fn().mockResolvedValue(Buffer.from('optimized-image-data'))
  const mockWebp = vi.fn().mockReturnValue({ toBuffer: mockToBuffer })
  const mockAvif = vi.fn().mockReturnValue({ toBuffer: mockToBuffer })
  const mockJpeg = vi.fn().mockReturnValue({ toBuffer: mockToBuffer })
  const mockPng = vi.fn().mockReturnValue({ toBuffer: mockToBuffer })
  const mockResize = vi.fn().mockReturnValue({
    metadata: mockMetadata,
    webp: mockWebp,
    avif: mockAvif,
    jpeg: mockJpeg,
    png: mockPng,
    toBuffer: mockToBuffer,
  })

  const mockSharp = vi.fn().mockReturnValue({
    metadata: mockMetadata,
    resize: mockResize,
    webp: mockWebp,
    avif: mockAvif,
    jpeg: mockJpeg,
    png: mockPng,
    toBuffer: mockToBuffer,
  })

  return {
    default: mockSharp,
  }
})

// Mock fetch
global.fetch = vi.fn()

describe('API: /api/images', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/images', () => {
    it('should return 429 if rate limit exceeded', async () => {
      const { rateLimit } = await import('@/lib/rate-limit')
      vi.mocked(rateLimit).mockResolvedValue({ success: false } as any)

      const route = await import('@/app/api/images/route')
      const request = new NextRequest('http://localhost:3000/api/images?url=https://images.unsplash.com/test.jpg')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toBe('Rate limit exceeded')
    })

    it('should return 400 if URL is missing', async () => {
      const { rateLimit } = await import('@/lib/rate-limit')
      vi.mocked(rateLimit).mockResolvedValue({ success: true } as any)

      const route = await import('@/app/api/images/route')
      const request = new NextRequest('http://localhost:3000/api/images')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Image URL is required')
    })

    it('should return 403 if domain is not allowed', async () => {
      const { rateLimit } = await import('@/lib/rate-limit')
      vi.mocked(rateLimit).mockResolvedValue({ success: true } as any)

      const route = await import('@/app/api/images/route')
      const request = new NextRequest('http://localhost:3000/api/images?url=https://malicious-site.com/image.jpg')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Domain not allowed')
    })

    it('should return error if image fetch fails', async () => {
      const { rateLimit } = await import('@/lib/rate-limit')
      vi.mocked(rateLimit).mockResolvedValue({ success: true } as any)

      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 404,
      } as any)

      const route = await import('@/app/api/images/route')
      const request = new NextRequest('http://localhost:3000/api/images?url=https://images.unsplash.com/test.jpg')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Failed to fetch image')
    })

    it('should optimize image successfully', async () => {
      const { rateLimit } = await import('@/lib/rate-limit')
      vi.mocked(rateLimit).mockResolvedValue({ success: true } as any)

      const mockImageBuffer = Buffer.from('image-data')
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        arrayBuffer: vi.fn().mockResolvedValue(mockImageBuffer.buffer),
      } as any)

      const route = await import('@/app/api/images/route')
      const request = new NextRequest('http://localhost:3000/api/images?url=https://images.unsplash.com/test.jpg&w=800&q=85&f=webp')

      const response = await route.GET(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('image/webp')
      expect(response.headers.get('X-Optimized-By')).toBe('Sharp')
    })

    it('should use default parameters when not provided', async () => {
      const { rateLimit } = await import('@/lib/rate-limit')
      vi.mocked(rateLimit).mockResolvedValue({ success: true } as any)

      const mockImageBuffer = Buffer.from('image-data')
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        arrayBuffer: vi.fn().mockResolvedValue(mockImageBuffer.buffer),
      } as any)

      const route = await import('@/app/api/images/route')
      const request = new NextRequest('http://localhost:3000/api/images?url=https://images.unsplash.com/test.jpg')

      const response = await route.GET(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('image/webp')
    })
  })
})

