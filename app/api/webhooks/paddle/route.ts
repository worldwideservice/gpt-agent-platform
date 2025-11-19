/**
 * Paddle Webhook Handler
 * Обробляє події від Paddle (створення/оновлення/скасування підписок, транзакції)
 */

import { NextRequest, NextResponse } from 'next/server'
import { handlePaddleWebhook } from '@/lib/services/billing'
import { logger } from '@/lib/utils/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Отримуємо signature з headers (Paddle uses 'Paddle-Signature')
    const signature = request.headers.get('paddle-signature') || ''

    // Парсимо body
    const payload = await request.json()

    logger.info('Received Paddle webhook', {
      eventType: payload?.event_type,
      eventId: payload?.event_id,
      notificationId: payload?.notification_id,
    })

    // Обробляємо webhook
    const success = await handlePaddleWebhook(payload, signature)

    if (!success) {
      logger.error('Failed to process Paddle webhook', {
        eventType: payload?.event_type,
        eventId: payload?.event_id,
      })
      return NextResponse.json(
        { error: 'Failed to process webhook' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error handling Paddle webhook', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
