import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'
import { validateRequest } from '@/lib/validation/validate'
import { createTestMessageSchema } from '@/lib/validation/schemas/test-chat'

/**
 * POST /api/manage/[tenantId]/test-chat/conversations/[conversationId]/messages
 *
 * Отправляет сообщение пользователя и получает ответ от AI агента
 *
 * Security:
 * - Защищено middleware (tenant access control + rate limiting)
 * - RLS policies проверяют доступ к беседе
 *
 * Flow:
 * 1. Валидация входных данных
 * 2. Сохранение сообщения пользователя
 * 3. Получение контекста и истории чата
 * 4. Вызов AI модели (симулированный)
 * 5. Сохранение ответа ассистента
 * 6. Возврат обоих сообщений
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { tenantId: string; conversationId: string } }
) {
  try {
    // 1. Проверка аутентификации
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { tenantId, conversationId } = params

    // 2. Валидация входных данных
    const { data, error: validationError } = await validateRequest(
      request,
      createTestMessageSchema
    )
    if (validationError) {
      return validationError
    }

    const { content, agentId } = data

    // 3. Получаем organization ID из slug
    const supabase = getSupabaseServiceRoleClient()
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', tenantId)
      .single()

    if (orgError || !org) {
      logger.error('Test Chat POST message: Organization not found', orgError, {
        endpoint: `/api/manage/${tenantId}/test-chat/conversations/${conversationId}/messages`,
        tenantId,
        userId,
      })
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const orgId = org.id

    // 4. Проверяем доступ к беседе
    const { data: conversation, error: conversationError } = await supabase
      .from('test_conversations')
      .select('id, agent_id')
      .eq('id', conversationId)
      .eq('org_id', orgId)
      .eq('created_by', userId)
      .single()

    if (conversationError || !conversation) {
      logger.error('Test Chat POST message: Conversation not found', conversationError, {
        endpoint: `/api/manage/${tenantId}/test-chat/conversations/${conversationId}/messages`,
        tenantId,
        conversationId,
        userId,
      })
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      )
    }

    // 5. Получаем данные агента
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('id, name, model, instructions, settings')
      .eq('id', agentId)
      .eq('org_id', orgId)
      .single()

    if (agentError || !agent) {
      logger.error('Test Chat POST message: Agent not found', agentError, {
        endpoint: `/api/manage/${tenantId}/test-chat/conversations/${conversationId}/messages`,
        agentId,
        orgId,
      })
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // 6. Сохраняем сообщение пользователя
    const { data: userMessage, error: userMessageError } = await supabase
      .from('test_messages')
      .insert({
        conversation_id: conversationId,
        org_id: orgId,
        role: 'user',
        content: content,
      })
      .select()
      .single()

    if (userMessageError) {
      logger.error('Test Chat POST message: Failed to save user message', userMessageError, {
        endpoint: `/api/manage/${tenantId}/test-chat/conversations/${conversationId}/messages`,
        conversationId,
      })
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    // 7. Получаем историю чата для контекста (последние 20 сообщений)
    const { data: history } = await supabase
      .from('test_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(20)

    // 8. [СИМУЛЯЦИЯ AI] В production здесь будет вызов реального AI
    // Для демонстрации используем простую симуляцию
    const aiResponseContent = generateSimulatedResponse(content, agent, history || [])

    // 9. Сохраняем ответ ассистента
    const { data: assistantMessage, error: assistantMessageError } = await supabase
      .from('test_messages')
      .insert({
        conversation_id: conversationId,
        org_id: orgId,
        role: 'assistant',
        content: aiResponseContent,
        metadata: {
          agent_id: agentId,
          agent_name: agent.name,
          model: agent.model,
          tokens_used: Math.floor(content.length / 4 + aiResponseContent.length / 4), // Примерная оценка
          simulated: true, // Флаг что это симуляция
        },
      })
      .select()
      .single()

    if (assistantMessageError) {
      logger.error(
        'Test Chat POST message: Failed to save assistant message',
        assistantMessageError,
        {
          endpoint: `/api/manage/${tenantId}/test-chat/conversations/${conversationId}/messages`,
          conversationId,
        }
      )
      return NextResponse.json(
        { error: 'Failed to save assistant response' },
        { status: 500 }
      )
    }

    // 10. Обновляем timestamp беседы
    await supabase
      .from('test_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    return NextResponse.json(
      {
        userMessage,
        assistantMessage,
        success: true,
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    logger.error('Test Chat POST message: Unexpected error', error, {
      endpoint: `/api/manage/${params.tenantId}/test-chat/conversations/${params.conversationId}/messages`,
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Симулированный генератор ответов AI
 * В production будет заменен на вызов реального LLM
 */
function generateSimulatedResponse(
  userMessage: string,
  agent: {
    name: string
    model: string | null
    instructions: string | null
  },
  history: Array<{ role: string; content: string }>
): string {
  const responses = [
    `Спасибо за ваше сообщение! Я - ${agent.name}, тестовый AI ассистент. Я получил ваш запрос: "${userMessage.substring(0, 100)}${userMessage.length > 100 ? '...' : ''}". В production режиме здесь будет реальный ответ от модели ${agent.model || 'GPT'}.`,
    `Понял ваш вопрос. Сейчас в тестовом режиме, но в полной версии я бы использовал следующие инструкции: "${agent.instructions?.substring(0, 100) || 'Инструкции не заданы'}..." для формирования ответа.`,
    `Это симулированный ответ от агента "${agent.name}". История нашего разговора содержит ${history.length} сообщений. В реальном режиме я бы учел весь контекст для более точного ответа.`,
    `Я обработал ваше сообщение и готов помочь! (Симуляция). Модель: ${agent.model || 'по умолчанию'}. В production здесь будет интеллектуальный ответ на основе ваших данных и контекста.`,
  ]

  // Выбираем случайный ответ
  const randomIndex = Math.floor(Math.random() * responses.length)
  return responses[randomIndex]
}
