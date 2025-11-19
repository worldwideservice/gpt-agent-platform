// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export const createStepSchema = z.object({
  wait_interval: z.string().min(1),
  channel: z.string().min(1),
  template: z.string().min(1),
})

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string; sequenceId: string } },
) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const payload = createStepSchema.parse(body)
    const supabase = getSupabaseServiceRoleClient()

    const { data: lastStep, error: lastStepError } = await supabase
      .from('agent_sequence_steps')
      .select('step_index')
      .eq('sequence_id', params.sequenceId)
      .order('step_index', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (lastStepError) {
      throw lastStepError
    }

    const nextIndex = (lastStep?.step_index ?? 0) + 1

    const { data, error } = await supabase
      .from('agent_sequence_steps')
      .insert({
        sequence_id: params.sequenceId,
        step_index: nextIndex,
        wait_interval: payload.wait_interval,
        channel: payload.channel,
        template: payload.template,
      })
      .select('*')
      .single()

    if (error || !data) {
      throw error ?? new Error('Failed to create sequence step')
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to create sequence step', error)
    const message = error instanceof z.ZodError ? 'Некорректные данные' : 'Не удалось создать шаг'
    return NextResponse.json({ success: false, error: message }, { status: error instanceof z.ZodError ? 400 : 500 })
  }
}
