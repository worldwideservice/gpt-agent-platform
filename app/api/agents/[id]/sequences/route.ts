import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export const stepSchema = z.object({
  channel: z.string().min(1),
  wait_interval: z.string().min(1),
  template: z.string().min(1),
})

export const createSequenceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  steps: z.array(stepSchema).min(1),
})

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseServiceRoleClient()

    const { data, error } = await supabase
      .from('agent_sequences')
      .select('id, name, description, is_active, steps:agent_sequence_steps(id, step_index, wait_interval, channel, template)')
      .eq('agent_id', params.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data: data ?? [] })
  } catch (error) {
    console.error('Failed to load sequences', error)
    return NextResponse.json({ success: false, error: 'Не удалось загрузить последовательности' }, { status: 500 })
  }
}

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
    const payload = createSequenceSchema.parse(body)

    const supabase = getSupabaseServiceRoleClient()

    const { data: sequence, error } = await supabase
      .from('agent_sequences')
      .insert({
        agent_id: params.id,
        name: payload.name,
        description: payload.description,
      })
      .select('id')
      .single()

    if (error || !sequence) {
      throw error ?? new Error('Sequence insert failed')
    }

    const steps = payload.steps.map((step, index) => ({
      sequence_id: sequence.id,
      step_index: index + 1,
      wait_interval: step.wait_interval,
      channel: step.channel,
      template: step.template,
    }))

    const { error: stepsError } = await supabase.from('agent_sequence_steps').insert(steps)

    if (stepsError) {
      throw stepsError
    }

    return NextResponse.json({ success: true, data: { id: sequence.id } })
  } catch (error) {
    console.error('Failed to create sequence', error)
    const message = error instanceof z.ZodError ? 'Некорректные данные' : 'Не удалось создать последовательность'
    return NextResponse.json({ success: false, error: message }, { status: error instanceof z.ZodError ? 400 : 500 })
  }
}
