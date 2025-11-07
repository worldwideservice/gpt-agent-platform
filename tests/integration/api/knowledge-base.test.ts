import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/knowledge-base', () => ({
  getKnowledgeBaseArticles: vi.fn(),
  createKnowledgeBaseArticle: vi.fn(),
  getKnowledgeBaseArticleById: vi.fn(),
  updateKnowledgeBaseArticle: vi.fn(),
  deleteKnowledgeBaseArticle: vi.fn(),
}))

describe('API: /api/knowledge-base/articles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/knowledge-base/articles', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/knowledge-base/articles/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should return articles list', async () => {
      const { auth } = await import('@/auth')
      const { getKnowledgeBaseArticles } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockArticles = [
        {
          id: 'article-1',
          title: 'Test Article 1',
          content: 'Content 1',
          categoryId: 'category-1',
          isPublished: true,
          createdAt: '2025-01-26T00:00:00Z',
        },
        {
          id: 'article-2',
          title: 'Test Article 2',
          content: 'Content 2',
          categoryId: null,
          isPublished: false,
          createdAt: '2025-01-26T01:00:00Z',
        },
      ]

      vi.mocked(getKnowledgeBaseArticles).mockResolvedValue(mockArticles)

      const route = await import('@/app/api/knowledge-base/articles/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockArticles)
      expect(data.timestamp).toBeDefined()
      expect(getKnowledgeBaseArticles).toHaveBeenCalledWith('org-123', undefined, undefined)
    })

    it('should filter articles by categoryId', async () => {
      const { auth } = await import('@/auth')
      const { getKnowledgeBaseArticles } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const categoryId = '550e8400-e29b-41d4-a716-446655440000'
      const mockArticles = [
        {
          id: 'article-1',
          title: 'Test Article',
          content: 'Content',
          categoryId,
          isPublished: true,
        },
      ]

      vi.mocked(getKnowledgeBaseArticles).mockResolvedValue(mockArticles)

      const route = await import('@/app/api/knowledge-base/articles/route')
      const request = new NextRequest(
        `http://localhost:3000/api/knowledge-base/articles?categoryId=${categoryId}`,
      )
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(getKnowledgeBaseArticles).toHaveBeenCalledWith('org-123', categoryId, undefined)
    })

    it('should search articles by query', async () => {
      const { auth } = await import('@/auth')
      const { getKnowledgeBaseArticles } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const searchQuery = 'test query'
      const mockArticles = [
        {
          id: 'article-1',
          title: 'Test Article',
          content: 'Content',
          categoryId: null,
          isPublished: true,
        },
      ]

      vi.mocked(getKnowledgeBaseArticles).mockResolvedValue(mockArticles)

      const route = await import('@/app/api/knowledge-base/articles/route')
      const request = new NextRequest(
        `http://localhost:3000/api/knowledge-base/articles?search=${encodeURIComponent(searchQuery)}`,
      )
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(getKnowledgeBaseArticles).toHaveBeenCalledWith('org-123', undefined, searchQuery)
    })

    it('should return 400 for invalid categoryId format', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/knowledge-base/articles/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles?categoryId=invalid-uuid')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные параметры запроса')
    })

    it('should handle errors gracefully', async () => {
      const { auth } = await import('@/auth')
      const { getKnowledgeBaseArticles } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getKnowledgeBaseArticles).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/knowledge-base/articles/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBeDefined()
    })
  })

  describe('POST /api/knowledge-base/articles', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/knowledge-base/articles/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Article',
          content: 'Content',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should create article with valid data', async () => {
      const { auth } = await import('@/auth')
      const { createKnowledgeBaseArticle } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockArticle = {
        id: 'article-123',
        title: 'Test Article',
        content: 'Test Content',
        categoryId: null,
        isPublished: false,
        slug: 'test-article',
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
      }

      vi.mocked(createKnowledgeBaseArticle).mockResolvedValue(mockArticle)

      const route = await import('@/app/api/knowledge-base/articles/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Article',
          content: 'Test Content',
          slug: 'test-article',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockArticle)
      expect(data.timestamp).toBeDefined()
      expect(createKnowledgeBaseArticle).toHaveBeenCalledWith('org-123', {
        title: 'Test Article',
        content: 'Test Content',
        categoryId: undefined,
        slug: 'test-article',
        isPublished: undefined,
      })
    })

    it('should return 400 if title is missing', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/knowledge-base/articles/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles', {
        method: 'POST',
        body: JSON.stringify({
          content: 'Test Content',
          // Missing title
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
      expect(data.details).toBeDefined()
    })

    it('should return 400 if content is missing', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/knowledge-base/articles/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Article',
          // Missing content
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
    })

    it('should create article with categoryId', async () => {
      const { auth } = await import('@/auth')
      const { createKnowledgeBaseArticle } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const categoryId = '550e8400-e29b-41d4-a716-446655440000'
      const mockArticle = {
        id: 'article-123',
        title: 'Test Article',
        content: 'Test Content',
        categoryId,
        isPublished: true,
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
      }

      vi.mocked(createKnowledgeBaseArticle).mockResolvedValue(mockArticle)

      const route = await import('@/app/api/knowledge-base/articles/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Article',
          content: 'Test Content',
          categoryId,
          isPublished: true,
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(createKnowledgeBaseArticle).toHaveBeenCalledWith('org-123', {
        title: 'Test Article',
        content: 'Test Content',
        categoryId,
        slug: undefined,
        isPublished: true,
      })
    })

    it('should handle errors gracefully', async () => {
      const { auth } = await import('@/auth')
      const { createKnowledgeBaseArticle } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(createKnowledgeBaseArticle).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/knowledge-base/articles/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Article',
          content: 'Test Content',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBeDefined()
    })
  })
})


