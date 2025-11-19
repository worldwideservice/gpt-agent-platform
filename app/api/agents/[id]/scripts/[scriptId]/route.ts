// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { createErrorResponse } from '@/lib/utils/error-handler'

const updateScriptSchema = z.object({
  title: z.string().min(1).optional(),
  scriptType: z.enum(['greeting', 'qualification', 'presentation', 'objection_handling', 'closing']).optional(),
  content: z.string().min(1).optional(),
  pipelineStageId: z.string().uuid().nullable().optional(),
  variables: z.record(z.string(), z.unknown()).optional(),
  conditions: z.record(z.string(), z.unknown()).optional(),
})

/**
 * PATCH /api/agents/[id]/scripts/[scriptId] - Обновление скрипта продаж
 */
export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string; scriptId: string }> },
) => {
  const { id: agentId, scriptId } = await params
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
    const parsed = updateScriptSchema.safeParse(body)

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

    const agent = await getAgentById(agentId, session.user.orgId)
    if (!agent) {
      const { response, status } = createErrorResponse(
        new Error('Agent not found'),
        { code: 'AGENT_NOT_FOUND', logToSentry: false }
      )
      return NextResponse.json(response, { status })
    }

    const supabase = getSupabaseServiceRoleClient()

    const { data, error } = await supabase
      .from('sales_scripts')
      .update({
        ...parsed.data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', scriptId)
      .eq('org_id', session.user.orgId)
      .select()
      .single()

    if (error) {
      console.error('Failed to update script', error)
      const { response, status } = createErrorResponse(
        new Error('Не удалось обновить скрипт'),
        { code: 'SCRIPT_UPDATE_ERROR', logToSentry: true }
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
      code: 'SCRIPT_UPDATE_ERROR',
      logToSentry: true,
    })
    return NextResponse.json(response, { status })
  }
}

/**
 * DELETE /api/agents/[id]/scripts/[scriptId] - Удаление скрипта продаж
 */
export const DELETE = async (
 request: NextRequest,
 { params }: { params: Promise<{ id: string; scriptId: string }> },
) => {
 const { id: agentId, scriptId } = await params
 const session = await auth()

  if (!session?.user?.orgId) {
    const { response, status } = createErrorResponse(
      new Error('Unauthorized'),
      { code: 'AUTHENTICATION_ERROR', logToSentry: false }
    )
    return NextResponse.json(response, { status })
  }

 try {
 // Проверяем агента
 const agent = await getAgentById(agentId, session.user.orgId)
 if (!agent) {
 return NextResponse.json({ success: false, error: 'Агент не найден' }, { status: 404 })
 }

 const supabase = getSupabaseServiceRoleClient()

 // Проверяем что скрипт принадлежит организации
 const { data: script, error: fetchError } = await supabase
 .from('sales_scripts')
 .select('org_id')
 .eq('id', scriptId)
 .eq('org_id', session.user.orgId)
 .single()

 if (fetchError || !script) {
 return NextResponse.json({ success: false, error: 'Скрипт не найден' }, { status: 404 })
 }

 // Удаляем скрипт
 const { error } = await supabase.from('sales_scripts').delete().eq('id', scriptId).eq('org_id', session.user.orgId)

 if (error) {
 console.error('Failed to delete script', error)
 throw new Error('Не удалось удалить скрипт')
 }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const { response, status } = createErrorResponse(error, {
      code: 'SCRIPT_DELETE_ERROR',
      logToSentry: true,
    })
    return NextResponse.json(response, { status })
  }
}

