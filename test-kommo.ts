// Тестовый скрипт для проверки Kommo API интеграции
// Запуск: npx tsx test-kommo.ts

import 'dotenv/config'
import { exit } from 'process'
import { KommoAPI } from './lib/crm/kommo.js'
import { evaluateKommoTestConfig } from './lib/env/kommo-test.js'

async function testKommoIntegration() {
  try {
    const state = evaluateKommoTestConfig()

    if (!state.enabled) {
      console.error(`❌ ${state.message}`)
      if (state.missing?.length) {
        console.error('   Отсутствуют переменные:', state.missing.join(', '))
      }
      if (state.status === 503) {
        console.error('   Установите KOMMO_TEST_ENABLED=1 для запуска теста.')
      }
      exit(1)
    }

    const kommoApi = new KommoAPI(state.config)

    console.log('🔍 Тестирование Kommo API интеграции...')
    console.log('🔧 API URL:', kommoApi.getBaseUrl())

    console.log('1️⃣ Получение сделок (CRM scope)...')
    const leads = await kommoApi.getLeads() // Тестируем доступ к leads через CRM scope
    console.log('   Найдено сделок:', leads.length)

    console.log('2️⃣ Получение воронок продаж...')
    const pipelines = await kommoApi.getPipelines()
    console.log('   Найдено воронок:', pipelines.length)

    console.log('3️⃣ Получение статистики по сделкам...')
    const stats = await kommoApi.getLeadsStats()
    console.log('   Всего сделок:', stats.total)

    console.log('🎉 Все тесты выполнены успешно')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('❌ Ошибка при тестировании Kommo API:', message)

    if (error instanceof Error && error.stack) {
      console.error(error.stack)
    }

    exit(1)
  }
}

void testKommoIntegration()
