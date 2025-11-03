interface EmbeddingResponse {
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

const DEFAULT_EMBEDDING_MODEL = 'openai/text-embedding-3-large'

const getOpenRouterApiKey = async (organizationId: string): Promise<string | null> => {
 // TODO: получить ключ из настроек организации, пока используем глобальный env
 if (process.env.OPENROUTER_API_KEY) {
 return process.env.OPENROUTER_API_KEY
 }

 console.warn('OPENROUTER_API_KEY is not configured. Embeddings generation is not available.', {
 organizationId,
 })

 return null
}

const chunkByTokenEstimate = (text: string, chunkSize = 600, overlap = 120): string[] => {
 const words = text.split(/\s+/)
 const chunks: string[] = []

 if (words.length === 0) {
 return []
 }

 for (let start = 0; start < words.length; start += chunkSize - overlap) {
 const end = Math.min(words.length, start + chunkSize)
 const slice = words.slice(start, end).join(' ').trim()

 if (slice.length > 0) {
 chunks.push(slice)
 }

 if (end === words.length) {
 break
 }
 }

 return chunks
}

export const generateEmbeddings = async (
 organizationId: string,
 input: string | string[],
 options?: { model?: string },
): Promise<EmbeddingResponse> => {
 const apiKey = await getOpenRouterApiKey(organizationId)

 if (!apiKey) {
 throw new Error('OpenRouter API key is not configured')
 }

 const normalizedInput = Array.isArray(input) ? input : [input]
 const model = options?.model ?? process.env.OPENROUTER_EMBEDDING_MODEL ?? DEFAULT_EMBEDDING_MODEL

 const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 Authorization: `Bearer ${apiKey}`,
 'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
 'X-Title': 'GPT Agent Platform',
 },
 body: JSON.stringify({
 model,
 input: normalizedInput,
 }),
 })

 if (!response.ok) {
 const errorText = await response.text()
 throw new Error(`OpenRouter embeddings error: ${response.status} ${response.statusText} - ${errorText}`)
 }

 const payload = (await response.json()) as EmbeddingResponse
 return payload
}

export const generateEmbeddingsForDocument = async (
 organizationId: string,
 content: string,
 options?: { model?: string; chunkSize?: number; overlap?: number },
): Promise<Array<{ content: string; embedding: number[] }>> => {
 const chunks = chunkByTokenEstimate(content, options?.chunkSize ?? 600, options?.overlap ?? 120)

 if (chunks.length === 0) {
 return []
 }

 const response = await generateEmbeddings(organizationId, chunks, { model: options?.model })

 return response.data.map((item, index) => ({
 content: chunks[index],
 embedding: item.embedding,
 }))
}

export { chunkByTokenEstimate }

















