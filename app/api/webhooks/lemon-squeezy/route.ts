/**
 * Lemon Squeezy Webhook Handler
 * Обробляє події від Lemon Squeezy (створення/оновлення/скасування підписок)
 */

import { NextRequest, NextResponse } from 'next/server'
import { handleLemonSqueezyWebhook } from '@/lib/services/billing'
import { logger } from '@/lib/utils/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Отримуємо signature з headers
    const signature = request.headers.get('x-signature') || ''

    // Парсимо body
    const payload = await request.json()

    logger.info('Received Lemon Squeezy webhook', {
      eventName: payload?.meta?.event_name,
      customData: payload?.data?.attributes?.custom_data,
    })

    // Обробляємо webhook
    const success = await handleLemonSqueezyWebhook(payload, signature)

    if (!success) {
      logger.error('Failed to process Lemon Squeezy webhook', {
        eventName: payload?.meta?.event_name,
      })
      return NextResponse.json(
        { error: 'Failed to process webhook' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error handling Lemon Squeezy webhook', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
