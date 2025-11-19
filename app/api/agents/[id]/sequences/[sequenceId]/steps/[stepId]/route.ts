// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export const updateSchema = z.object({
  wait_interval: z.string().min(1).optional(),
  channel: z.string().min(1).optional(),
  template: z.string().min(1).optional(),
})

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string; sequenceId: string; stepId: string } },
) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const payload = updateSchema.parse(await request.json())
    const supabase = getSupabaseServiceRoleClient()

    const { data, error } = await supabase
      .from('agent_sequence_steps')
      .update(payload)
      .eq('id', params.stepId)
      .eq('sequence_id', params.sequenceId)
      .select('*')
      .maybeSingle()

    if (error || !data) {
      throw error ?? new Error('Step not found')
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to update sequence step', error)
    const message = error instanceof z.ZodError ? 'Некорректные данные' : 'Не удалось обновить шаг'
    return NextResponse.json({ success: false, error: message }, { status: error instanceof z.ZodError ? 400 : 500 })
  }
}

export const DELETE = async (
  _request: NextRequest,
  { params }: { params: { id: string; sequenceId: string; stepId: string } },
) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseServiceRoleClient()

    const { error } = await supabase
      .from('agent_sequence_steps')
      .delete()
      .eq('id', params.stepId)
      .eq('sequence_id', params.sequenceId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete sequence step', error)
    return NextResponse.json({ success: false, error: 'Не удалось удалить шаг' }, { status: 500 })
  }
}
