import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
})

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string; sequenceId: string } },
) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const payload = updateSchema.parse(await request.json())
    const supabase = getSupabaseServiceRoleClient()

    const { data, error } = await supabase
      .from('agent_sequences')
      .update(payload)
      .eq('id', params.sequenceId)
      .eq('agent_id', params.id)
      .select('*')
      .maybeSingle()

    if (error || !data) {
      throw error ?? new Error('Sequence not found')
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to update sequence', error)
    const message = error instanceof z.ZodError ? 'Некорректные данные' : 'Не удалось обновить последовательность'
    return NextResponse.json({ success: false, error: message }, { status: error instanceof z.ZodError ? 400 : 500 })
  }
}

export const DELETE = async (
  _request: NextRequest,
  { params }: { params: { id: string; sequenceId: string } },
) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseServiceRoleClient()

    const { error } = await supabase
      .from('agent_sequences')
      .delete()
      .eq('id', params.sequenceId)
      .eq('agent_id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete sequence', error)
    return NextResponse.json({ success: false, error: 'Не удалось удалить последовательность' }, { status: 500 })
  }
}
