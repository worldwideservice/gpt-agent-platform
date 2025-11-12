# Kommo CRM интеграция - Полная документация

> Полная документация по интеграции с Kommo (amoCRM) API, OAuth, Webhooks
> 
> **Версия:** 1.1
> **Дата обновления:** 2025-02-18

## Текущий статус

- ✅ Базовый OAuth flow задокументирован (Next.js endpoints) — перенести в Fastify сервис согласно roadmap.
- ✅ Статусы интеграции отражаются в `app/manage/[tenantId]/integrations` (каркас) — требуется подключить реальные данные.
- 🔄 Подготовлены GTM-материалы по тарифам и SLA (см. `docs/GTM_PLAYBOOK.md`) для согласования условий с клиентами.
- 🔄 Планируются события аналитики `integration_connected`/`integration_error` через `ProductAnalyticsProvider`.

## 📋 Содержание

1. [OAuth 2.0 Flow](#oauth-20-flow)
2. [API Endpoints](#api-endpoints)
3. [Webhooks](#webhooks)
4. [Синхронизация данных](#синхронизация-данных)
5. [Примеры использования](#примеры-использования)

---

## OAuth 2.0 Flow

### Шаг 1: Получение authorization code

```typescript
// app/api/v1/crm/kommo/oauth/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { nanoid } from 'nanoid'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const baseDomain = searchParams.get('domain')
  const redirectUri = searchParams.get('redirect_uri') || 
    `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/crm/kommo/callback`

  if (!baseDomain) {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
  }

  // Генерируем state для защиты от CSRF
  const state = nanoid(32)
  const supabase = getSupabaseServiceRoleClient()

  // Сохраняем state в БД
  await supabase.from('oauth_states').insert({
    org_id: session.user.workspaceId,
    provider: 'kommo',
    state,
    redirect_uri: redirectUri,
    base_domain: baseDomain,
    expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 минут
  })

  // Формируем URL для OAuth
  const authUrl = new URL(`https://${baseDomain}/oauth2/authorize`)
  authUrl.searchParams.set('client_id', process.env.KOMMO_CLIENT_ID!)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('state', state)

  return NextResponse.redirect(authUrl.toString())
}
```

### Шаг 2: Обмен code на access token

```typescript
// app/api/v1/crm/kommo/callback/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const domain = searchParams.get('referer')?.replace('https://', '').split('.')[0]

  if (!code || !state || !domain) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const supabase = getSupabaseServiceRoleClient()

  // Проверяем state
  const { data: oauthState } = await supabase
    .from('oauth_states')
    .select('*')
    .eq('state', state)
    .eq('provider', 'kommo')
    .single()

  if (!oauthState || new Date(oauthState.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired state' }, { status: 400 })
  }

  // Обмениваем code на токены
  const tokenResponse = await fetch(`https://${domain}.kommo.com/oauth2/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.KOMMO_CLIENT_ID!,
      client_secret: process.env.KOMMO_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: oauthState.redirect_uri,
    }),
  })

  if (!tokenResponse.ok) {
    return NextResponse.json({ error: 'Failed to get tokens' }, { status: 400 })
  }

  const tokens = await tokenResponse.json()

  // Сохраняем connection
  await supabase.from('crm_connections').upsert({
    org_id: oauthState.org_id,
    provider: 'kommo',
    base_domain: `${domain}.kommo.com`,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: new Date(Date.now() + tokens.expires_in * 1000),
    scope: tokens.scope?.split(' ') || [],
  })

  // Удаляем использованный state
  await supabase.from('oauth_states').delete().eq('id', oauthState.id)

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/manage/${oauthState.org_id}/ai-agents`)
}
```

### Шаг 3: Refresh token

```typescript
// lib/crm/kommo/oauth.ts

export async function refreshAccessToken(
  connectionId: string,
  refreshToken: string,
  baseDomain: string
): Promise<{ access_token: string; refresh_token?: string; expires_in: number }> {
  const response = await fetch(`https://${baseDomain}/oauth2/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.KOMMO_CLIENT_ID!,
      client_secret: process.env.KOMMO_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }

  return await response.json()
}
```

---

## API Endpoints

### Получение воронок (Pipelines)

```typescript
// lib/crm/kommo/pipelines.ts

export async function getPipelines(
  accessToken: string,
  baseDomain: string
): Promise<Array<{
  id: number
  name: string
  sort: number
  is_main: boolean
  _embedded: {
    statuses: Array<{
      id: number
      name: string
      sort: number
      color: string
    }>
  }
}>> {
  const response = await fetch(`https://${baseDomain}/api/v4/leads/pipelines`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get pipelines: ${response.status}`)
  }

  const data = await response.json()
  return data._embedded.pipelines
}
```

### Получение каналов

```typescript
// lib/crm/kommo/channels.ts

export async function getChannels(
  accessToken: string,
  baseDomain: string
): Promise<Array<{
  id: number
  name: string
  type: string
  account_id: number
}>> {
  const response = await fetch(`https://${baseDomain}/api/v4/channels`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get channels: ${response.status}`)
  }

  const data = await response.json()
  return data._embedded.channels
}
```

### Получение полей сделок

```typescript
// lib/crm/kommo/fields.ts

export async function getDealFields(
  accessToken: string,
  baseDomain: string
): Promise<Array<{
  id: number
  name: string
  type: string
  code: string
  is_system: boolean
}>> {
  const response = await fetch(`https://${baseDomain}/api/v4/leads/custom_fields`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get deal fields: ${response.status}`)
  }

  const data = await response.json()
  return data._embedded.custom_fields
}
```

### Получение полей контактов

```typescript
export async function getContactFields(
  accessToken: string,
  baseDomain: string
): Promise<Array<{
  id: number
  name: string
  type: string
  code: string
  is_system: boolean
}>> {
  const response = await fetch(`https://${baseDomain}/api/v4/contacts/custom_fields`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get contact fields: ${response.status}`)
  }

  const data = await response.json()
  return data._embedded.custom_fields
}
```

### Отправка сообщения

```typescript
// lib/crm/kommo/messages.ts

export async function sendMessage(
  accessToken: string,
  baseDomain: string,
  entityId: number,
  entityType: 'leads' | 'contacts',
  message: string,
  channelId?: number
) {
  const response = await fetch(`https://${baseDomain}/api/v4/${entityType}/${entityId}/notes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      {
        entity_id: entityId,
        note_type: channelId ? 'whatsapp_message' : 'common',
        params: {
          text: message,
          ...(channelId && { channel_id: channelId }),
        },
      },
    ]),
  })

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.status}`)
  }

  return await response.json()
}
```

### Создание задачи

```typescript
export async function createTask(
  accessToken: string,
  baseDomain: string,
  task: {
    text: string
    complete_till: number
    task_type_id: number
    responsible_user_id: number
    entity_id: number
    entity_type: 'leads' | 'contacts' | 'companies'
  }
) {
  const response = await fetch(`https://${baseDomain}/api/v4/tasks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([task]),
  })

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.status}`)
  }

  return await response.json()
}
```

### Обновление поля сделки

```typescript
export async function updateDealField(
  accessToken: string,
  baseDomain: string,
  dealId: number,
  fieldId: number,
  value: any
) {
  const response = await fetch(`https://${baseDomain}/api/v4/leads/${dealId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      custom_fields_values: [
        {
          field_id: fieldId,
          values: [{ value }],
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to update deal field: ${response.status}`)
  }

  return await response.json()
}
```

---

## Webhooks

### Настройка webhook в Kommo

```typescript
// lib/crm/kommo/webhooks.ts

export async function setupWebhook(
  accessToken: string,
  baseDomain: string,
  webhookUrl: string
) {
  const response = await fetch(`https://${baseDomain}/api/v4/webhooks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      destination: webhookUrl,
      settings: {
        add_contact: true,
        update_contact: true,
        delete_contact: true,
        add_lead: true,
        update_lead: true,
        delete_lead: true,
        status_lead: true,
        responsible_lead: true,
        restore_lead: true,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to setup webhook: ${response.status}`)
  }

  return await response.json()
}
```

### Обработка webhook

```typescript
// app/api/webhooks/kommo/route.ts

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { processKommoWebhook } from '@/lib/services/webhook-processor'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-signature')

  // Проверка подписи
  const secret = process.env.KOMMO_WEBHOOK_SECRET!
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  // Обработка события
  await processKommoWebhook(event)

  return NextResponse.json({ received: true })
}
```

### Типы событий webhook

```typescript
// lib/services/webhook-processor.ts

export interface KommoWebhookEvent {
  account: {
    id: number
    subdomain: string
  }
  leads?: {
    add?: Array<{ id: number }>
    update?: Array<{ id: number }>
    delete?: Array<{ id: number }>
    status?: Array<{ id: number; status_id: number }>
    responsible?: Array<{ id: number; responsible_user_id: number }>
    restore?: Array<{ id: number }>
  }
  contacts?: {
    add?: Array<{ id: number }>
    update?: Array<{ id: number }>
    delete?: Array<{ id: number }>
  }
}

export async function processKommoWebhook(event: KommoWebhookEvent) {
  // Обработка событий сделок
  if (event.leads?.add) {
    for (const lead of event.leads.add) {
      await handleLeadCreated(lead.id, event.account.id)
    }
  }

  if (event.leads?.update) {
    for (const lead of event.leads.update) {
      await handleLeadUpdated(lead.id, event.account.id)
    }
  }

  if (event.leads?.status) {
    for (const lead of event.leads.status) {
      await handleLeadStatusChanged(lead.id, lead.status_id, event.account.id)
    }
  }

  // Обработка событий контактов
  if (event.contacts?.add) {
    for (const contact of event.contacts.add) {
      await handleContactCreated(contact.id, event.account.id)
    }
  }

  if (event.contacts?.update) {
    for (const contact of event.contacts.update) {
      await handleContactUpdated(contact.id, event.account.id)
    }
  }
}
```

---

## Синхронизация данных

### Полная синхронизация

```typescript
// app/api/v1/agents/[id]/sync-crm/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { createKommoApiForOrg } from '@/lib/repositories/crm-connection'
import { getPipelines, getChannels, getDealFields, getContactFields } from '@/lib/crm/kommo'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type } = await request.json() // 'funnels' | 'channels' | 'fields' | 'all'

  const kommo = await createKommoApiForOrg(session.user.workspaceId)
  if (!kommo) {
    return NextResponse.json(
      { error: 'CRM not connected' },
      { status: 400 }
    )
  }

  const results: any = {}

  if (type === 'funnels' || type === 'all') {
    results.funnels = await getPipelines(kommo.accessToken, kommo.baseDomain)
  }

  if (type === 'channels' || type === 'all') {
    results.channels = await getChannels(kommo.accessToken, kommo.baseDomain)
  }

  if (type === 'fields' || type === 'all') {
    results.dealFields = await getDealFields(kommo.accessToken, kommo.baseDomain)
    results.contactFields = await getContactFields(kommo.accessToken, kommo.baseDomain)
  }

  return NextResponse.json({ data: results })
}
```

---

## Примеры использования

### Полный цикл: OAuth → Синхронизация → Использование

```typescript
// 1. Инициализация OAuth
const authUrl = `/api/v1/crm/kommo/oauth?domain=${domain}&redirect_uri=${redirectUri}`
window.location.href = authUrl

// 2. После callback, синхронизация данных
const syncResponse = await fetch(`/api/v1/agents/${agentId}/sync-crm`, {
  method: 'POST',
  body: JSON.stringify({ type: 'all' }),
})

// 3. Использование данных
const { data } = await syncResponse.json()
// data.funnels - воронки
// data.channels - каналы
// data.dealFields - поля сделок
// data.contactFields - поля контактов
```

---

**Дата создания:** 2025-01-26  
**Версия:** 1.0

