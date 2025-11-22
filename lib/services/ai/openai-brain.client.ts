type BrainToolCall = {
  type: 'function'
  function: {
    name: string
    description?: string
    parameters: Record<string, unknown>
  }
}

export interface OpenAIBrainConfig {
  apiKey: string
  model?: string
  baseUrl?: string
  instructions?: string
  tools?: BrainToolCall[]
}

export interface BrainContext {
  agentId?: string
  workspaceId?: string
  availableData?: Record<string, unknown>
}

export class OpenAIBrainClient {
  private readonly apiKey: string
  private readonly model: string
  private readonly baseUrl: string
  private readonly instructions?: string
  private readonly tools?: BrainToolCall[]

  constructor(config: OpenAIBrainConfig) {
    this.apiKey = config.apiKey
    this.model = config.model ?? 'gpt-5'
    this.baseUrl = config.baseUrl ?? 'https://api.openai.com/v1'
    this.instructions = config.instructions
    this.tools = config.tools
  }

  async processCommand(command: string, context: BrainContext = {}) {
    const systemPrompt = this.buildSystemPrompt(context)
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: command },
        ],
        tools: this.tools,
        tool_choice: this.tools && this.tools.length > 0 ? 'auto' : undefined,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI Brain error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return await response.json()
  }

  private buildSystemPrompt(context: BrainContext): string {
    const parts: string[] = []

    if (this.instructions) {
      parts.push('## Custom Instructions')
      parts.push(this.instructions)
      parts.push('')
    }

    parts.push('## Workspace Context')
    parts.push(`Agent ID: ${context.agentId ?? 'N/A'}`)
    parts.push(`Workspace ID: ${context.workspaceId ?? 'N/A'}`)

    if (context.availableData) {
      parts.push('')
      parts.push('## Available Data')
      parts.push(JSON.stringify(context.availableData, null, 2))
    }

    return parts.join('\n')
  }
}
