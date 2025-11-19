// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

const conditionSchema = z.object({
  field: z.string().min(1),
  operator: z.enum(['equals', 'contains', 'greater_than', 'less_than', 'changed_to', 'not_empty']),
  value: z.string().optional(),
})

const actionSchema = z.object({
  type: z.enum(['send_message', 'change_stage', 'create_task', 'update_field', 'send_email', 'webhook', 'ai_response']),
  template: z.string().optional(),
  targetField: z.string().optional(),
  newValue: z.string().optional(),
  recipient: z.string().optional(),
  webhookUrl: z.string().optional(),
  aiPrompt: z.string().optional(),
})

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
  priority: z.number().min(1).max(100).optional(),
  conditions: z.array(conditionSchema).optional(),
  actions: z.array(actionSchema).optional(),
})

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { ruleId: string } },
) => {
  const session = await auth()
  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const payload = updateSchema.parse(await request.json())
    const supabase = getSupabaseServiceRoleClient()

    const { data: existing, error: fetchError } = await supabase
      .from('automation_rules')
      .select('id')
      .eq('id', params.ruleId)
      .eq('org_id', session.user.orgId)
      .maybeSingle()

    if (fetchError || !existing) {
      return NextResponse.json({ success: false, error: 'Правило не найдено' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('automation_rules')
      .update(payload)
      .eq('id', params.ruleId)
      .eq('org_id', session.user.orgId)
      .select('*')
      .maybeSingle()

    if (error || !data) {
      throw error ?? new Error('Rule update failed')
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Rule update error', error)
    const message = error instanceof z.ZodError ? 'Некорректные данные' : 'Не удалось обновить правило'
    return NextResponse.json({ success: false, error: message }, { status: error instanceof z.ZodError ? 400 : 500 })
  }
}

export const DELETE = async (
  _request: NextRequest,
  { params }: { params: { ruleId: string } },
) => {
  const session = await auth()
  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseServiceRoleClient()

    const { error } = await supabase
      .from('automation_rules')
      .delete()
      .eq('id', params.ruleId)
      .eq('org_id', session.user.orgId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Rule delete error', error)
    return NextResponse.json({ success: false, error: 'Не удалось удалить правило' }, { status: 500 })
  }
}
