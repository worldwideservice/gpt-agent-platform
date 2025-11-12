import { type OpenRouterEmbeddingResponse } from '@/lib/services/ai/openrouter.client'
import { resolveOpenRouterClient } from '@/lib/services/ai/openrouter-resolver'

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
): Promise<OpenRouterEmbeddingResponse> => {
 const client = await resolveOpenRouterClient(organizationId)
 const normalizedInput = Array.isArray(input) ? input : [input]
 return await client.embeddings(normalizedInput, { model: options?.model })
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
