# WebSocket/SSE Setup - Real-time обновления

> Полная документация по настройке WebSocket и Server-Sent Events для real-time обновлений
> 
> **Версия:** 1.0  
> **Дата обновления:** 2025-01-26

## 📋 Содержание

1. [WebSocket сервер](#websocket-сервер)
2. [WebSocket клиент](#websocket-клиент)
3. [Server-Sent Events (SSE)](#server-sent-events-sse)
4. [Примеры использования](#примеры-использования)

---

## WebSocket сервер

### Инициализация (уже существует в lib/websocket/server.ts)

```typescript
// lib/websocket/server.ts (уже существует)

import { Server as HTTPServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import { initializeWebSocketServer } from '@/lib/websocket/server'

// В Next.js API route или custom server
export function setupWebSocket(httpServer: HTTPServer) {
  return initializeWebSocketServer(httpServer)
}
```

### API Route для WebSocket

```typescript
// app/api/socket/io/route.ts

import { NextRequest } from 'next/server'
import { Server as HTTPServer } from 'http'
import { initializeWebSocketServer } from '@/lib/websocket/server'

// Для Next.js нужен custom server или использование Socket.io с Next.js
// Альтернатива: использовать отдельный WebSocket сервер
```

---

## WebSocket клиент

### Использование (уже существует в lib/websocket/client.ts)

```typescript
import { getWebSocketClient } from '@/lib/websocket/client'

const ws = getWebSocketClient()

// Подписка на уведомления
ws.onNotification((notification) => {
  console.log('New notification:', notification)
})

// Подписка на обновления задач
ws.onJobUpdate((job) => {
  console.log('Job updated:', job)
})
```

---

## Server-Sent Events (SSE)

### SSE Endpoint

```typescript
// app/api/sse/route.ts

import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      // Отправка начального сообщения
      controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'))

      // Подписка на события
      const interval = setInterval(() => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'ping',
          timestamp: Date.now(),
        })}\n\n`))
      }, 30000) // Ping каждые 30 секунд

      // Очистка при закрытии
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

---

## Примеры использования

### React Hook для WebSocket

```typescript
// hooks/use-websocket.ts

import { useEffect } from 'react'
import { getWebSocketClient } from '@/lib/websocket/client'

export function useWebSocket() {
  useEffect(() => {
    const ws = getWebSocketClient()
    
    const unsubscribeNotification = ws.onNotification((notification) => {
      // Обработка уведомления
    })

    return () => {
      unsubscribeNotification()
    }
  }, [])
}
```

---

**Дата создания:** 2025-01-26  
**Версия:** 1.0

