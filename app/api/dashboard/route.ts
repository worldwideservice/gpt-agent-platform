import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getDashboardStats } from '@/lib/repositories/agents'

export const GET = async () => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const stats = await getDashboardStats(session.user.orgId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Dashboard API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить статистику панели',
      },
      { status: 500 },
    )
  }
}

