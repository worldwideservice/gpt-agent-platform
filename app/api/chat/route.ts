import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import {
  createConversation,
  getConversationById,
  addMessageToConversation,
  getConversationMessages,
} from '@/lib/repositories/conversations'
import { searchKnowledgeBase, formatKnowledgeContext } from '@/lib/repositories/knowledge-search'
import { getAgentById } from '@/lib/repositories/agents'
import { generateChatResponse } from '@/lib/services/llm'
import { buildFullSystemPrompt } from '@/lib/services/agent-context-builder'

const sendMessageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional(),
  message: z.string().min(1, 'Сообщение не может быть пустым'),
  useKnowledgeBase: z.boolean().optional().default(true),
})

/**
 * POST /api/chat - Отправка сообщения в чат
 */
export const POST = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = sendMessageSchema.safeParse(body)

    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => issue.message)
      return NextResponse.json(
        {
          success: false,
          error: 'Некорректные данные',
          details: issues,
        },
        { status: 400 },
      )
    }

    const { conversationId, agentId, message, useKnowledgeBase } = parsed.data
    const organizationId = session.user.orgId
    const userId = session.user.id

    // Определяем или создаем диалог
    let conversation

    if (conversationId) {
      conversation = await getConversationById(conversationId, organizationId)
      if (!conversation) {
        return NextResponse.json({ success: false, error: 'Диалог не найден' }, { status: 404 })
      }
    } else {
      // Создаем новый диалог
      conversation = await createConversation(organizationId, {
        agentId: agentId ?? null,
        userId,
        title: message.slice(0, 50), // Первые 50 символов как заголовок
      })
    }

    // Сохраняем сообщение пользователя
    await addMessageToConversation(conversation.id, {
      role: 'user',
      content: message,
    })

    // Получаем инструкции агента и определяем этап воронки (если есть)
    let agentInstructions: string | null = null
    let agentModel: string | undefined
    let pipelineStageId: string | null = null

    if (agentId || conversation.agentId) {
      const effectiveAgentId = agentId || conversation.agentId
      if (effectiveAgentId) {
        try {
          const agent = await getAgentById(effectiveAgentId, organizationId)
          if (agent) {
            agentInstructions = 'instructions' in agent ? agent.instructions ?? null : null
            agentModel = agent.model ?? undefined
            
            // TODO: Определить pipeline_stage_id из CRM если есть активная сделка
            // Можно получить из conversation.metadata или через CRM API
          }
        } catch (error) {
          console.error('Failed to fetch agent', error)
        }
      }
    }

    // Получаем историю диалога
    const historyMessages = await getConversationMessages(conversation.id, { limit: 10 })

    // Формируем историю для LLM (только user и assistant сообщения)
    const conversationHistory = historyMessages
      .filter((msg) => msg.role !== 'system')
      .map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }))

    // Строим полный контекст агента (КАГ - Knowledge Augmented Generation)
    // Включает: знания компании, скрипты продаж, ответы на возражения, векторный поиск, Knowledge Graph
    let fullSystemPrompt: string | null = null

    if (useKnowledgeBase) {
      try {
        fullSystemPrompt = await buildFullSystemPrompt({
          organizationId,
          agentId: agentId || conversation.agentId || null,
          pipelineStageId,
          userMessage: message,
          conversationHistory,
          agentInstructions,
        })
      } catch (error) {
        console.error('Failed to build agent context', error)
        // Fallback к старому методу
        try {
          const knowledgeChunks = await searchKnowledgeBase(
            organizationId,
            message,
            agentId || conversation.agentId || null,
            5,
          )
          if (knowledgeChunks.length > 0) {
            fullSystemPrompt = buildSystemPrompt(agentInstructions, formatKnowledgeContext(knowledgeChunks))
          } else {
            fullSystemPrompt = agentInstructions
          }
        } catch (fallbackError) {
          console.error('Fallback knowledge search failed', fallbackError)
          fullSystemPrompt = agentInstructions
        }
      }
    } else {
      fullSystemPrompt = agentInstructions
    }

    // Генерируем ответ от LLM с полным контекстом
    const llmResponse = await generateChatResponse(organizationId, message, {
      model: agentModel,
      systemPrompt: fullSystemPrompt ?? undefined,
      conversationHistory,
    })

    // Вспомогательная функция для buildSystemPrompt (если не используется новый билдер)
    function buildSystemPrompt(instructions: string | null, context?: string): string | null {
      if (!instructions && !context) return null
      
      const parts: string[] = []
      if (instructions) parts.push(instructions)
      if (context) {
        parts.push('\n\n## Контекст из базы знаний:\n')
        parts.push(context)
      }
      return parts.join('\n')
    }

    // Сохраняем ответ агента
    await addMessageToConversation(conversation.id, {
      role: 'assistant',
      content: llmResponse.content,
      metadata: {
        model: llmResponse.model,
        usage: llmResponse.usage,
        usedKnowledgeBase: useKnowledgeBase && (fullSystemPrompt?.includes('Контекст из базы знаний') ?? false),
      },
    })

    // Обновляем заголовок диалога на основе первого сообщения, если еще не установлен
    if (!conversation.title && message.length > 0) {
      // Это уже сделано при создании диалога выше
    }

    return NextResponse.json({
      success: true,
      data: {
        conversationId: conversation.id,
        message: llmResponse.content,
        usage: llmResponse.usage,
        model: llmResponse.model,
      },
    })
  } catch (error) {
    console.error('Chat API error', error)

    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось обработать сообщение',
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}

/**
 * GET /api/chat - Получение диалогов или сообщений
 */
export const GET = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversationId')
  const agentId = searchParams.get('agentId')

  try {
    if (conversationId) {
      // Получаем сообщения конкретного диалога
      const { getConversationMessages: getMessages } = await import('@/lib/repositories/conversations')
      const messages = await getMessages(conversationId)

      return NextResponse.json({
        success: true,
        data: messages,
      })
    }

    // Получаем список диалогов
    const { getConversations } = await import('@/lib/repositories/conversations')
    const { conversations, total } = await getConversations(session.user.orgId, {
      agentId: agentId ?? null,
      userId: session.user.id,
      limit: 50,
    })

    return NextResponse.json({
      success: true,
      data: conversations,
      pagination: {
        total,
      },
    })
  } catch (error) {
    console.error('Chat GET API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить данные',
      },
      { status: 500 },
    )
  }
}


