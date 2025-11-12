import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export const GET = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseServiceRoleClient()
    const { data, error } = await supabase
      .from('webhook_events')
      .select('*')
      .eq('org_id', session.user.orgId)
      .eq('provider', 'kommo')
      .order('created_at', { ascending: false })
      .limit(Number(request.nextUrl.searchParams.get('limit') ?? 10))

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data: data ?? [] })
  } catch (error) {
    console.error('Failed to load webhook events', error)
    return NextResponse.json(
      { success: false, error: 'Не удалось загрузить события webhook' },
      { status: 500 },
    )
  }
}
