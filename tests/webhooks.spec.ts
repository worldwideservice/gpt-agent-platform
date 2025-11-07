import { test, expect } from '@playwright/test'

test.describe('Webhooks Integration', () => {
  test('should process webhook from Kommo via API', async ({ page, request }) => {
    // Симулируем получение webhook через API endpoint
    const webhookPayload = {
      leads: {
        add: [
          {
            id: 123,
            name: 'Test Lead',
            price: 1000,
            status_id: 142,
          },
        ],
      },
    }

    // Отправляем POST запрос на webhook endpoint
    const response = await request.post('/api/crm/webhook', {
      data: webhookPayload,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Проверяем что запрос принят (может быть 200 или 202)
    expect([200, 202]).toContain(response.status())
  })

  test('should handle webhook with invalid payload', async ({ request }) => {
    // Отправляем невалидный payload
    const response = await request.post('/api/crm/webhook', {
      data: { invalid: 'data' },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Проверяем что сервер обработал запрос (даже если с ошибкой)
    expect([200, 202, 400]).toContain(response.status())
  })

  test('should handle webhook with contact event', async ({ request }) => {
    const webhookPayload = {
      contacts: {
        add: [
          {
            id: 456,
            name: 'Test Contact',
            first_name: 'Test',
            last_name: 'Contact',
          },
        ],
      },
    }

    const response = await request.post('/api/crm/webhook', {
      data: webhookPayload,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    expect([200, 202]).toContain(response.status())
  })
})


