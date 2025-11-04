import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from './types'

let client: SupabaseClient<Database> | null = null

/**
 * Получить Supabase клиент с оптимизированными настройками для высокой нагрузки
 * 
 * Оптимизации:
 * - Отключена персистентность сессий (не нужно для worker)
 * - Отключен auto refresh токенов (не нужно для service role)
 * - Настроены заголовки для идентификации worker сервиса
 * - Готовность к connection pooling через Supabase Pooler
 */
export const getSupabaseClient = (url: string, serviceRoleKey: string) => {
  if (client) {
    return client
  }

  client = createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-client-info': 'worker-service',
        'x-client-version': '1.0.0',
      },
    },
    // Настройки для высокой нагрузки
    realtime: {
      // Отключаем realtime для worker (не нужен)
      params: {
        eventsPerSecond: 0,
      },
    },
  })

  return client
}

/**
 * Создать новый Supabase клиент (для тестирования или изоляции)
 * Используйте осторожно - каждый клиент создает новое подключение
 */
export const createSupabaseClient = (url: string, serviceRoleKey: string) => {
  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-client-info': 'worker-service',
        'x-client-version': '1.0.0',
      },
    },
  })
}
