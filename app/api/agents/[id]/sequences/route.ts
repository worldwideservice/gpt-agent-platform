import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { createSequence, getSequences, startSequence, deleteSequence } from '@/lib/services/sequences'

const createSequenceSchema = z.object({
  name: z.string().min(1, 'Название последовательности обязательно'),
  description: z.string().optional(),
  trigger_type: z.enum(['manual', 'lead_created', 'stage_changed', 'subscription', 'event']),
  trigger_conditions: z.record(z.string(), z.any()).optional(),
  is_active: z.boolean().optional().default(true),
  steps: z.array(z.object({
    step_order: z.number().min(1),
    delay_minutes: z.number().min(0).default(0),
    action_type: z.enum(['send_message', 'create_task', 'send_email', 'webhook', 'ai_response', 'wait', 'kommo_action']),
    template: z.string().optional(),
    recipient: z.string().optional(),
    webhook_url: z.string().optional(),
    ai_prompt: z.string().optional(),
    task_title: z.string().optional(),
    task_description: z.string().optional(),
    kommo_action: z.object({
      type: z.enum(['create_lead', 'update_lead', 'create_contact', 'update_contact', 'create_task', 'send_email', 'create_call_note', 'create_meeting_note', 'add_note']),
      data: z.record(z.string(), z.any()),
      entity_id: z.number().optional(),
      entity_type: z.enum(['leads', 'contacts', 'companies']).optional(),
    }).optional(),
    metadata: z.record(z.string(), z.any()).optional().default({}),
  })).min(1, 'Последовательность должна содержать хотя бы один шаг'),
})

const startSequenceSchema = z.object({
  lead_id: z.string().min(1, 'ID лида обязателен'),
  contact_id: z.string().optional(),
  initial_data: z.record(z.string(), z.any()).optional().default({}),
})

/**
 * GET /api/agents/[id]/sequences - Получение последовательностей агента
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
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active_only') === 'true'

    const sequences = await getSequences(session.user.orgId, params.id, activeOnly)

    return NextResponse.json({
      success: true,
      data: sequences,
    })
  } catch (error) {
    console.error('Get sequences API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить последовательности',
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/agents/[id]/sequences - Создание новой последовательности
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
    const parsed = createSequenceSchema.safeParse(body)

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

    const sequenceData = {
      ...parsed.data,
      agent_id: params.id,
      metadata: {},
    }

    const sequenceId = await createSequence(session.user.orgId, sequenceData)

    if (!sequenceId) {
      return NextResponse.json(
        { success: false, error: 'Не удалось создать последовательность' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: { id: sequenceId },
    })
  } catch (error) {
    console.error('Create sequence API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось создать последовательность',
      },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/agents/[id]/sequences/[sequenceId]/start - Запуск последовательности
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
    const { searchParams } = new URL(request.url)
    const sequenceId = searchParams.get('sequenceId')

    if (!sequenceId) {
      return NextResponse.json(
        { success: false, error: 'ID последовательности обязателен' },
        { status: 400 },
      )
    }

    const body = await request.json()
    const parsed = startSequenceSchema.safeParse(body)

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

    const executionId = await startSequence(
      sequenceId,
      session.user.orgId,
      parsed.data.lead_id,
      parsed.data.contact_id,
      parsed.data.initial_data,
    )

    if (!executionId) {
      return NextResponse.json(
        { success: false, error: 'Не удалось запустить последовательность' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: { execution_id: executionId },
    })
  } catch (error) {
    console.error('Start sequence API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось запустить последовательность',
      },
      { status: 500 },
    )
  }
}