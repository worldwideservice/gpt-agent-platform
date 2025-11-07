import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchKnowledgeBase, formatKnowledgeContext } from '@/lib/repositories/knowledge-search'

// Мокаем generateEmbeddings
vi.mock('@/lib/services/embeddings', () => ({
  generateEmbeddings: vi.fn(),
}))

// Мокаем Supabase
const mockSupabaseClient: any = {
  from: vi.fn(),
  rpc: vi.fn(),
}

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('Knowledge Search Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('searchKnowledgeBase', () => {
    it('should search knowledge base using vector search', async () => {
      const { generateEmbeddings } = await import('@/lib/services/embeddings')
      
      // Мокаем generateEmbeddings для возврата embedding
      vi.mocked(generateEmbeddings).mockResolvedValue({
        data: [{ embedding: [0.1, 0.2, 0.3] }],
      })

      const mockMatches = [
        {
          id: 'chunk-1',
          article_id: 'article-1',
          content: 'Test content',
          similarity: 0.8,
          metadata: { articleTitle: 'Test Article' },
        },
      ]

      mockSupabaseClient.rpc.mockResolvedValue({ data: mockMatches, error: null })

      const result = await searchKnowledgeBase('org-123', 'test', 10, null)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('chunk-1')
      expect(result[0].similarity).toBe(0.8)
    })

    it('should fallback to text search when vector search fails', async () => {
      const { generateEmbeddings } = await import('@/lib/services/embeddings')
      
      // Мокаем generateEmbeddings для возврата пустого embedding
      vi.mocked(generateEmbeddings).mockResolvedValue({
        data: [],
      })

      const mockArticles = [
        {
          id: 'article-1',
          title: 'Test Article',
          content: 'Test content with test query',
          category_id: 'cat-1',
          knowledge_base_categories: { name: 'Category 1' },
        },
      ]

      const queryChain: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        ilike: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockArticles, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await searchKnowledgeBase('org-123', 'test', 10, null)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('article-1')
      expect(result[0].similarity).toBe(0.3) // fallback similarity
    })

    it('should return empty array if no results found', async () => {
      const { generateEmbeddings } = await import('@/lib/services/embeddings')
      
      vi.mocked(generateEmbeddings).mockResolvedValue({
        data: [],
      })

      const queryChain: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        ilike: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: [], error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await searchKnowledgeBase('org-123', 'nonexistent', 10, null)

      expect(result).toEqual([])
    })

    it('should handle errors gracefully', async () => {
      const { generateEmbeddings } = await import('@/lib/services/embeddings')
      
      vi.mocked(generateEmbeddings).mockRejectedValue(new Error('Embedding error'))

      const queryChain: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        ilike: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await searchKnowledgeBase('org-123', 'test', 10, null)

      expect(result).toEqual([])
    })

    it('should limit results to maxResults', async () => {
      const { generateEmbeddings } = await import('@/lib/services/embeddings')
      
      vi.mocked(generateEmbeddings).mockResolvedValue({
        data: [],
      })

      const queryChain: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        ilike: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: [], error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      await searchKnowledgeBase('org-123', 'test', 5, null)

      // Проверяем, что limit был вызван (может быть вызван несколько раз в цепочке)
      expect(queryChain.limit).toHaveBeenCalled()
    })
  })

  describe('formatKnowledgeContext', () => {
    it('should format knowledge context from chunks', () => {
      const chunks: any[] = [
        {
          id: 'chunk-1',
          content: 'Test content here',
          metadata: {
            articleTitle: 'Test Article',
            categoryName: 'Category 1',
          },
          similarity: 0.8,
        },
      ]

      const result = formatKnowledgeContext(chunks)

      expect(result).toContain('Test Article')
      expect(result).toContain('Категория: Category 1')
      expect(result).toContain('Test content here')
    })

    it('should return empty string for empty chunks', () => {
      const result = formatKnowledgeContext([])

      expect(result).toBe('')
    })

    it('should limit content length to 500 characters', () => {
      const longContent = 'a'.repeat(600)
      const chunks: any[] = [
        {
          id: 'chunk-1',
          content: longContent,
          metadata: {},
          similarity: 0.8,
        },
      ]

      const result = formatKnowledgeContext(chunks)

      // Проверяем, что контент обрезан до 500 символов
      const contentPart = result.split('\n\n').find(part => part.includes('a'))
      if (contentPart) {
        expect(contentPart.length).toBeLessThanOrEqual(500)
      }
    })

    it('should format multiple chunks with separators', () => {
      const chunks: any[] = [
        {
          id: 'chunk-1',
          content: 'Content 1',
          metadata: { articleTitle: 'Article 1' },
          similarity: 0.8,
        },
        {
          id: 'chunk-2',
          content: 'Content 2',
          metadata: { articleTitle: 'Article 2' },
          similarity: 0.7,
        },
      ]

      const result = formatKnowledgeContext(chunks)

      expect(result).toContain('Article 1')
      expect(result).toContain('Article 2')
      expect(result).toContain('Content 1')
      expect(result).toContain('Content 2')
      expect(result).toContain('---') // Separator
    })

    it('should handle chunks without metadata', () => {
      const chunks: any[] = [
        {
          id: 'chunk-1',
          content: 'Content without metadata',
          metadata: {},
          similarity: 0.8,
        },
      ]

      const result = formatKnowledgeContext(chunks)

      expect(result).toContain('Content without metadata')
      expect(result).not.toContain('**')
    })
  })

  describe('searchKnowledgeBase - edge cases', () => {
    it('should search with agentId filter', async () => {
      const { generateEmbeddings } = await import('@/lib/services/embeddings')
      
      vi.mocked(generateEmbeddings).mockResolvedValue({
        data: [{ embedding: [0.1, 0.2, 0.3] }],
      })

      const mockMatches = [
        {
          id: 'chunk-1',
          article_id: 'article-1',
          content: 'Agent-specific content',
          similarity: 0.9,
          metadata: {},
        },
      ]

      mockSupabaseClient.rpc.mockResolvedValue({ data: mockMatches, error: null })

      const result = await searchKnowledgeBase('org-123', 'test', 'agent-456', 5)

      expect(result).toHaveLength(1)
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith(
        'match_knowledge_chunks',
        expect.objectContaining({
          agent_uuid: 'agent-456',
        })
      )
    })

    it('should handle vector search with RPC error', async () => {
      const { generateEmbeddings } = await import('@/lib/services/embeddings')
      
      vi.mocked(generateEmbeddings).mockResolvedValue({
        data: [{ embedding: [0.1, 0.2, 0.3] }],
      })

      mockSupabaseClient.rpc.mockResolvedValue({ 
        data: null, 
        error: { message: 'RPC function not found' } 
      })

      const mockArticles = [
        {
          id: 'article-1',
          title: 'Fallback Article',
          content: 'Fallback content',
          category_id: 'cat-1',
          knowledge_base_categories: { name: 'Category 1' },
        },
      ]

      const queryChain: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        ilike: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockArticles, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await searchKnowledgeBase('org-123', 'test', null, 5)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('article-1')
      expect(result[0].similarity).toBe(0.3) // fallback similarity
    })

    it('should extract articleId from metadata when article_id is null', async () => {
      const { generateEmbeddings } = await import('@/lib/services/embeddings')
      
      vi.mocked(generateEmbeddings).mockResolvedValue({
        data: [{ embedding: [0.1, 0.2, 0.3] }],
      })

      const mockMatches = [
        {
          id: 'chunk-1',
          article_id: null,
          content: 'Test content',
          similarity: 0.8,
          metadata: { articleId: 'article-from-metadata' },
        },
      ]

      mockSupabaseClient.rpc.mockResolvedValue({ data: mockMatches, error: null })

      const result = await searchKnowledgeBase('org-123', 'test', null, 5)

      expect(result).toHaveLength(1)
      expect(result[0].metadata.articleId).toBe('article-from-metadata')
    })

    it('should handle empty embedding array', async () => {
      const { generateEmbeddings } = await import('@/lib/services/embeddings')
      
      vi.mocked(generateEmbeddings).mockResolvedValue({
        data: [{ embedding: [] }], // Empty embedding
      })

      const mockArticles = [
        {
          id: 'article-1',
          title: 'Text Search Article',
          content: 'Content',
          category_id: 'cat-1',
          knowledge_base_categories: { name: 'Category 1' },
        },
      ]

      const queryChain: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        ilike: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockArticles, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await searchKnowledgeBase('org-123', 'test', null, 5)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('article-1')
    })

    it('should handle matches with null similarity', async () => {
      const { generateEmbeddings } = await import('@/lib/services/embeddings')
      
      vi.mocked(generateEmbeddings).mockResolvedValue({
        data: [{ embedding: [0.1, 0.2, 0.3] }],
      })

      const mockMatches = [
        {
          id: 'chunk-1',
          article_id: 'article-1',
          content: 'Test content',
          similarity: null,
          metadata: {},
        },
      ]

      mockSupabaseClient.rpc.mockResolvedValue({ data: mockMatches, error: null })

      const result = await searchKnowledgeBase('org-123', 'test', null, 5)

      expect(result).toHaveLength(1)
      expect(result[0].similarity).toBe(0) // Default for null similarity
    })

    it('should handle custom limit parameter', async () => {
      const { generateEmbeddings } = await import('@/lib/services/embeddings')
      
      vi.mocked(generateEmbeddings).mockResolvedValue({
        data: [{ embedding: [0.1, 0.2, 0.3] }],
      })

      const mockMatches = Array(10).fill(null).map((_, i) => ({
        id: `chunk-${i}`,
        article_id: `article-${i}`,
        content: `Content ${i}`,
        similarity: 0.8,
        metadata: {},
      }))

      mockSupabaseClient.rpc.mockResolvedValue({ data: mockMatches, error: null })

      const result = await searchKnowledgeBase('org-123', 'test', null, 3)

      // Проверяем что limit был передан в RPC
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith(
        'match_knowledge_chunks',
        expect.objectContaining({
          match_count: 3,
        })
      )
      expect(result).toHaveLength(10) // Все результаты возвращаются, но limit передается в RPC
    })

    it('should handle embedding response with data but no embedding property', async () => {
      const { generateEmbeddings } = await import('@/lib/services/embeddings')
      
      vi.mocked(generateEmbeddings).mockResolvedValue({
        data: [{}], // data exists but no embedding property
      })

      const mockArticles = [
        {
          id: 'article-1',
          title: 'Fallback Article',
          content: 'Content',
          category_id: 'cat-1',
          knowledge_base_categories: { name: 'Category 1' },
        },
      ]

      const queryChain: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        ilike: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockArticles, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await searchKnowledgeBase('org-123', 'test', null, 5)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('article-1')
    })

    it('should handle matches with empty array after successful RPC', async () => {
      const { generateEmbeddings } = await import('@/lib/services/embeddings')
      
      vi.mocked(generateEmbeddings).mockResolvedValue({
        data: [{ embedding: [0.1, 0.2, 0.3] }],
      })

      mockSupabaseClient.rpc.mockResolvedValue({ data: [], error: null })

      const mockArticles = [
        {
          id: 'article-1',
          title: 'Text Search Article',
          content: 'Content',
          category_id: 'cat-1',
          knowledge_base_categories: { name: 'Category 1' },
        },
      ]

      const queryChain: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        ilike: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockArticles, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await searchKnowledgeBase('org-123', 'test', null, 5)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('article-1')
    })

    it('should handle matches with metadata containing additional fields', async () => {
      const { generateEmbeddings } = await import('@/lib/services/embeddings')
      
      vi.mocked(generateEmbeddings).mockResolvedValue({
        data: [{ embedding: [0.1, 0.2, 0.3] }],
      })

      const mockMatches = [
        {
          id: 'chunk-1',
          article_id: 'article-1',
          content: 'Test content',
          similarity: 0.8,
          metadata: {
            articleId: 'article-1',
            articleTitle: 'Test Article',
            categoryId: 'cat-1',
            categoryName: 'Category 1',
            customField: 'customValue', // Дополнительное поле
          },
        },
      ]

      mockSupabaseClient.rpc.mockResolvedValue({ data: mockMatches, error: null })

      const result = await searchKnowledgeBase('org-123', 'test', null, 5)

      expect(result).toHaveLength(1)
      expect(result[0].metadata.articleId).toBe('article-1')
      expect(result[0].metadata.articleTitle).toBe('Test Article')
      expect(result[0].metadata.customField).toBe('customValue')
    })

    it('should handle article with null category', async () => {
      const { generateEmbeddings } = await import('@/lib/services/embeddings')
      
      vi.mocked(generateEmbeddings).mockResolvedValue({
        data: [],
      })

      const mockArticles = [
        {
          id: 'article-1',
          title: 'Article without category',
          content: 'Content',
          category_id: null,
          knowledge_base_categories: null,
        },
      ]

      const queryChain: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        ilike: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockArticles, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await searchKnowledgeBase('org-123', 'test', null, 5)

      expect(result).toHaveLength(1)
      expect(result[0].metadata.categoryId).toBeNull()
      expect(result[0].metadata.categoryName).toBeUndefined()
    })
  })

  describe('formatKnowledgeContext - edge cases', () => {
    it('should handle chunks with only articleTitle', () => {
      const chunks: any[] = [
        {
          id: 'chunk-1',
          content: 'Content without category',
          metadata: {
            articleTitle: 'Article Title',
          },
          similarity: 0.8,
        },
      ]

      const result = formatKnowledgeContext(chunks)

      expect(result).toContain('Article Title')
      expect(result).toContain('Content without category')
      expect(result).not.toContain('Категория:')
    })

    it('should handle chunks with only categoryName', () => {
      const chunks: any[] = [
        {
          id: 'chunk-1',
          content: 'Content without title',
          metadata: {
            categoryName: 'Category Only',
          },
          similarity: 0.8,
        },
      ]

      const result = formatKnowledgeContext(chunks)

      expect(result).toContain('Категория: Category Only')
      expect(result).toContain('Content without title')
      expect(result).not.toContain('**')
    })

    it('should handle chunks with both articleTitle and categoryName', () => {
      const chunks: any[] = [
        {
          id: 'chunk-1',
          content: 'Full content',
          metadata: {
            articleTitle: 'Full Article',
            categoryName: 'Full Category',
          },
          similarity: 0.8,
        },
      ]

      const result = formatKnowledgeContext(chunks)

      expect(result).toContain('**Full Article**')
      expect(result).toContain('Категория: Full Category')
      expect(result).toContain('Full content')
    })

    it('should handle chunks with empty content', () => {
      const chunks: any[] = [
        {
          id: 'chunk-1',
          content: '',
          metadata: {
            articleTitle: 'Empty Content Article',
          },
          similarity: 0.8,
        },
      ]

      const result = formatKnowledgeContext(chunks)

      expect(result).toContain('Empty Content Article')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle chunks with very long content', () => {
      const longContent = 'a'.repeat(1000)
      const chunks: any[] = [
        {
          id: 'chunk-1',
          content: longContent,
          metadata: {},
          similarity: 0.8,
        },
      ]

      const result = formatKnowledgeContext(chunks)

      // Проверяем что контент обрезан до 500 символов
      const contentMatch = result.match(/a+/)
      if (contentMatch) {
        expect(contentMatch[0].length).toBeLessThanOrEqual(500)
      }
    })
  })
})
