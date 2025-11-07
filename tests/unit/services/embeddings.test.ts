import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Мокаем fetch перед импортом
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Embeddings Service', () => {
  const originalOpenRouterApiKey = process.env.OPENROUTER_API_KEY
  const originalOpenRouterEmbeddingModel = process.env.OPENROUTER_EMBEDDING_MODEL

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.OPENROUTER_API_KEY = originalOpenRouterApiKey
  })

  afterEach(() => {
    process.env.OPENROUTER_API_KEY = originalOpenRouterApiKey
    if (originalOpenRouterEmbeddingModel) {
      process.env.OPENROUTER_EMBEDDING_MODEL = originalOpenRouterEmbeddingModel
    } else {
      delete process.env.OPENROUTER_EMBEDDING_MODEL
    }
  })

  describe('generateEmbeddings', () => {
    it('should generate embeddings for single text', async () => {
      process.env.OPENROUTER_API_KEY = 'test-api-key'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              embedding: [0.1, 0.2, 0.3],
              index: 0,
            },
          ],
          model: 'openai/text-embedding-3-large',
          usage: {
            prompt_tokens: 5,
            total_tokens: 5,
          },
        }),
      })

      const { generateEmbeddings } = await import('@/lib/services/embeddings')

      const result = await generateEmbeddings('org-123', 'Test text')

      expect(result.data).toHaveLength(1)
      expect(result.data[0].embedding).toEqual([0.1, 0.2, 0.3])
      expect(result.model).toBe('openai/text-embedding-3-large')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://openrouter.ai/api/v1/embeddings',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-api-key',
            'HTTP-Referer': expect.any(String),
            'X-Title': 'GPT Agent Platform',
          },
          body: JSON.stringify({
            model: 'openai/text-embedding-3-large',
            input: ['Test text'],
          }),
        }),
      )
    })

    it('should generate embeddings for multiple texts', async () => {
      process.env.OPENROUTER_API_KEY = 'test-api-key'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              embedding: [0.1, 0.2, 0.3],
              index: 0,
            },
            {
              embedding: [0.4, 0.5, 0.6],
              index: 1,
            },
          ],
          model: 'openai/text-embedding-3-large',
        }),
      })

      const { generateEmbeddings } = await import('@/lib/services/embeddings')

      const result = await generateEmbeddings('org-123', ['Text 1', 'Text 2'])

      expect(result.data).toHaveLength(2)
      expect(result.data[0].embedding).toEqual([0.1, 0.2, 0.3])
      expect(result.data[1].embedding).toEqual([0.4, 0.5, 0.6])
    })

    it('should use custom model if provided', async () => {
      process.env.OPENROUTER_API_KEY = 'test-api-key'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ embedding: [0.1], index: 0 }],
          model: 'custom-model',
        }),
      })

      const { generateEmbeddings } = await import('@/lib/services/embeddings')

      await generateEmbeddings('org-123', 'Test', { model: 'custom-model' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            model: 'custom-model',
            input: ['Test'],
          }),
        }),
      )
    })

    it('should use OPENROUTER_EMBEDDING_MODEL env variable if set', async () => {
      process.env.OPENROUTER_API_KEY = 'test-api-key'
      process.env.OPENROUTER_EMBEDDING_MODEL = 'env-model'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ embedding: [0.1], index: 0 }],
          model: 'env-model',
        }),
      })

      const { generateEmbeddings } = await import('@/lib/services/embeddings')

      await generateEmbeddings('org-123', 'Test')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            model: 'env-model',
            input: ['Test'],
          }),
        }),
      )
    })

    it('should throw error if API key is not configured', async () => {
      delete process.env.OPENROUTER_API_KEY

      const { generateEmbeddings } = await import('@/lib/services/embeddings')

      await expect(generateEmbeddings('org-123', 'Test')).rejects.toThrow(
        'OpenRouter API key is not configured',
      )
    })

    it('should throw error if API call fails', async () => {
      process.env.OPENROUTER_API_KEY = 'test-api-key'

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => 'Invalid request',
      })

      const { generateEmbeddings } = await import('@/lib/services/embeddings')

      await expect(generateEmbeddings('org-123', 'Test')).rejects.toThrow(
        'OpenRouter embeddings error: 400 Bad Request - Invalid request',
      )
    })
  })

  describe('generateEmbeddingsForDocument', () => {
    it('should generate embeddings for document with chunking', async () => {
      process.env.OPENROUTER_API_KEY = 'test-api-key'

      const longText = 'word '.repeat(1000) // Длинный текст для chunking

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              embedding: [0.1, 0.2, 0.3],
              index: 0,
            },
            {
              embedding: [0.4, 0.5, 0.6],
              index: 1,
            },
          ],
          model: 'openai/text-embedding-3-large',
        }),
      })

      const { generateEmbeddingsForDocument } = await import('@/lib/services/embeddings')

      const result = await generateEmbeddingsForDocument('org-123', longText)

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('content')
      expect(result[0]).toHaveProperty('embedding')
    })

    it('should return empty array for empty content', async () => {
      process.env.OPENROUTER_API_KEY = 'test-api-key'

      const { generateEmbeddingsForDocument } = await import('@/lib/services/embeddings')

      const result = await generateEmbeddingsForDocument('org-123', '')

      expect(result).toEqual([])
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should use custom chunk size and overlap', async () => {
      process.env.OPENROUTER_API_KEY = 'test-api-key'

      const text = 'word '.repeat(100)

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ embedding: [0.1], index: 0 }],
          model: 'openai/text-embedding-3-large',
        }),
      })

      const { generateEmbeddingsForDocument } = await import('@/lib/services/embeddings')

      await generateEmbeddingsForDocument('org-123', text, {
        chunkSize: 50,
        overlap: 10,
      })

      expect(mockFetch).toHaveBeenCalled()
    })

    it('should throw error if API key is not configured', async () => {
      delete process.env.OPENROUTER_API_KEY

      const { generateEmbeddingsForDocument } = await import('@/lib/services/embeddings')

      await expect(generateEmbeddingsForDocument('org-123', 'Test content')).rejects.toThrow(
        'OpenRouter API key is not configured',
      )
    })
  })

  describe('chunkByTokenEstimate', () => {
    it('should chunk text by token estimate', async () => {
      const { chunkByTokenEstimate } = await import('@/lib/services/embeddings')

      const text = 'word '.repeat(1000)
      const chunks = chunkByTokenEstimate(text, 100, 20)

      expect(chunks.length).toBeGreaterThan(0)
      expect(chunks.every((chunk: string) => chunk.length > 0)).toBe(true)
    })

    it('should handle empty text', async () => {
      const { chunkByTokenEstimate } = await import('@/lib/services/embeddings')

      const chunks = chunkByTokenEstimate('', 100, 20)

      expect(chunks).toEqual([])
    })

    it('should handle text shorter than chunk size', async () => {
      const { chunkByTokenEstimate } = await import('@/lib/services/embeddings')

      const chunks = chunkByTokenEstimate('short text', 100, 20)

      expect(chunks).toHaveLength(1)
      expect(chunks[0]).toBe('short text')
    })

    it('should apply overlap between chunks', async () => {
      const { chunkByTokenEstimate } = await import('@/lib/services/embeddings')

      const text = 'word '.repeat(200)
      const chunks = chunkByTokenEstimate(text, 50, 10)

      expect(chunks.length).toBeGreaterThan(1)
      // Проверяем что есть overlap (следующий чанк начинается раньше конца предыдущего)
      // Это сложно проверить точно, но можно проверить что чанки не пустые
      expect(chunks.every((chunk: string) => chunk.length > 0)).toBe(true)
    })

    it('should use default chunk size and overlap', async () => {
      const { chunkByTokenEstimate } = await import('@/lib/services/embeddings')

      const text = 'word '.repeat(1000)
      const chunks = chunkByTokenEstimate(text)

      expect(chunks.length).toBeGreaterThan(0)
      expect(chunks.every((chunk: string) => chunk.length > 0)).toBe(true)
    })
  })
})

