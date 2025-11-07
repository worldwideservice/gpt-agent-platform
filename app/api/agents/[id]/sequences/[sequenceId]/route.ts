import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { deleteSequence, updateSequence } from '@/lib/services/sequences'
import { createErrorResponse } from '@/lib/utils/error-handler'

const updateSequenceSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  trigger_type: z.enum(['manual', 'lead_created', 'stage_changed', 'subscription', 'event']).optional(),
  trigger_conditions: z.record(z.string(), z.any()).optional(),
  is_active: z.boolean().optional(),
  steps: z.array(z.any()).optional(),
})

/**
 * PATCH /api/agents/[id]/sequences/[sequenceId] - Обновление последовательности
 */
export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sequenceId: string }> },
) => {
  const { id, sequenceId } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    const { response, status } = createErrorResponse(
      new Error('Unauthorized'),
      { code: 'AUTHENTICATION_ERROR', logToSentry: false }
    )
    return NextResponse.json(response, { status })
  }

  try {
    const body = await request.json()
    const parsed = updateSequenceSchema.safeParse(body)

    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => issue.message)
      const { response, status } = createErrorResponse(
        new Error('Validation failed'),
        {
          code: 'VALIDATION_ERROR',
          details: issues,
          logToSentry: false,
        }
      )
      return NextResponse.json(response, { status })
    }

    const success = await updateSequence(
      sequenceId,
      session.user.orgId,
      parsed.data
    )

    if (!success) {
      const { response, status } = createErrorResponse(
        new Error('Не удалось обновить последовательность'),
        { code: 'SEQUENCE_UPDATE_ERROR', logToSentry: true }
      )
      return NextResponse.json(response, { status })
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const { response, status } = createErrorResponse(error, {
      code: 'SEQUENCE_UPDATE_ERROR',
      logToSentry: true,
    })
    return NextResponse.json(response, { status })
  }
}

/**
 * DELETE /api/agents/[id]/sequences/[sequenceId] - Удаление последовательности
 */
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sequenceId: string }> },
) => {
  const { id, sequenceId } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    const { response, status } = createErrorResponse(
      new Error('Unauthorized'),
      { code: 'AUTHENTICATION_ERROR', logToSentry: false }
    )
    return NextResponse.json(response, { status })
  }

  try {
    const success = await deleteSequence(sequenceId, session.user.orgId)

    if (!success) {
      const { response, status } = createErrorResponse(
        new Error('Не удалось удалить последовательность'),
        { code: 'SEQUENCE_DELETE_ERROR', logToSentry: true }
      )
      return NextResponse.json(response, { status })
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const { response, status } = createErrorResponse(error, {
      code: 'SEQUENCE_DELETE_ERROR',
      logToSentry: true,
    })
    return NextResponse.json(response, { status })
  }
}
