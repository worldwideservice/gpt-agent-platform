// Тестовый скрипт для проверки Kommo API интеграции
// Запуск: npx tsx test-kommo.ts

import { KommoAPI } from './lib/crm/kommo.js'

async function testKommoIntegration() {
  console.log('🔍 Тестирование Kommo API интеграции...')

  // Создаем экземпляр API с реальными ключами
  const kommoApi = new KommoAPI({
    domain: 'api-c.kommo.com', // API domain из токена
    clientId: '2a5c1463-43dd-4ccc-abd0-79516f785e57',
    clientSecret: 'NZvTRduJl6tbhPuYtLKs17TU9v61DY3slaAe6r1u7suC0UTx4nedcGpePevCfuJ7',
    redirectUri: 'https://your-domain.com/integrations/kommo/oauth/callback',
    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjExNTVlODg3ZWFlZDVkY2FmYjZjOWJkNzExYjM4ZjRlOTRmOTRiMjliM2QzYzY5MzNkMTA0N2M2MjkyMWQzY2I3YjUzMWVmNmYzYjZhM2I2In0.eyJhdWQiOiIyYTVjMTQ2My00M2RkLTRjY2MtYWJkMC03OTUxNmY3ODVlNTciLCJqdGkiOiIxMTU1ZTg4N2VhZWQ1ZGNhZmI2YzliZDcxMWIzOGY0ZTk0Zjk0YjI5YjNkM2M2OTMzZDEwNDdjNjI5MjFkM2NiN2I1MzFlZjZmM2I2YTNiNiIsImlhdCI6MTc2MTg1OTQzMSwibmJmIjoxNzYxODU5NDMxLCJleHAiOjE4NDYwMjI0MDAsInN1YiI6IjEyNzYwMzgzIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM0MjEwMzA3LCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiNGJhMjEzNzMtMmQwOC00YzlhLWFmY2QtYjZlMGYwOTNhZTJhIiwidXNlcl9mbGFncyI6MCwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.k5iYk44bJhqf86Joao7giq20jnaNG_ChjKscBInltXh2zQXRiSY8Yqo79QzOLeLtRSXkpJISB4O9nnY4leXuAzk5lqkufPLkHB4nMfvpmEXFxQHEM9muAWmjXFWimz9pFEOdIw6VviD5JHkwmmA6OiTzRCvDoteV2mzBhsWaSUxQYL-6v8RMF_72q1YozbyfELE90DYQi7AmH5LR2jUnyKWNL6Rgv8t06r6mGvLzOX-V4QQxl9XwmOYFvYDGBzBwi0hX-ZiEvjHki8E59w720-3RGVw2iN0OzJVtGDF4ffAn7FfgfaXmVRRUWnAa_8Gou96PupI3qTGhSSVV3Wkl5A',
    refreshToken: null,
  })

  console.log('🔧 API URL будет:', kommoApi.getBaseUrl())

  try {
    // Тест 1: Проверка токена
    console.log('🔑 Проверка токена...')
    console.log('Access token есть:', !!kommoApi.getConfig().accessToken)
    console.log('Access token длина:', kommoApi.getConfig().accessToken?.length)

    // Тест 1: Получение информации о пользователе
    console.log('1️⃣ Получение пользователей...')
    const users = await kommoApi.getUsers()
    console.log('✅ Пользователи:', users.map(u => ({ id: u.id, name: u.name, email: u.email })))

    // Тест 2: Получение воронок продаж
    console.log('2️⃣ Получение воронок продаж...')
    const pipelines = await kommoApi.getPipelines()
    console.log('✅ Воронки:', pipelines.map(p => ({ id: p.id, name: p.name })))

    // Тест 3: Получение статистики по сделкам
    console.log('3️⃣ Получение статистики по сделкам...')
    const stats = await kommoApi.getLeadsStats()
    console.log('✅ Статистика:', stats)

    // Тест 4: Поиск сделок (если есть)
    console.log('4️⃣ Поиск сделок...')
    const leads = await kommoApi.searchLeads('')
    console.log('✅ Найдено сделок:', leads.length)
    if (leads.length > 0) {
      console.log('📋 Первая сделка:', { id: leads[0].id, name: leads[0].name })
    }

    console.log('🎉 Все тесты пройдены успешно!')

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('❌ Ошибка при тестировании:', errorMessage)
    console.error('❌ Полная ошибка:', error)

    if (errorMessage.includes('401')) {
      console.log('🔑 Возможно, токен истек или недействителен')
    }
    if (errorMessage.includes('Refresh token not provided')) {
      console.log('🔄 Требуется refresh token для обновления access token')
    }
  }
}

// Запуск теста
testKommoIntegration()
