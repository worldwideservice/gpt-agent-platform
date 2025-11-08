import { NextResponse } from 'next/server'


import { auth } from '@/auth'
import {
  getMonthlyResponsesSeries,

export const dynamic = 'force-dynamic'
  getDailyResponsesSeries,
  getWeeklyBarChartData,
} from '@/lib/repositories/agents'

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
  } catch (error) {
    console.error('Failed to fetch chart data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить данные графика',
      },
      { status: 500 },
    )
  }
}


