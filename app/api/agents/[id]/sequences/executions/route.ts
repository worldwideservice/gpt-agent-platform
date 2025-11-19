// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  const supabase = getSupabaseServiceRoleClient()
  const url = new URL(request.url)
  const limit = Number(url.searchParams.get('limit') ?? 20)

  const { data, error } = await supabase
    .from('sequence_executions')
    .select('*')
    .eq('org_id', session.user.orgId)
    .eq('agent_id', params.id)
    .order('updated_at', { ascending: false })
    .limit(Number.isFinite(limit) ? limit : 20)

  if (error) {
    return NextResponse.json({ success: false, error: 'Не удалось загрузить историю последовательностей' }, { status: 500 })
  }

  return NextResponse.json({ success: true, data: data ?? [] })
}
