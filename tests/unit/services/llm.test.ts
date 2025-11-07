import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Мокаем fetch перед импортом
const mockFetch = vi.fn()
global.fetch = mockFetch

// Мокаем process.env
const originalEnv = process.env

describe('LLM Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('generateChatResponse', () => {
    it('should throw error if API key is not configured', async () => {
      delete process.env.OPENROUTER_API_KEY

      const { generateChatResponse } = await import('@/lib/services/llm')

      await expect(
        generateChatResponse('org-123', 'Hello', {}),
      ).rejects.toThrow('OpenRouter API ключ не настроен')
    })

    it('should call OpenRouter API with correct parameters', async () => {
      process.env.OPENROUTER_API_KEY = 'test-api-key'
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'chat-123',
          choices: [
            {
              message: {
                role: 'assistant',
                content: 'Hello! How can I help you?',
              },
              finish_reason: 'stop',
            },
          ],
          usage: {
            prompt_tokens: 10,
            completion_tokens: 5,
            total_tokens: 15,
          },
        }),
      })

      const { generateChatResponse } = await import('@/lib/services/llm')

      const result = await generateChatResponse('org-123', 'Hello', {
        model: 'openai/gpt-4o-mini',
        temperature: 0.7,
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://openrouter.ai/api/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'GPT Agent Platform',
          }),
        }),
      )

      expect(result.content).toBe('Hello! How can I help you?')
      expect(result.usage.promptTokens).toBe(10)
      expect(result.usage.completionTokens).toBe(5)
      expect(result.usage.totalTokens).toBe(15)
      expect(result.model).toBe('openai/gpt-4o-mini')
    })

    it('should include system prompt in request', async () => {
      process.env.OPENROUTER_API_KEY = 'test-api-key'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'chat-123',
          choices: [
            {
              message: { role: 'assistant', content: 'Response' },
              finish_reason: 'stop',
            },
          ],
          usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
        }),
      })

      const { generateChatResponse } = await import('@/lib/services/llm')

      await generateChatResponse('org-123', 'Hello', {
        systemPrompt: 'You are a helpful assistant',
      })

      const callArgs = mockFetch.mock.calls[0][1]
      const body = JSON.parse(callArgs.body)
      expect(body.messages[0].role).toBe('system')
      expect(body.messages[0].content).toContain('You are a helpful assistant')
    })

    it('should include conversation history in request', async () => {
      process.env.OPENROUTER_API_KEY = 'test-api-key'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'chat-123',
          choices: [
            {
              message: { role: 'assistant', content: 'Response' },
              finish_reason: 'stop',
            },
          ],
          usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
        }),
      })

      const { generateChatResponse } = await import('@/lib/services/llm')

      await generateChatResponse('org-123', 'Hello', {
        conversationHistory: [
          { role: 'user', content: 'Previous message' },
          { role: 'assistant', content: 'Previous response' },
        ],
      })

      const callArgs = mockFetch.mock.calls[0][1]
      const body = JSON.parse(callArgs.body)
      expect(body.messages.length).toBeGreaterThan(1)
      expect(body.messages[body.messages.length - 1].content).toBe('Hello')
    })

    it('should handle API errors correctly', async () => {
      process.env.OPENROUTER_API_KEY = 'test-api-key'

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Invalid API key',
      })

      const { generateChatResponse } = await import('@/lib/services/llm')

      await expect(
        generateChatResponse('org-123', 'Hello', {}),
      ).rejects.toThrow('OpenRouter API error: 401 Unauthorized')
    })

    it('should use default model if not specified', async () => {
      process.env.OPENROUTER_API_KEY = 'test-api-key'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'chat-123',
          choices: [
            {
              message: { role: 'assistant', content: 'Response' },
              finish_reason: 'stop',
            },
          ],
          usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
        }),
      })

      const { generateChatResponse } = await import('@/lib/services/llm')

      await generateChatResponse('org-123', 'Hello', {})

      const callArgs = mockFetch.mock.calls[0][1]
      const body = JSON.parse(callArgs.body)
      expect(body.model).toBe('openai/gpt-4o-mini')
    })
  })

  describe('getAvailableModels', () => {
    it('should return models if API key is configured', async () => {
      process.env.OPENROUTER_API_KEY = 'test-api-key'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            { id: 'openai/gpt-4', name: 'GPT-4' },
            { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
          ],
        }),
      })

      const { getAvailableModels } = await import('@/lib/services/llm')

      const models = await getAvailableModels('org-123')

      expect(models).toHaveLength(2)
      expect(models[0].id).toBe('openai/gpt-4')
    })

    it('should return default models if API key is not configured', async () => {
      delete process.env.OPENROUTER_API_KEY

      const { getAvailableModels } = await import('@/lib/services/llm')

      const models = await getAvailableModels('org-123')

      expect(models.length).toBeGreaterThan(0)
      expect(models[0].id).toBe('openai/gpt-4o-mini')
    })

    it('should return default models if API error occurs', async () => {
      process.env.OPENROUTER_API_KEY = 'test-api-key'

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Server error',
      })

      const { getAvailableModels } = await import('@/lib/services/llm')

      const models = await getAvailableModels('org-123')

      expect(models.length).toBeGreaterThan(0)
      expect(models[0].id).toBe('openai/gpt-4o-mini')
    })
  })
})

