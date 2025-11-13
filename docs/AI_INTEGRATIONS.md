# AI интеграции - OpenRouter и OpenAI

> Полная документация по интеграции с AI сервисами (OpenRouter, OpenAI GPT-5 Brain)
> 
> **Версия:** 1.1
> **Дата обновления:** 2025-02-18

## 📋 Содержание

1. [OpenRouter интеграция](#openrouter-интеграция)
2. [OpenAI GPT-5 Brain](#openai-gpt-5-brain)
3. [Embeddings](#embeddings)
4. [Whisper (ASR)](#whisper-asr)
5. [TTS (Text-to-Speech)](#tts-text-to-speech)
6. [Векторная БД](#векторная-бд)
7. [Примеры использования](#примеры-использования)
8. [Product Analytics Hooks](#product-analytics-hooks)

---

## OpenRouter интеграция

### Конфигурация

```typescript
// lib/services/ai/openrouter.client.ts

import { z } from 'zod'

const OpenRouterConfigSchema = z.object({
  apiKey: z.string().min(1),
  baseURL: z.string().url().default('https://openrouter.ai/api/v1'),
  defaultModel: z.string().default('openai/gpt-4o-mini'),
  embeddingModel: z.string().default('openai/text-embedding-3-large'),
})

export class OpenRouterClient {
  private apiKey: string
  private baseURL: string
  private defaultModel: string
  private embeddingModel: string

  constructor(config: z.infer<typeof OpenRouterConfigSchema>) {
    const validated = OpenRouterConfigSchema.parse(config)
    this.apiKey = validated.apiKey
    this.baseURL = validated.baseURL
    this.defaultModel = validated.defaultModel
    this.embeddingModel = validated.embeddingModel
  }

  async chat(messages: Array<{ role: string; content: string }>, options?: {
    model?: string
    temperature?: number
    maxTokens?: number
  }) {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'GPT Agent AI Platform',
      },
      body: JSON.stringify({
        model: options?.model || this.defaultModel,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2048,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenRouter API error: ${response.status} ${error}`)
    }

    return await response.json()
  }

  async embeddings(text: string | string[]) {
    const texts = Array.isArray(text) ? text : [text]
    
    const response = await fetch(`${this.baseURL}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.embeddingModel,
        input: texts,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenRouter Embeddings error: ${response.status} ${error}`)
    }

    return await response.json()
  }
}
```

### Использование

```typescript
import { OpenRouterClient } from '@/lib/services/ai/openrouter.client'

const client = new OpenRouterClient({
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultModel: 'openai/gpt-4o-mini',
  embeddingModel: 'openai/text-embedding-3-large',
})

// Chat completion
const response = await client.chat([
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Hello!' },
], {
  temperature: 0.7,
  maxTokens: 1000,
})

// Embeddings
const embeddings = await client.embeddings('Hello, world!')
```

---

## OpenAI GPT-5 Brain

### Конфигурация

```typescript
// lib/services/ai/openai-brain.client.ts

import OpenAI from 'openai'

export interface BrainConfig {
  apiKey: string
  model?: string
  baseURL?: string
  customInstructions?: string
  tools?: Array<{
    type: 'function'
    function: {
      name: string
      description: string
      parameters: Record<string, any>
    }
  }>
}

export class OpenAIBrainClient {
  private client: OpenAI
  private model: string
  private customInstructions: string
  private tools: Array<any>

  constructor(config: BrainConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL || 'https://api.openai.com/v1',
    })
    this.model = config.model || 'gpt-5'
    this.customInstructions = config.customInstructions || ''
    this.tools = config.tools || []
  }

  async processCommand(
    command: string,
    context: {
      agentId?: string
      workspaceId?: string
      availableData?: Record<string, any>
    }
  ) {
    const systemPrompt = this.buildSystemPrompt(context)
    
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: command,
        },
      ],
      tools: this.tools.length > 0 ? this.tools : undefined,
      tool_choice: this.tools.length > 0 ? 'auto' : undefined,
      temperature: 0.7,
      max_tokens: 4000,
    })

    return response.choices[0].message
  }

  private buildSystemPrompt(context: {
    agentId?: string
    workspaceId?: string
    availableData?: Record<string, any>
  }): string {
    const parts: string[] = []

    if (this.customInstructions) {
      parts.push('## Custom Instructions\n')
      parts.push(this.customInstructions)
      parts.push('\n')
    }

    parts.push('## Available Context\n')
    parts.push(`Agent ID: ${context.agentId || 'N/A'}`)
    parts.push(`Workspace ID: ${context.workspaceId || 'N/A'}`)
    
    if (context.availableData) {
      parts.push('\n## Available Data\n')
      parts.push(JSON.stringify(context.availableData, null, 2))
    }

    parts.push('\n## Your Capabilities\n')
    parts.push('You can:')
    parts.push('- Create and modify automation rules')
    parts.push('- Analyze CRM data')
    parts.push('- Generate insights and recommendations')
    parts.push('- Process natural language commands')
    parts.push('- Understand context from knowledge base')

    return parts.join('\n')
  }

  async generateRule(
    description: string,
    context: {
      agentId: string
      workspaceId: string
      availableFields?: string[]
    }
  ) {
    const prompt = `Create an automation rule based on this description: "${description}"

Available fields: ${context.availableFields?.join(', ') || 'All fields'}

Return a JSON object with:
- name: string
- trigger_type: string
- conditions: array
- actions: array`

    const response = await this.processCommand(prompt, context)
    
    try {
      return JSON.parse(response.content || '{}')
    } catch {
      throw new Error('Failed to parse rule from AI response')
    }
  }
}
```

### Использование

```typescript
import { OpenAIBrainClient } from '@/lib/services/ai/openai-brain.client'

const brain = new OpenAIBrainClient({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'gpt-5',
  customInstructions: 'You are the AI Brain of GPT Agent platform...',
  tools: [
    {
      type: 'function',
      function: {
        name: 'create_rule',
        description: 'Create an automation rule',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            trigger_type: { type: 'string' },
            conditions: { type: 'array' },
            actions: { type: 'array' },
          },
        },
      },
    },
  ],
})

// Обработка команды
const result = await brain.processCommand(
  'Создай правило: если сделка переходит на этап "Квалификация", отправь приветственное сообщение',
  {
    agentId: 'agent-123',
    workspaceId: 'workspace-456',
  }
)

// Генерация правила
const rule = await brain.generateRule(
  'Отправлять напоминание через 3 дня после создания сделки',
  {
    agentId: 'agent-123',
    workspaceId: 'workspace-456',
    availableFields: ['name', 'status', 'created_at'],
  }
)
```

---

## Embeddings

### Конфигурация

```typescript
// lib/services/ai/embeddings.service.ts

import { OpenRouterClient } from './openrouter.client'

export class EmbeddingsService {
  private client: OpenRouterClient

  constructor(client: OpenRouterClient) {
    this.client = client
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embeddings(text)
    return response.data[0].embedding
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const response = await this.client.embeddings(texts)
    return response.data.map(item => item.embedding)
  }

  chunkText(text: string, chunkSize = 600, overlap = 120): string[] {
    const words = text.split(/\s+/)
    const chunks: string[] = []

    for (let start = 0; start < words.length; start += chunkSize - overlap) {
      const end = Math.min(words.length, start + chunkSize)
      const slice = words.slice(start, end).join(' ').trim()

      if (slice.length > 0) {
        chunks.push(slice)
      }

      if (end === words.length) break
    }

    return chunks
  }

  async processDocument(
    content: string,
    metadata: Record<string, any> = {}
  ): Promise<Array<{ content: string; embedding: number[]; metadata: Record<string, any> }>> {
    const chunks = this.chunkText(content)
    const embeddings = await this.generateEmbeddings(chunks)

    return chunks.map((chunk, index) => ({
      content: chunk,
      embedding: embeddings[index],
      metadata: {
        ...metadata,
        chunkIndex: index,
        totalChunks: chunks.length,
      },
    }))
  }
}
```

---

## Whisper (ASR)

### Конфигурация

```typescript
// lib/services/ai/whisper.service.ts

import OpenAI from 'openai'

export class WhisperService {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async transcribe(audioFile: File | Buffer, options?: {
    language?: string
    prompt?: string
    responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'
  }): Promise<string> {
    const file = audioFile instanceof File 
      ? new File([audioFile], audioFile.name, { type: audioFile.type })
      : new File([audioFile], 'audio.mp3', { type: 'audio/mpeg' })

    const transcription = await this.client.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: options?.language,
      prompt: options?.prompt,
      response_format: options?.responseFormat || 'text',
    })

    return typeof transcription === 'string' 
      ? transcription 
      : transcription.text
  }
}
```

---

## TTS (Text-to-Speech)

### ElevenLabs

```typescript
// lib/services/ai/tts-elevenlabs.service.ts

export class ElevenLabsTTS {
  private apiKey: string
  private voiceId: string

  constructor(apiKey: string, voiceId: string) {
    this.apiKey = apiKey
    this.voiceId = voiceId
  }

  async synthesize(text: string, options?: {
    voiceId?: string
    modelId?: string
    stability?: number
    similarityBoost?: number
  }): Promise<Buffer> {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${options?.voiceId || this.voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: options?.modelId || 'eleven_multilingual_v2',
          voice_settings: {
            stability: options?.stability ?? 0.5,
            similarity_boost: options?.similarityBoost ?? 0.5,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`ElevenLabs TTS error: ${response.status}`)
    }

    return Buffer.from(await response.arrayBuffer())
  }
}
```

### Azure TTS

```typescript
// lib/services/ai/tts-azure.service.ts

export class AzureTTS {
  private apiKey: string
  private region: string

  constructor(apiKey: string, region: string) {
    this.apiKey = apiKey
    this.region = region
  }

  async synthesize(text: string, options?: {
    voice?: string
    language?: string
  }): Promise<Buffer> {
    const token = await this.getAccessToken()
    
    const response = await fetch(
      `https://${this.region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        },
        body: this.buildSSML(text, options),
      }
    )

    if (!response.ok) {
      throw new Error(`Azure TTS error: ${response.status}`)
    }

    return Buffer.from(await response.arrayBuffer())
  }

  private async getAccessToken(): Promise<string> {
    const response = await fetch(
      `https://${this.region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.apiKey,
        },
      }
    )

    return await response.text()
  }

  private buildSSML(text: string, options?: { voice?: string; language?: string }): string {
    const voice = options?.voice || 'ru-RU-DmitryNeural'
    const language = options?.language || 'ru-RU'
    
    return `<speak version='1.0' xml:lang='${language}'>
      <voice xml:lang='${language}' name='${voice}'>
        ${text}
      </voice>
    </speak>`
  }
}
```

---

## Векторная БД

### pgvector (Supabase)

```typescript
// lib/services/ai/vector.service.ts

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export class VectorService {
  private supabase = getSupabaseServiceRoleClient()

  async storeEmbedding(
    orgId: string,
    agentId: string | null,
    content: string,
    embedding: number[],
    metadata: Record<string, any> = {}
  ) {
    const { data, error } = await this.supabase
      .from('knowledge_chunks')
      .insert({
        org_id: orgId,
        agent_id: agentId,
        content,
        embedding: `[${embedding.join(',')}]`,
        metadata,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async searchSimilar(
    orgId: string,
    queryEmbedding: number[],
    options?: {
      agentId?: string
      articleId?: string
      limit?: number
      threshold?: number
    }
  ) {
    const { data, error } = await this.supabase.rpc('match_knowledge_chunks', {
      query_embedding: `[${queryEmbedding.join(',')}]`,
      org_uuid: orgId,
      agent_uuid: options?.agentId || null,
      article_uuid: options?.articleId || null,
      match_count: options?.limit || 5,
      similarity_threshold: options?.threshold || 0.3,
    })

    if (error) throw error
    return data
  }
}
```

---

## Примеры использования

### Полный цикл: документ → embeddings → поиск

```typescript
import { OpenRouterClient } from '@/lib/services/ai/openrouter.client'
import { EmbeddingsService } from '@/lib/services/ai/embeddings.service'
import { VectorService } from '@/lib/services/ai/vector.service'

// 1. Инициализация
const openRouter = new OpenRouterClient({
  apiKey: process.env.OPENROUTER_API_KEY!,
})
const embeddings = new EmbeddingsService(openRouter)
const vector = new VectorService()

// 2. Обработка документа
const document = 'Ваш текст документа...'
const processed = await embeddings.processDocument(document, {
  source: 'article-123',
  title: 'Название статьи',
})

// 3. Сохранение в векторную БД
for (const chunk of processed) {
  await vector.storeEmbedding(
    'workspace-456',
    'agent-123',
    chunk.content,
    chunk.embedding,
    chunk.metadata
  )
}

// 4. Поиск похожих
const query = 'Вопрос пользователя'
const queryEmbedding = await embeddings.generateEmbedding(query)
const results = await vector.searchSimilar(
  'workspace-456',
  queryEmbedding,
  {
    agentId: 'agent-123',
    limit: 5,
    threshold: 0.3,
  }
)
```

---

## Product Analytics Hooks

- **Компонент**: `components/providers/ProductAnalyticsProvider.tsx`.
- **Контексты**: `public` (маркетинг) и `app` (кабинет) — передаются через `context` пропс.
- **Поддерживаемые провайдеры**: Segment (`AnalyticsBrowser`) и PostHog (`posthog-js`).
- **События**: автоматически отправляет `page`/`$pageview` с пропертями `url` и `context`.
- **Планы развития**: добавить `identify`, `group`, события активации и интегрировать с release-notes алертами.

---

**Дата создания:** 2025-01-26  
**Версия:** 1.1

