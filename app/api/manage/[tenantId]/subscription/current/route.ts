// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getErrorMessage } from '@/lib/utils'


/**
 * GET /api/manage/[tenantId]/subscription/current
 * Получает текущую подписку и статистику использования для организации
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const { tenantId } = await params

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // [MOCK] В реальном проекте здесь будет запрос к БД subscriptions + statistics
    // const supabase = createSupabaseAdminClient()
    // const { data: subscription } = await supabase
    //   .from('subscriptions')
    //   .select('*, plan:plans(*)')
    //   .eq('org_id', session.user.orgId)
    //   .in('status', ['active', 'trialing'])
    //   .single()

    // Мок-данные для демонстрации (согласно KWID)
    const mockSubscription = {
      id: 'sub_123',
      status: 'active', // 'active' | 'trialing' | 'cancelled' | 'expired'
      current_period_end: '2025-12-16T12:00:00Z',
      plan: {
        id: 'scale',
        name: 'Scale',
        price_month: 578,
        price_year: 499,
        max_responses: 15000,
        max_agents: 10,
      },
      interval: 'month', // 'month' | 'year'
    }

    // [MOCK] Получаем текущее использование (для Progress bar)
    // const { count: usage } = await supabase
    //   .from('messages')
    //   .select('id', { count: 'exact', head: true })
    //   .eq('org_id', session.user.orgId)
    //   .eq('role', 'assistant')
    //   .gte('created_at', startOfMonth(new Date()).toISOString())

    const mockUsage = 1574 // Текущее использование (согласно KWID: "Использовано: 1,574 из 15,000")

    return NextResponse.json({
      subscription: mockSubscription,
      usage: {
        responses: mockUsage,
        max_responses: mockSubscription.plan.max_responses,
        percentage: Math.round((mockUsage / mockSubscription.plan.max_responses) * 100),
      },
    })
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 })
  }
}
