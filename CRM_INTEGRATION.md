# 🔗 Интеграция с Kommo CRM

## ✅ Что реализовано

Полная интеграция с Kommo CRM (ранее amoCRM) для автоматизации работы с клиентами.

### 🎯 Основные возможности

1. **Создание и обновление сделок (Leads)**
   - Автоматическое создание сделки при обращении клиента
   - Обновление статуса сделки
   - Перемещение по этапам воронки
   - Добавление примечаний

2. **Управление контактами (Contacts)**
   - Создание новых контактов
   - Обновление данных контактов
   - Поиск контактов
   - Синхронизация полей

3. **Работа с воронками (Pipelines)**
   - Получение списка воронок
   - Получение этапов воронки
   - Автоматическое перемещение по этапам

4. **Управление пользователями**
   - Получение списка менеджеров
   - Автоназначение ответственного

5. **Webhooks**
   - Получение событий из CRM в реальном времени
   - Обработка изменений сделок и контактов
   - Триггеры на основе событий CRM

## 📦 Структура файлов

```
├── lib/crm/
│   └── kommo.ts                    # Класс KommoAPI с методами
├── app/api/crm/
│   ├── kommo/route.ts             # API endpoint для запросов
│   └── webhook/route.ts           # Webhook для событий CRM
├── hooks/
│   └── useKommo.ts                # React hook для работы с CRM
└── components/crm/
    └── CRMSync.tsx                # Компонент синхронизации
```

## 🚀 Быстрый старт

### 1. Настройка переменных окружения

Создайте `.env.local`:

```env
# Kommo CRM Configuration
KOMMO_DOMAIN=your-domain
KOMMO_CLIENT_ID=your-client-id
KOMMO_CLIENT_SECRET=your-client-secret
KOMMO_REDIRECT_URI=https://your-domain.com/api/crm/callback
KOMMO_ACCESS_TOKEN=your-access-token
KOMMO_REFRESH_TOKEN=your-refresh-token
KOMMO_WEBHOOK_SECRET=your-webhook-secret
```

### 2. Получение токенов Kommo

1. Перейдите в Kommo: **Настройки → Интеграции → Создать интеграцию**
2. Получите `Client ID` и `Client Secret`
3. Настройте `Redirect URI`
4. Получите `Access Token` через OAuth 2.0

### 3. Настройка Webhook

1. В Kommo: **Настройки → Webhooks**
2. Добавьте URL: `https://your-domain.com/api/crm/webhook`
3. Выберите события для отслеживания:
   - Создание/изменение сделки
   - Создание/изменение контакта
   - Изменение статуса

## 💻 Примеры использования

### В Server Component

```typescript
import { KommoAPI } from '@/lib/crm/kommo'

const kommo = new KommoAPI({
  domain: process.env.KOMMO_DOMAIN!,
  clientId: process.env.KOMMO_CLIENT_ID!,
  clientSecret: process.env.KOMMO_CLIENT_SECRET!,
  redirectUri: process.env.KOMMO_REDIRECT_URI!,
  accessToken: process.env.KOMMO_ACCESS_TOKEN!,
})

// Создание сделки
const lead = await kommo.createLead({
  name: 'Новая сделка',
  price: 10000,
})

// Получение воронок
const pipelines = await kommo.getPipelines()
```

### В Client Component с хуком

```typescript
'use client'

import { useKommo } from '@/hooks/useKommo'

const MyComponent = () => {
  const { createLead, loading, error } = useKommo()

  const handleCreateLead = async () => {
    const lead = await createLead({
      name: 'Клиент из чата',
      price: 5000,
    })
    
    if (lead) {
      console.log('Сделка создана:', lead.id)
    }
  }

  return (
    <button onClick={handleCreateLead} disabled={loading}>
      {loading ? 'Создание...' : 'Создать сделку'}
    </button>
  )
}
```

### Через API endpoint

```typescript
// POST /api/crm/kommo
const response = await fetch('/api/crm/kommo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'create_lead',
    data: {
      name: 'Новая сделка',
      price: 10000,
    },
  }),
})

const result = await response.json()
```

## 🔄 Сценарии автоматизации

### 1. Автоматическое создание сделки из чата

```typescript
// В обработчике сообщений чата
const handleChatMessage = async (message: string, userName: string) => {
  const { createLead, createContact } = useKommo()
  
  // Создаем контакт
  const contact = await createContact({
    name: userName,
    custom_fields_values: [
      {
        field_id: 123, // ID поля телефона в CRM
        values: [{ value: '+79991234567' }],
      },
    ],
  })
  
  // Создаем сделку
  if (contact) {
    await createLead({
      name: `Лид из чата: ${userName}`,
      price: 0,
      _embedded: {
        contacts: [{ id: contact.id! }],
      },
    })
  }
}
```

### 2. Обновление статуса при квалификации

```typescript
const qualifyLead = async (leadId: number, isQualified: boolean) => {
  const { updateLead } = useKommo()
  
  await updateLead(leadId, {
    status_id: isQualified ? 142 : 143, // ID статусов в CRM
  })
}
```

### 3. Добавление примечаний о диалоге

```typescript
const saveChatHistory = async (leadId: number, messages: string[]) => {
  const { addNote } = useKommo()
  
  const chatLog = messages.join('\n')
  await addNote(leadId, `История диалога:\n${chatLog}`)
}
```

### 4. Webhook обработка событий

```typescript
// В app/api/crm/webhook/route.ts

async function handleLeadEvent(data: any) {
  const { status, id } = data.status[0]
  
  // Если сделка перешла на этап "Переговоры"
  if (status.id === 142) {
    // Активировать AI-агента для автоматизации
    await activateAgentForLead(id)
  }
  
  // Если сделка закрыта
  if (status.id === 143) {
    // Отправить благодарственное письмо
    await sendThankYouEmail(id)
  }
}
```

## 📊 Типы данных

### KommoLead (Сделка)

```typescript
interface KommoLead {
  id?: number
  name: string                    // Название сделки
  price?: number                  // Сумма сделки
  status_id?: number             // ID статуса
  pipeline_id?: number           // ID воронки
  responsible_user_id?: number   // ID ответственного
  custom_fields_values?: Array<{
    field_id: number
    values: Array<{ value: string }>
  }>
}
```

### KommoContact (Контакт)

```typescript
interface KommoContact {
  id?: number
  name: string
  first_name?: string
  last_name?: string
  custom_fields_values?: Array<{
    field_id: number
    values: Array<{ value: string }>
  }>
}
```

## 🔐 Безопасность

1. **Храните токены в переменных окружения**
   - Никогда не коммитьте токены в Git
   - Используйте `.env.local` для локальной разработки

2. **Проверяйте подпись webhook**
   - Включите проверку `X-Kommo-Signature`
   - Используйте `KOMMO_WEBHOOK_SECRET`

3. **Ограничьте доступ к API endpoints**
   - Добавьте middleware для авторизации
   - Проверяйте права пользователя

## 🐛 Решение проблем

### Ошибка 401 (Unauthorized)

```typescript
// Token истёк, обновите его
const { access_token, refresh_token } = await kommo.refreshAccessToken()

// Сохраните новые токены
process.env.KOMMO_ACCESS_TOKEN = access_token
process.env.KOMMO_REFRESH_TOKEN = refresh_token
```

### Webhook не приходят

1. Проверьте URL webhook в настройках Kommo
2. Убедитесь что endpoint доступен публично
3. Проверьте логи сервера на ошибки

### Не находит поля custom_fields

```typescript
// Получите список полей из CRM
const response = await fetch(
  `https://${domain}.amocrm.ru/api/v4/leads/custom_fields`,
  {
    headers: { Authorization: `Bearer ${accessToken}` }
  }
)
const fields = await response.json()
console.log(fields)
```

## 📈 Метрики и мониторинг

Отслеживайте:
- Количество созданных сделок
- Конверсию из чата в сделку
- Время обработки запросов к CRM
- Ошибки синхронизации

## 🔄 Обновление токенов

Токены Kommo действительны 24 часа. Реализуйте автоматическое обновление:

```typescript
// lib/crm/token-manager.ts
export class TokenManager {
  async getValidToken() {
    const expiresAt = await db.settings.get('kommo_token_expires_at')
    
    if (Date.now() > expiresAt) {
      // Обновить токен
      const { access_token, refresh_token } = await kommo.refreshAccessToken()
      
      // Сохранить в БД
      await db.settings.set('kommo_access_token', access_token)
      await db.settings.set('kommo_refresh_token', refresh_token)
      await db.settings.set('kommo_token_expires_at', Date.now() + 86400000)
      
      return access_token
    }
    
    return await db.settings.get('kommo_access_token')
  }
}
```

## 📚 Дополнительные ресурсы

- [Официальная документация Kommo API](https://www.amocrm.ru/developers/content/crm_platform/platform-abilities)
- [OAuth 2.0 аутентификация](https://www.amocrm.ru/developers/content/oauth/step-by-step)
- [Webhooks документация](https://www.amocrm.ru/developers/content/crm_platform/webhooks)

---

**Статус:** ✅ Полностью реализовано  
**Версия API:** v4  
**Последнее обновление:** Октябрь 2024

