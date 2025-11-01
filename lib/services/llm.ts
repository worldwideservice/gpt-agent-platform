/**
 * Сервис для работы с LLM через OpenRouter
 */

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenRouterRequest {
  model: string
  messages: OpenRouterMessage[]
  temperature?: number
  max_tokens?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
}

interface OpenRouterResponse {
  id: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string | null
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

interface ChatOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  knowledgeContext?: string
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
}

/**
 * Получает API ключ OpenRouter из настроек организации
 */
const getOpenRouterApiKey = async (organizationId: string): Promise<string | null> => {
  // TODO: Получать из настроек организации или из env для демо
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    console.warn('OPENROUTER_API_KEY not found in environment')
    return null
  }

  return apiKey
}

/**
 * Отправляет запрос к OpenRouter API
 */
const callOpenRouter = async (
  apiKey: string,
  request: OpenRouterRequest,
): Promise<OpenRouterResponse> => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'GPT Agent Platform',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  return (await response.json()) as OpenRouterResponse
}

/**
 * Формирует системный промпт с инструкциями агента и контекстом из базы знаний
 */
const buildSystemPrompt = (
  agentInstructions?: string | null,
  knowledgeContext?: string,
): string => {
  const parts: string[] = []

  if (agentInstructions) {
    parts.push('## Инструкции агента\n')
    parts.push(agentInstructions.trim())
    parts.push('\n')
  }

  if (knowledgeContext) {
    parts.push('## Контекст из базы знаний\n')
    parts.push(knowledgeContext.trim())
    parts.push('\n')
  }

  parts.push('\n## Важные правила:\n')
  parts.push('- Отвечай дружелюбно и профессионально\n')
  parts.push('- Используй информацию из базы знаний, если она релевантна\n')
  parts.push('- Если не знаешь ответа, честно признайся\n')
  parts.push('- Форматируй ответы для лучшей читаемости\n')

  return parts.join('')
}

/**
 * Основная функция для генерации ответа от LLM
 */
export const generateChatResponse = async (
  organizationId: string,
  userMessage: string,
  options: ChatOptions = {},
): Promise<{
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
}> => {
  const apiKey = await getOpenRouterApiKey(organizationId)

  if (!apiKey) {
    throw new Error('OpenRouter API ключ не настроен. Пожалуйста, настройте интеграцию.')
  }

  const {
    model = 'openai/gpt-4o-mini',
    temperature = 0.7,
    maxTokens = 1000,
    systemPrompt,
    knowledgeContext,
    conversationHistory = [],
  } = options

  const messages: OpenRouterMessage[] = []

  // Добавляем системный промпт с инструкциями и контекстом
  const fullSystemPrompt = buildSystemPrompt(systemPrompt, knowledgeContext)
  if (fullSystemPrompt) {
    messages.push({
      role: 'system',
      content: fullSystemPrompt,
    })
  }

  // Добавляем историю диалога (последние 10 сообщений)
  const recentHistory = conversationHistory.slice(-10)
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })
  }

  // Добавляем текущее сообщение пользователя
  messages.push({
    role: 'user',
    content: userMessage,
  })

  const request: OpenRouterRequest = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  }

  const response = await callOpenRouter(apiKey, request)

  if (!response.choices || response.choices.length === 0) {
    throw new Error('OpenRouter вернул пустой ответ')
  }

  const choice = response.choices[0]
  const content = choice.message.content

  if (!content) {
    throw new Error('Пустой контент в ответе от OpenRouter')
  }

  return {
    content,
    usage: {
      promptTokens: response.usage.prompt_tokens,
      completionTokens: response.usage.completion_tokens,
      totalTokens: response.usage.total_tokens,
    },
    model,
  }
}

/**
 * Получает список доступных моделей из OpenRouter
 */
export const getAvailableModels = async (organizationId: string): Promise<
  Array<{
    id: string
    name: string
    description?: string
    pricing?: {
      prompt: string
      completion: string
    }
  }>
> => {
  const apiKey = await getOpenRouterApiKey(organizationId)

  if (!apiKey) {
    return [
      { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'openai/gpt-4', name: 'GPT-4' },
      { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
      { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
      { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet' },
    ]
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      console.warn('Failed to fetch models from OpenRouter, using default list')
      return [
        { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini' },
        { id: 'openai/gpt-4', name: 'GPT-4' },
        { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
      ]
    }

    const data = (await response.json()) as {
      data: Array<{
        id: string
        name?: string
        description?: string
        pricing?: {
          prompt: string
          completion: string
        }
      }>
    }

    return data.data
      .filter((model) => model.id.includes('gpt') || model.id.includes('claude'))
      .slice(0, 10)
      .map((model) => ({
        id: model.id,
        name: model.name || model.id.split('/')[1] || model.id,
        description: model.description,
        pricing: model.pricing,
      }))
  } catch (error) {
    console.error('Error fetching models from OpenRouter', error)
    return [
      { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'openai/gpt-4', name: 'GPT-4' },
      { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    ]
  }
}

export type { ChatOptions, OpenRouterMessage }














