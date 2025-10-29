import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getOnboardingState } from '@/lib/onboarding/server'

export const GET = async () => {
  try {
    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
    }

    const state = await getOnboardingState(session.user.orgId)

    return NextResponse.json({ success: true, state })
  } catch (error) {
    console.error('Onboarding status error:', error)
    return NextResponse.json(
      { success: false, error: 'Не удалось получить статус онбординга' },
      { status: 500 },
    )
  }
}
