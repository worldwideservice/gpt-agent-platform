import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { cache, cacheConfig, cacheKeys } from '@/lib/cache'
import { createErrorResponse } from '@/lib/utils/error-handler'
import { trackChatStarted, trackMessageSent } from '@/lib/analytics/examples'
import {
  createConversation,
  getConversationById,
  addMessageToConversation,
  getConversationMessages,
} from '@/lib/repositories/conversations'
import {
  searchKnowledgeBase,
  formatKnowledgeContext,
} from '@/lib/repositories/knowledge-search'
import { getAgentById } from '@/lib/repositories/agents'
import { generateChatResponse } from '@/lib/services/llm'
import {
  buildAgentContext,
  composeSystemPrompt,
  processConversationMemory,
} from '@/lib/services/agent-context-builder'
import type { AgentContext } from '@/lib/services/agent-context-builder'
import { resolveOrganizationAiConfiguration } from '@/lib/services/ai/configuration-resolver'
import { AgentActionsService } from '@/lib/services/agent-actions'
import { createKommoApiForOrg } from '@/lib/repositories/crm-connection'
import { isAgentConfiguredForStage } from '@/lib/repositories/agent-pipeline-settings'

const sendMessageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional(),
  message: z.string().min(1, 'Сообщение не может быть пустым'),
  useKnowledgeBase: z.boolean().optional().default(true),
  clientIdentifier: z.string().optional(), // email, phone или другой идентификатор клиента
})

type CachedAgentInstructionPayload = {
  instructions: string | null
  model?: string
  updatedAt?: string | null
}

/**
 * Анализирует разговор и автоматически выполняет действия агента
 */
async function analyzeAndExecuteActions(context: {
  organizationId: string
  agentId: string | null
  leadId: number
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  userMessage: string
}): Promise<void> {
  try {
    const actionsService = new AgentActionsService(context.organizationId)

    // Анализируем ситуацию и получаем предложения действий
    const suggestions = await actionsService.analyzeAndSuggestActions({
      organizationId: context.organizationId,
      agentId: context.agentId || '',
      leadId: context.leadId,
      conversationHistory: context.conversationHistory,
      userMessage: context.userMessage,
    })

    // Выполняем наиболее уверенное действие (если уверенность > 0.7)
    if (suggestions.length > 0 && suggestions[0].confidence > 0.7) {
      const action = suggestions[0]
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `🤖 Агент автоматически выполняет действие: ${action.reason} (уверенность: ${action.confidence})`,
        )
      }

      await actionsService.executeSuggestedAction(action, {
        organizationId: context.organizationId,
        agentId: context.agentId || '',
        leadId: context.leadId,
        conversationHistory: context.conversationHistory,
        userMessage: context.userMessage,
      })

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Действие выполнено: ${action.type}`)
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to analyze and execute actions:', error)
    }
  }
}

/**
 * @swagger
 * /api/chat:
 * post:
 * summary: Отправка сообщения в чат с ИИ-агентом
 * description: Отправляет сообщение пользователю и получает ответ от ИИ-агента с учетом контекста, знаний и памяти
 * tags:
 * - Chat
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - message
 * properties:
 * conversationId:
 * type: string
 * format: uuid
 * description: ID существующей беседы (опционально)
 * agentId:
 * type: string
 * format: uuid
 * description: ID ИИ-агента (опционально, будет использован агент из беседы)
 * message:
 * type: string
 * minLength: 1
 * description: Текст сообщения пользователя
 * useKnowledgeBase:
 * type: boolean
 * default: true
 * description: Использовать базу знаний для ответа
 * clientIdentifier:
 * type: string
 * description: Идентификатор клиента (email, phone) для персонализации ответов
 * example:
 * message: "Здравствуйте, мне нужна консультация по вашему продукту"
 * useKnowledgeBase: true
 * clientIdentifier: "user@example.com"
 * responses:
 * 200:
 * description: Успешный ответ от ИИ-агента
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success:
 * type: boolean
 * example: true
 * conversationId:
 * type: string
 * format: uuid
 * description: ID беседы
 * message:
 * type: object
 * properties:
 * id:
 * type: string
 * format: uuid
 * role:
 * type: string
 * enum: [assistant]
 * content:
 * type: string
 * description: Ответ ИИ-агента
 * createdAt:
 * type: string
 * format: date-time
 * metadata:
 * type: object
 * properties:
 * model:
 * type: string
 * description: Модель ИИ
 * usage:
 * type: object
 * properties:
 * promptTokens:
 * type: integer
 * completionTokens:
 * type: integer
 * totalTokens:
 * type: integer
 * usedKnowledgeBase:
 * type: boolean
 * description: Была ли использована база знаний
 * 400:
 * description: Неверные входные данные
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success:
 * type: boolean
 * example: false
 * error:
 * type: string
 * example: "Некорректные данные"
 * details:
 * type: array
 * items:
 * type: string
 * 401:
 * description: Не авторизован
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success:
 * type: boolean
 * example: false
 * error:
 * type: string
 * example: "Не авторизовано"
 * 500:
 * description: Внутренняя ошибка сервера
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success:
 * type: boolean
 * example: false
 * error:
 * type: string
 * example: "Внутренняя ошибка сервера"
 */
export const POST = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json(
      { success: false, error: 'Не авторизовано' },
      { status: 401 },
    )
  }

  try {
    const body = await request.json()
    const parsed = sendMessageSchema.safeParse(body)

    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => issue.message)
      const { response, status } = createErrorResponse(
        new Error('Некорректные данные'),
        {
          code: 'VALIDATION_ERROR',
          details: issues,
          logToSentry: false,
        },
      )
      return NextResponse.json(response, { status })
    }

    const {
      conversationId,
      agentId,
      message,
      useKnowledgeBase,
      clientIdentifier,
    } = parsed.data
    const organizationId = session.user.orgId
    const userId = session.user.id

    // Определяем или создаем диалог
    let conversation

    if (conversationId) {
      // ✅ SECURITY FIX: IDOR protection - verify conversation belongs to user's organization
      conversation = await getConversationById(conversationId, organizationId)
      if (!conversation) {
        return NextResponse.json(
          { success: false, error: 'Диалог не найден' },
          { status: 404 },
        )
      }

      // ✅ CRITICAL: Verify conversation belongs to current user's organization
      if (conversation.organizationId !== organizationId) {
        logger.warn('IDOR attempt detected: User tried to access conversation from different organization', {
          userId,
          userOrgId: organizationId,
          conversationId,
          conversationOrgId: conversation.organizationId,
        })
        return NextResponse.json(
          { success: false, error: 'Доступ запрещен' },
          { status: 403 },
        )
      }
    } else {
      // Создаем новый диалог
      conversation = await createConversation(organizationId, {
        agentId: agentId ?? null,
        userId,
        title: message.slice(0, 50), // Первые 50 символов как заголовок
      })

      // Track chat started for analytics
      try {
        trackChatStarted({
          conversationId: conversation.id,
          agentId: agentId ?? conversation.agentId ?? '',
          organizationId,
          userId,
          channel: 'web',
        })
      } catch (analyticsError) {
        console.error('Failed to track chat started', analyticsError)
      }
    }

    // Сохраняем сообщение пользователя
    await addMessageToConversation(conversation.id, {
      role: 'user',
      content: message,
    })

    // Track user message for analytics
    try {
      trackMessageSent({
        conversationId: conversation.id,
        agentId: agentId ?? conversation.agentId ?? '',
        role: 'user',
        messageLength: message.length,
        organizationId,
        userId,
      })
    } catch (analyticsError) {
      console.error('Failed to track user message', analyticsError)
    }

    // Получаем инструкции агента и определяем этап воронки (если есть)
    let agentInstructions: string | null = null
    let agentModel: string | undefined
    let pipelineStageId: string | null = null
    let canUseAgent = true // По умолчанию разрешаем использовать агента
    let agentResolved = false

    if (agentId || conversation.agentId) {
      const effectiveAgentId = agentId || conversation.agentId
      if (effectiveAgentId) {
        try {
          const cacheKey = cacheKeys.agentInstructions(
            organizationId,
            effectiveAgentId,
          )
          const cachedPayload =
            await cache.get<CachedAgentInstructionPayload>(cacheKey)

          if (cachedPayload) {
            agentInstructions = cachedPayload.instructions
            agentModel = cachedPayload.model ?? undefined
            agentResolved = true
          } else {
            const agent = await getAgentById(effectiveAgentId, organizationId)
            if (agent) {
              agentInstructions = agent.instructions ?? null
              agentModel = agent.model ?? undefined
              agentResolved = true

              await cache
                .set(
                  cacheKey,
                  {
                    instructions: agentInstructions,
                    model: agentModel,
                    updatedAt: agent.updatedAt ?? null,
                  },
                  cacheConfig.agentInstructions,
                )
                .catch(() => {})
            }
          }

          if (agentResolved) {
            // Определяем pipeline_id и stage_id из CRM если есть активная сделка
            let pipelineId: string | null = null

            // Получаем leadId из conversation.metadata или ищем по clientIdentifier
            let leadId: number | null = null

            if (
              conversation.metadata &&
              typeof conversation.metadata === 'object'
            ) {
              // Проверяем metadata на наличие leadId
              if (
                'leadId' in conversation.metadata &&
                typeof conversation.metadata.leadId === 'number'
              ) {
                leadId = conversation.metadata.leadId
              } else if (
                'lead_id' in conversation.metadata &&
                typeof conversation.metadata.lead_id === 'number'
              ) {
                leadId = conversation.metadata.lead_id
              }
            }

            // Если есть leadId, получаем информацию о сделке из Kommo
            if (leadId) {
              try {
                const kommoApi = await createKommoApiForOrg(organizationId)
                if (kommoApi) {
                  const lead = await kommoApi.getLead(leadId)

                  if (lead.pipeline_id) {
                    pipelineId = lead.pipeline_id.toString()
                  }

                  if (lead.status_id) {
                    pipelineStageId = lead.status_id.toString()
                  }

                  // Проверяем настройки агента для этого этапа
                  if (pipelineId && pipelineStageId) {
                    const isConfigured = await isAgentConfiguredForStage(
                      effectiveAgentId,
                      organizationId,
                      pipelineId,
                      pipelineStageId,
                    )

                    if (!isConfigured) {
                      canUseAgent = false
                      console.log(
                        `Agent ${effectiveAgentId} not configured for pipeline ${pipelineId} stage ${pipelineStageId}`,
                      )
                    }
                  }
                }
              } catch (error) {
                // Если не удалось получить данные из CRM, продолжаем без проверки
                console.error(
                  'Failed to fetch lead from CRM or check agent settings',
                  error,
                )
              }
            }
          }
        } catch (error) {
          console.error('Failed to fetch agent', error)
        }
      }
    }

    // Получаем историю диалога
    const historyMessages = await getConversationMessages(conversation.id, {
      limit: 10,
    })

    // Формируем историю для LLM (только user и assistant сообщения)
    const conversationHistory = historyMessages
      .filter((msg) => msg.role !== 'system')
      .map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }))

    // Если агент не настроен для этого этапа - не используем его
    if (!canUseAgent) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Агент не настроен для использования на данном этапе воронки. Настройте агента в разделе "Воронки"',
        },
        { status: 403 },
      )
    }

    const aiConfigurationPromise =
      resolveOrganizationAiConfiguration(organizationId)

    // Строим полный контекст агента (КАГ - Knowledge Augmented Generation)
    // Включает: знания компании, скрипты продаж, ответы на возражения, векторный поиск, Knowledge Graph
    let fullSystemPrompt: string | null = null
    let agentContext: AgentContext | null = null

    const createEmptyContext = (
      instructionsValue: string | null,
    ): AgentContext => ({
      companyKnowledge: '',
      salesScripts: '',
      objectionResponses: '',
      knowledgeGraph: '',
      vectorSearch: '',
      agentMemory: '',
      clientMemory: '',
      instructions: instructionsValue ?? '',
    })

    if (useKnowledgeBase) {
      try {
        agentContext = await buildAgentContext({
          organizationId,
          agentId: agentId || conversation.agentId || null,
          pipelineStageId,
          userMessage: message,
          conversationHistory,
          clientIdentifier: clientIdentifier || undefined,
          agentInstructions,
        })
        fullSystemPrompt = composeSystemPrompt(agentContext, agentInstructions)
      } catch (error) {
        console.error('Failed to build agent context', error)
        agentContext = agentContext ?? createEmptyContext(agentInstructions)

        try {
          const knowledgeChunks = await searchKnowledgeBase(
            organizationId,
            message,
            agentId || conversation.agentId || null,
            5,
          )
          if (knowledgeChunks.length > 0) {
            const knowledgeText = formatKnowledgeContext(knowledgeChunks)
            agentContext = {
              ...agentContext,
              vectorSearch: knowledgeText,
            }
            fullSystemPrompt = composeSystemPrompt(
              agentContext,
              agentInstructions,
            )
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

    const usedKnowledgeBase =
      useKnowledgeBase &&
      !!agentContext &&
      Boolean(
        agentContext.companyKnowledge ||
          agentContext.salesScripts ||
          agentContext.objectionResponses ||
          agentContext.vectorSearch ||
          agentContext.knowledgeGraph ||
          agentContext.agentMemory ||
          agentContext.clientMemory,
      )

    // Сохраняем ответ агента
    const assistantMessage = await addMessageToConversation(conversation.id, {
      role: 'assistant',
      content: llmResponse.content,
      metadata: {
        model: llmResponse.model,
        usage: llmResponse.usage,
        usedKnowledgeBase,
      },
    })

    // Track assistant message for analytics
    try {
      trackMessageSent({
        conversationId: conversation.id,
        agentId: agentId ?? conversation.agentId ?? '',
        role: 'agent',
        messageLength: llmResponse.content.length,
        organizationId,
        userId,
      })
    } catch (analyticsError) {
      console.error('Failed to track assistant message', analyticsError)
    }

    // Логируем ответ агента (асинхронно, не блокируем ответ)
    if (agentId || conversation.agentId) {
      const { ActivityLogger } = await import('@/lib/services/activity-logger')
      ActivityLogger.agentResponse(
        organizationId,
        agentId || conversation.agentId || '',
        conversation.id,
        llmResponse.content.length,
      ).catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to log agent response:', error)
        }
      })
    }

    // Обрабатываем память агента из разговора (асинхронно, не блокируем ответ)
    if (clientIdentifier) {
      const allMessages = await getConversationMessages(conversation.id)
      const conversationMessages = allMessages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }))

      // Запускаем обработку памяти в фоне
      processConversationMemory({
        organizationId,
        agentId: agentId || conversation.agentId || null,
        clientIdentifier,
        conversationMessages,
      }).catch((error: unknown) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Memory processing failed', error)
        }
      })
    }

    // Анализируем и предлагаем действия агента (асинхронно, не блокируем ответ)
    if (conversation.leadId && typeof conversation.leadId === 'number') {
      const allMessages = await getConversationMessages(conversation.id)
      const conversationHistory = allMessages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }))

      // Запускаем анализ действий в фоне
      analyzeAndExecuteActions({
        organizationId,
        agentId: agentId || conversation.agentId || null,
        leadId: conversation.leadId!,
        conversationHistory,
        userMessage: message,
      }).catch((error: unknown) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Action analysis failed', error)
        }
      })
    }

    // Обновляем заголовок диалога на основе первого сообщения, если еще не установлен
    if (!conversation.title && message.length > 0) {
      // Это уже сделано при создании диалога выше
    }

    const aiConfiguration = await aiConfigurationPromise

    return NextResponse.json({
      success: true,
      data: {
        conversationId: conversation.id,
        message: {
          id: assistantMessage.id,
          role: assistantMessage.role,
          content: assistantMessage.content,
          createdAt: assistantMessage.createdAt,
          metadata: assistantMessage.metadata,
        },
        usage: llmResponse.usage,
        model: llmResponse.model,
        context: agentContext,
        systemPrompt: fullSystemPrompt,
        configuration: aiConfiguration,
      },
    })
  } catch (error) {
    console.error('Chat API error', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Неизвестная ошибка'

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
    return NextResponse.json(
      { success: false, error: 'Не авторизовано' },
      { status: 401 },
    )
  }

  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversationId')
  const agentId = searchParams.get('agentId')

  try {
    if (conversationId) {
      // Получаем сообщения конкретного диалога
      const { getConversationMessages: getMessages } = await import(
        '@/lib/repositories/conversations'
      )
      const messages = await getMessages(conversationId)

      return NextResponse.json({
        success: true,
        data: {
          messages,
          conversationId,
        },
      })
    }

    // Получаем список диалогов
    const { getConversations } = await import(
      '@/lib/repositories/conversations'
    )
    const { conversations, total } = await getConversations(
      session.user.orgId,
      {
        agentId: agentId ?? null,
        userId: session.user.id,
        limit: 50,
      },
    )

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
