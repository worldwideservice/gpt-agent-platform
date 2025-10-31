import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { getDashboardStats } from '@/lib/repositories/agents'

export const GET = async () => {
  // Демо-режим: возвращаем mock-статистику
  const isDemoMode = process.env.NODE_ENV === 'development' ||
    process.env.DEMO_MODE === 'true' ||
    process.env.E2E_ONBOARDING_FAKE === '1'

  if (isDemoMode) {
    const mockStats = {
      monthlyResponses: 1250,
      monthlyChange: 15.3,
      weeklyResponses: 320,
      todayResponses: 45,
      totalAgents: 3,
    }

    return NextResponse.json({
      success: true,
      data: mockStats,
    })
  }

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

