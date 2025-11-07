import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { createErrorResponse } from '@/lib/utils/error-handler'

const updateRuleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  trigger_type: z.enum(['lead_created', 'lead_updated', 'message_received', 'stage_changed', 'time_based', 'manual']).optional(),
  conditions: z.array(z.any()).optional(),
  actions: z.array(z.any()).optional(),
  is_active: z.boolean().optional(),
  priority: z.number().min(1).max(100).optional(),
  cooldown_minutes: z.number().min(0).optional(),
  max_executions_per_day: z.number().min(1).optional(),
})

/**
 * PATCH /api/agents/[id]/rules/[ruleId] - Обновление правила
 */
export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ruleId: string }> },
) => {
  const { id, ruleId } = await params
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
    const parsed = updateRuleSchema.safeParse(body)

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

    const supabase = getSupabaseServiceRoleClient()

    const { data, error } = await supabase
      .from('automation_rules')
      .update({
        ...parsed.data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ruleId)
      .eq('org_id', session.user.orgId)
      .eq('agent_id', id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update rule', error)
      const { response, status } = createErrorResponse(
        new Error('Не удалось обновить правило'),
        { code: 'RULE_UPDATE_ERROR', logToSentry: true }
      )
      return NextResponse.json(response, { status })
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const { response, status } = createErrorResponse(error, {
      code: 'RULE_UPDATE_ERROR',
      logToSentry: true,
    })
    return NextResponse.json(response, { status })
  }
}

/**
 * DELETE /api/agents/[id]/rules/[ruleId] - Удаление правила
 */
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ruleId: string }> },
) => {
  const { id, ruleId } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    const { response, status } = createErrorResponse(
      new Error('Unauthorized'),
      { code: 'AUTHENTICATION_ERROR', logToSentry: false }
    )
    return NextResponse.json(response, { status })
  }

  try {
    const supabase = getSupabaseServiceRoleClient()

    const { error } = await supabase
      .from('automation_rules')
      .delete()
      .eq('id', ruleId)
      .eq('org_id', session.user.orgId)
      .eq('agent_id', id)

    if (error) {
      console.error('Failed to delete rule', error)
      const { response, status } = createErrorResponse(
        new Error('Не удалось удалить правило'),
        { code: 'RULE_DELETE_ERROR', logToSentry: true }
      )
      return NextResponse.json(response, { status })
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const { response, status } = createErrorResponse(error, {
      code: 'RULE_DELETE_ERROR',
      logToSentry: true,
    })
    return NextResponse.json(response, { status })
  }
}

