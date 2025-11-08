import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import {
  getMonthlyResponsesSeries,
  getDailyResponsesSeries,
  getWeeklyBarChartData,
} from '@/lib/repositories/agents'
import { logger } from '@/lib/utils/logger'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'


export const GET = async (request: Request) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'monthly' | 'daily' | 'weekly'

    let data

    switch (type) {
      case 'monthly':
        data = await getMonthlyResponsesSeries(session.user.orgId, 6)
        break
      case 'daily':
        data = await getDailyResponsesSeries(session.user.orgId, 14)
        break
      case 'weekly':
        data = await getWeeklyBarChartData(session.user.orgId)
        break
      default:
        return NextResponse.json({ success: false, error: 'Неверный тип графика' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: unknown) {
    logger.error('Failed to fetch chart data:', error, {
      endpoint: '/api/dashboard/charts',
      method: 'GET',
    })
    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить данные графика',
      },
      { status: 500 },
    )
  }
}


