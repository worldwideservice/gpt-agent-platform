import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSubscription } from '@/lib/repositories/subscriptions'

export const GET = async () => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const subscription = await getSubscription(session.user.orgId)

    return NextResponse.json({
      success: true,
      data: subscription,
    })
  } catch (error) {
    console.error('Subscription API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить данные подписки',
      },
      { status: 500 },
    )
  }
}



