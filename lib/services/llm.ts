import { type OpenRouterMessage } from '@/lib/services/ai/openrouter.client'
import { resolveOpenRouterClient } from '@/lib/services/ai/openrouter-resolver'
import { resolveOrganizationAiConfiguration } from '@/lib/services/ai/configuration-resolver'

/**
 * Сервис для работы с LLM через OpenRouter
 */

interface ChatOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  knowledgeContext?: string
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
}

const buildSystemPrompt = (
  agentInstructions?: string | null,
  knowledgeContext?: string,
): string => {
  const parts: string[] = []

  if (agentInstructions) {
    parts.push('## Инструкции агента')
    parts.push(agentInstructions.trim())
    parts.push('')
  }

  if (knowledgeContext) {
    parts.push('## Контекст из базы знаний')
    parts.push(knowledgeContext.trim())
    parts.push('')
  }

  parts.push('## Важные правила')
  parts.push('- Отвечай дружелюбно и профессионально')
  parts.push('- Используй информацию из базы знаний, если она релевантна')
  parts.push('- Если не знаешь ответа, честно признайся')
  parts.push('- Форматируй ответы для лучшей читаемости')

  return parts.join('\n')
}

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
  const [configuration, client] = await Promise.all([
    resolveOrganizationAiConfiguration(organizationId),
    resolveOpenRouterClient(organizationId),
  ])

  const {
    model = configuration.defaultModel ?? client.defaultModel,
    temperature = 0.7,
    maxTokens = 1000,
    systemPrompt,
    knowledgeContext,
    conversationHistory = [],
  } = options

  const messages: OpenRouterMessage[] = []

  const fullSystemPrompt = buildSystemPrompt(systemPrompt, knowledgeContext)
  if (fullSystemPrompt) {
    messages.push({ role: 'system', content: fullSystemPrompt })
  }

  const recentHistory = conversationHistory.slice(-10)
  for (const historyMessage of recentHistory) {
    messages.push({
      role: historyMessage.role,
      content: historyMessage.content,
    })
  }

  messages.push({ role: 'user', content: userMessage })

  const response = await client.chat(messages, {
    model,
    temperature,
    maxTokens,
  })

  const choice = response.choices[0]
  if (!choice?.message?.content) {
    throw new Error('LLM вернул пустой ответ')
  }

  return {
    content: choice.message.content,
    usage: {
      promptTokens: response.usage?.prompt_tokens ?? 0,
      completionTokens: response.usage?.completion_tokens ?? 0,
      totalTokens: response.usage?.total_tokens ?? 0,
    },
    model: response.model ?? model,
  }
}

export const getAvailableModels = async (): Promise<
  Array<{
    id: string
    name: string
    description?: string
  }>
> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models')
    if (!response.ok) {
      throw new Error('Request failed')
    }

    const payload = (await response.json()) as {
      data: Array<{ id: string; name?: string; description?: string }>
    }

    if (!payload?.data) {
      return defaultModels
    }

    return payload.data.map((model) => ({
      id: model.id,
      name: model.name ?? model.id,
      description: model.description,
    }))
  } catch (error) {
    console.warn(
      'Failed to fetch models from OpenRouter, returning default list',
      error,
    )
    return defaultModels
  }
}

const defaultModels = [
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet' },
]
