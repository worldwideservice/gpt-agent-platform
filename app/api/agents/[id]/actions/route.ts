import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { AgentActionsService } from '@/lib/services/agent-actions'

const analyzeActionsSchema = z.object({
  leadId: z.number().optional(),
  message: z.string().min(1, 'Сообщение обязательно'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().default([]),
})

const executeActionSchema = z.object({
  leadId: z.number().optional(),
  action: z.object({
    type: z.enum(['kommo_action', 'send_message', 'create_sequence', 'none']),
    confidence: z.number().min(0).max(1),
    reason: z.string(),
    data: z.record(z.string(), z.any()).optional(),
    kommoAction: z.object({
      type: z.string(),
      data: z.record(z.string(), z.any()),
      entityId: z.number().optional(),
      entityType: z.enum(['leads', 'contacts', 'companies']).optional(),
    }).optional(),
  }),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().default([]),
})

/**
 * GET /api/agents/[id]/actions - Получение доступных действий агента
 */
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const actionsService = new AgentActionsService(session.user.orgId)
    const availableActions = actionsService.getAvailableActions()

    return NextResponse.json({
      success: true,
      actions: availableActions,
    })
  } catch (error) {
    console.error('Failed to get agent actions:', error)
    return NextResponse.json(
      { success: false, error: 'Не удалось получить действия агента' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/agents/[id]/actions/analyze - Анализ ситуации и предложение действий
 */
export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = analyzeActionsSchema.safeParse(body)

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

    const { leadId, message, conversationHistory } = parsed.data
    const actionsService = new AgentActionsService(session.user.orgId)

    // Анализируем ситуацию
    const suggestions = await actionsService.analyzeAndSuggestActions({
      organizationId: session.user.orgId,
      agentId: params.id,
      leadId: leadId || undefined,
      conversationHistory,
      userMessage: message,
    })

    return NextResponse.json({
      success: true,
      suggestions,
    })
  } catch (error) {
    console.error('Failed to analyze actions:', error)
    return NextResponse.json(
      { success: false, error: 'Не удалось проанализировать действия' },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/agents/[id]/actions/execute - Выполнение действия агента
 */
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = executeActionSchema.safeParse(body)

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

    const { leadId, action, conversationHistory } = parsed.data
    const actionsService = new AgentActionsService(session.user.orgId)

    // Выполняем действие
    const result = await actionsService.executeSuggestedAction(action, {
      organizationId: session.user.orgId,
      agentId: params.id,
      leadId: leadId || 0,
      conversationHistory,
      userMessage: 'Выполнение действия через API',
    })

    return NextResponse.json({
      success: true,
      result,
      message: 'Действие выполнено успешно',
    })
  } catch (error) {
    console.error('Failed to execute action:', error)
    return NextResponse.json(
      { success: false, error: 'Не удалось выполнить действие' },
      { status: 500 },
    )
  }
}
