# BullMQ Setup - Очереди задач

> Полная документация по настройке и использованию BullMQ для фоновых задач
> 
> **Версия:** 1.0  
> **Дата обновления:** 2025-01-26

## 📋 Содержание

1. [Конфигурация](#конфигурация)
2. [Типы задач](#типы-задач)
3. [Workers](#workers)
4. [Примеры использования](#примеры-использования)

---

## Конфигурация

### Базовая конфигурация

```typescript
// lib/queue.ts (уже существует, но можно улучшить)

import { Queue, Worker, QueueEvents } from 'bullmq'
import Redis from 'ioredis'

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  lazyConnect: true,
})

// Основная очередь
export const jobQueue = new Queue('app-jobs', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
})

// События очереди
export const queueEvents = new QueueEvents('app-jobs', { connection })
```

### Типы задач

```typescript
// lib/queue/types.ts

export enum JobType {
  // CRM синхронизация
  CRM_SYNC_FUNNELS = 'crm:sync:funnels',
  CRM_SYNC_CHANNELS = 'crm:sync:channels',
  CRM_SYNC_FIELDS = 'crm:sync:fields',
  
  // Обучение агента
  AGENT_TRAIN = 'agent:train',
  AGENT_PROCESS_ASSET = 'agent:process:asset',
  
  // Генерация правил
  RULE_GENERATE = 'rule:generate',
  
  // Уведомления
  NOTIFICATION_SEND = 'notification:send',
  
  // Обработка файлов
  FILE_PROCESS = 'file:process',
  
  // Аналитика
  ANALYTICS_PROCESS = 'analytics:process',
}

export interface JobData {
  [key: string]: any
}

export interface CRM SyncJobData {
  organizationId: string
  connectionId: string
  type: 'funnels' | 'channels' | 'fields'
}

export interface AgentTrainJobData {
  agentId: string
  organizationId: string
  assetIds: string[]
}

export interface RuleGenerateJobData {
  agentId: string
  organizationId: string
  description: string
  context: Record<string, any>
}
```

---

## Workers

### Worker для CRM синхронизации

```typescript
// services/worker/src/tasks/crm-sync.worker.ts

import { Worker } from 'bullmq'
import { JobType, CRM SyncJobData } from '@/lib/queue/types'
import { createKommoApiForOrg } from '@/lib/repositories/crm-connection'
import { getPipelines, getChannels, getDealFields, getContactFields } from '@/lib/crm/kommo'

export const crmSyncWorker = new Worker<CRM SyncJobData>(
  'app-jobs',
  async (job) => {
    const { organizationId, connectionId, type } = job.data

    const kommo = await createKommoApiForOrg(organizationId)
    if (!kommo) {
      throw new Error('CRM not connected')
    }

    switch (type) {
      case 'funnels':
        const funnels = await getPipelines(kommo.accessToken, kommo.baseDomain)
        // Сохранить в БД
        break
      case 'channels':
        const channels = await getChannels(kommo.accessToken, kommo.baseDomain)
        // Сохранить в БД
        break
      case 'fields':
        const dealFields = await getDealFields(kommo.accessToken, kommo.baseDomain)
        const contactFields = await getContactFields(kommo.accessToken, kommo.baseDomain)
        // Сохранить в БД
        break
    }

    return { success: true }
  },
  {
    connection: new Redis(process.env.REDIS_URL!),
    concurrency: 5,
  }
)
```

### Worker для обучения агента

```typescript
// services/worker/src/tasks/agent-training.worker.ts

import { Worker } from 'bullmq'
import { AgentTrainJobData } from '@/lib/queue/types'
import { EmbeddingsService } from '@/lib/services/ai/embeddings.service'
import { VectorService } from '@/lib/services/ai/vector.service'

export const agentTrainingWorker = new Worker<AgentTrainJobData>(
  'app-jobs',
  async (job) => {
    const { agentId, organizationId, assetIds } = job.data

    // Обновить прогресс
    await job.updateProgress(0)

    const embeddings = new EmbeddingsService(/* ... */)
    const vector = new VectorService()

    for (let i = 0; i < assetIds.length; i++) {
      const assetId = assetIds[i]
      
      // Обработать файл
      const processed = await embeddings.processDocument(/* ... */)
      
      // Сохранить в векторную БД
      for (const chunk of processed) {
        await vector.storeEmbedding(organizationId, agentId, chunk.content, chunk.embedding)
      }

      // Обновить прогресс
      await job.updateProgress((i + 1) / assetIds.length * 100)
    }

    return { success: true, processed: assetIds.length }
  },
  {
    connection: new Redis(process.env.REDIS_URL!),
    concurrency: 2, // Меньше для тяжелых задач
  }
)
```

---

## Примеры использования

### Добавление задачи в очередь

```typescript
import { jobQueue } from '@/lib/queue'
import { JobType } from '@/lib/queue/types'

// Синхронизация CRM
await jobQueue.add(JobType.CRM_SYNC_FUNNELS, {
  organizationId: 'workspace-123',
  connectionId: 'connection-456',
  type: 'funnels',
}, {
  priority: 1, // Высокий приоритет
})

// Обучение агента
await jobQueue.add(JobType.AGENT_TRAIN, {
  agentId: 'agent-123',
  organizationId: 'workspace-456',
  assetIds: ['asset-1', 'asset-2'],
}, {
  priority: 5, // Низкий приоритет
  delay: 5000, // Задержка 5 секунд
})
```

---

**Дата создания:** 2025-01-26  
**Версия:** 1.0

