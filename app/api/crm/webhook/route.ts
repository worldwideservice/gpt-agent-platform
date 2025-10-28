import { NextRequest, NextResponse } from 'next/server'

import { KommoAPI } from '@/lib/crm/kommo'

/**
 * Webhook endpoint для получения событий от Kommo CRM
 * Настройка в Kommo: Настройки -> Интеграции -> Webhooks
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Парсинг события от Kommo
    const event = KommoAPI.parseWebhook(body)

    console.log('Kommo Webhook Event:', event.type, event.data)

    // Обработка различных типов событий
    switch (event.type) {
      case 'leads': {
        // Событие изменения сделки
        await handleLeadEvent(event.data)
        break
      }

      case 'contacts': {
        // Событие изменения контакта
        await handleContactEvent(event.data)
        break
      }

      case 'customers': {
        // Событие изменения покупателя
        await handleCustomerEvent(event.data)
        break
      }

      default:
        console.log('Unknown event type:', event.type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook Error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Обработчики событий

async function handleLeadEvent(data: unknown) {
  console.log('Lead Event:', data)
  
  // Здесь можно:
  // 1. Уведомить AI-агента об изменении сделки
  // 2. Обновить локальную базу данных
  // 3. Запустить триггеры и автоматизации
  // 4. Отправить уведомления пользователям
  
  // Пример: если сделка перешла на этап "Переговоры", активировать агента
  // if (leadStatus === 'negotiations') {
  //   await activateAgent(leadId)
  // }
}

async function handleContactEvent(data: unknown) {
  console.log('Contact Event:', data)
  
  // Обработка событий контакта
  // Синхронизация данных контакта с локальной БД
}

async function handleCustomerEvent(data: unknown) {
  console.log('Customer Event:', data)
  
  // Обработка событий покупателя
}

// Проверка подписи webhook (если настроена в Kommo)
function verifyWebhookSignature(request: NextRequest): boolean {
  const signature = request.headers.get('X-Kommo-Signature')
  const secret = process.env.KOMMO_WEBHOOK_SECRET

  if (!signature || !secret) {
    return false
  }

  // Здесь должна быть логика проверки подписи
  // В зависимости от настроек Kommo
  
  return true
}

