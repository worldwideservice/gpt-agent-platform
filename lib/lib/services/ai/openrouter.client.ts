import { z } from 'zod'

const OpenRouterEnvSchema = z.object({
  apiKey: z.string().min(1, 'OPENROUTER_API_KEY is required'),
  baseUrl: z.string().url().default('https://openrouter.ai/api/v1'),
  defaultModel: z.string().default('openai/gpt-4o-mini'),
  embeddingModel: z.string().default('openai/text-embedding-3-large'),
  referer: z.string().default('http://localhost:3000'),
  appTitle: z.string().default('GPT Agent AI Platform'),
})

export type OpenRouterClientConfig = z.infer<typeof OpenRouterEnvSchema>

export type OpenRouterMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  metadata?: Record<string, unknown>
}

export interface OpenRouterChatChoice {
  index?: number
  finish_reason?: string | null
  message: {
    role: string
    content: string
  }
}

export interface OpenRouterChatResponse {
  id: string
  model: string
  created?: number
  choices: OpenRouterChatChoice[]
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface OpenRouterEmbeddingResponse {
  data: Array<{
    embedding: number[]
    index: number
  }>
  model: string
  usage?: {
    prompt_tokens: number
    total_tokens: number
  }
}

export class OpenRouterClient {
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly referer: string
  private readonly appTitle: string
  readonly defaultModel: string
  readonly embeddingModel: string

  constructor(config: z.infer<typeof OpenRouterEnvSchema>) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl
    this.defaultModel = config.defaultModel
    this.embeddingModel = config.embeddingModel
    this.referer = config.referer
    this.appTitle = config.appTitle
  }

  async chat(messages: OpenRouterMessage[], options: ChatOptions = {}): Promise<OpenRouterChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify({
        model: options.model ?? this.defaultModel,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
        top_p: options.topP ?? 1,
        metadata: options.metadata,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenRouter chat error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return (await response.json()) as OpenRouterChatResponse
  }

  async embeddings(input: string | string[], options?: { model?: string }): Promise<OpenRouterEmbeddingResponse> {
    const payloadInput = Array.isArray(input) ? input : [input]

    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify({
        model: options?.model ?? this.embeddingModel,
        input: payloadInput,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenRouter embeddings error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return (await response.json()) as OpenRouterEmbeddingResponse
  }

  private buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      'HTTP-Referer': this.referer,
      'X-Title': this.appTitle,
    }
  }
}

let sharedClient: OpenRouterClient | null = null

const buildClientConfig = (
  overrides?: Partial<z.input<typeof OpenRouterEnvSchema>>,
): OpenRouterClientConfig => {
  return OpenRouterEnvSchema.parse({
    apiKey: overrides?.apiKey ?? process.env.OPENROUTER_API_KEY,
    baseUrl: overrides?.baseUrl ?? process.env.OPENROUTER_BASE_URL,
    defaultModel: overrides?.defaultModel ?? process.env.OPENROUTER_DEFAULT_MODEL,
    embeddingModel: overrides?.embeddingModel ?? process.env.OPENROUTER_EMBEDDING_MODEL,
    referer: overrides?.referer ?? process.env.NEXT_PUBLIC_APP_URL,
    appTitle: overrides?.appTitle ?? process.env.OPENROUTER_APP_TITLE,
  })
}

export function createOpenRouterClient(
  overrides?: Partial<z.input<typeof OpenRouterEnvSchema>>,
): OpenRouterClient {
  const config = buildClientConfig(overrides)
  return new OpenRouterClient(config)
}

export function getOpenRouterClient(): OpenRouterClient {
  if (sharedClient) {
    return sharedClient
  }

  sharedClient = createOpenRouterClient()
  return sharedClient
}
