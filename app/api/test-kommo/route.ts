import { NextResponse } from 'next/server'
import { KommoAPI } from '@/lib/crm/kommo'

export const GET = async () => {
  try {
    console.log('🔍 Тестирование Kommo API через endpoint...')

    // Создаем экземпляр API с реальными ключами
    const kommoApi = new KommoAPI({
      domain: 'api-c.kommo.com',
      clientId: '2a5c1463-43dd-4ccc-abd0-79516f785e57',
      clientSecret: 'NZvTRduJl6tbhPuYtLKs17TU9v61DY3slaAe6r1u7suC0UTx4nedcGpePevCfuJ7',
      redirectUri: 'https://your-domain.com/integrations/kommo/oauth/callback',
      accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjExNTVlODg3ZWFlZDVkY2FmYjZjOWJkNzExYjM4ZjRlOTRmOTRiMjliM2QzYzY5MzNkMTA0N2M2MjkyMWQzY2I3YjUzMWVmNmYzYjZhM2I2In0.eyJhdWQiOiIyYTVjMTQ2My00M2RkLTRjY2MtYWJkMC03OTUxNmY3ODVlNTciLCJqdGkiOiIxMTU1ZTg4N2VhZWQ1ZGNhZmI2YzliZDcxMWIzOGY0ZTk0Zjk0YjI5YjNkM2M2OTMzZDEwNDdjNjI5MjFkM2NiN2I1MzFlZjZmM2I2YTNiNiIsImlhdCI6MTc2MTg1OTQzMSwibmJmIjoxNzYxODU5NDMxLCJleHAiOjE4NDYwMjI0MDAsInN1YiI6IjEyNzYwMzgzIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM0MjEwMzA3LCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiNGJhMjEzNzMtMmQwOC00YzlhLWFmY2QtYjZlMGYwOTNhZTJhIiwidXNlcl9mbGFncyI6MCwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.k5iYk44bJhqf86Joao7giq20jnaNG_ChjKscBInltXh2zQXRiSY8Yqo79QzOLeLtRSXkpJISB4O9nnY4leXuAzk5lqkufPLkHB4nMfvpmEXFxQHEM9muAWmjXFWimz9pFEOdIw6VviD5JHkwmmA6OiTzRCvDoteV2mzBhsWaSUxQYL-6v8RMF_72q1YozbyfELE90DYQi7AmH5LR2jUnyKWNL6Rgv8t06r6mGvLzOX-V4QQxl9XwmOYFvYDGBzBwi0hX-ZiEvjHki8E59w720-3RGVw2iN0OzJVtGDF4ffAn7FfgfaXmVRRUWnAa_8Gou96PupI3qTGhSSVV3Wkl5A',
      refreshToken: null,
    })

    console.log('🔧 API URL:', kommoApi.baseUrl)
    console.log('🔑 Токен есть:', !!kommoApi.config.accessToken)

    // Тест 1: Получение пользователей
    console.log('1️⃣ Получение пользователей...')
    const users = await kommoApi.getUsers()
    console.log('✅ Пользователи получены:', users.length)

    // Тест 2: Получение воронок
    console.log('2️⃣ Получение воронок...')
    const pipelines = await kommoApi.getPipelines()
    console.log('✅ Воронки получены:', pipelines.length)

    // Тест 3: Статистика
    console.log('3️⃣ Получение статистики...')
    const stats = await kommoApi.getLeadsStats()
    console.log('✅ Статистика:', stats)

    return NextResponse.json({
      success: true,
      message: 'Kommo API работает!',
      data: {
        usersCount: users.length,
        pipelinesCount: pipelines.length,
        stats,
      },
    })

  } catch (error: any) {
    console.error('❌ Ошибка тестирования Kommo API:', error)

    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString(),
    }, { status: 500 })
  }
}
