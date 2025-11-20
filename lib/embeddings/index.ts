/**
 * OpenRouter Embeddings Generation
 * Utilities for creating vector embeddings for semantic search
 */

import { getOpenRouterClient } from '@/lib/services/ai/openrouter.client'
import { logger } from '@/lib/logger'
import type { EmbeddingOptions } from '@/lib/types/knowledge-base'

const DEFAULT_EMBEDDING_MODEL = 'openai/text-embedding-3-large'
const DEFAULT_DIMENSIONS = 1536

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(
  text: string,
  options: Partial<EmbeddingOptions> = {}
): Promise<number[]> {
  try {
    const model = options.model || DEFAULT_EMBEDDING_MODEL

    logger.debug('Generating embedding', {
      textLength: text.length,
      model,
    })

    const client = getOpenRouterClient()
    const response = await client.embeddings(text, { model })

    const embedding = response.data[0]?.embedding

    if (!embedding) {
      throw new Error('No embedding returned from OpenRouter')
    }

    logger.debug('Embedding generated', {
      dimensions: embedding.length,
      usage: response.usage,
    })

    return embedding
  } catch (error) {
    logger.error('Failed to generate embedding', { error, textLength: text.length })
    throw error
  }
}

/**
 * Generate embeddings for multiple texts in batch
 * Automatically handles batching to avoid rate limits
 */
export async function generateEmbeddings(
  texts: string[],
  options: Partial<EmbeddingOptions> = {}
): Promise<number[][]> {
  const BATCH_SIZE = 100 // OpenRouter allows up to 2048, but we use smaller batches

  try {
    const model = options.model || DEFAULT_EMBEDDING_MODEL

    logger.info('Generating embeddings batch', {
      count: texts.length,
      model,
    })

    const embeddings: number[][] = []
    const client = getOpenRouterClient()

    // Process in batches
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE)

      logger.debug('Processing batch', {
        batchIndex: i / BATCH_SIZE,
        batchSize: batch.length,
      })

      const response = await client.embeddings(batch, { model })

      const batchEmbeddings = response.data.map((item) => item.embedding)
      embeddings.push(...batchEmbeddings)

      logger.debug('Batch processed', {
        batchIndex: i / BATCH_SIZE,
        usage: response.usage,
      })

      // Small delay between batches to avoid rate limits
      if (i + BATCH_SIZE < texts.length) {
        await sleep(100)
      }
    }

    logger.info('Embeddings generation complete', {
      total: embeddings.length,
    })

    return embeddings
  } catch (error) {
    logger.error('Failed to generate embeddings batch', {
      error,
      count: texts.length,
    })
    throw error
  }
}

/**
 * Calculate token count for text (approximate)
 * Uses ~4 characters per token on average for English
 */
export function estimateTokenCount(text: string): number {
  // Simple estimation: ~4 chars per token
  return Math.ceil(text.length / 4)
}

/**
 * Calculate embedding cost
 * Pricing based on OpenRouter models
 */
export function calculateEmbeddingCost(
  tokenCount: number,
  model: string = DEFAULT_EMBEDDING_MODEL
): number {
  const pricePerToken: Record<string, number> = {
    'openai/text-embedding-3-small': 0.00002 / 1000,
    'openai/text-embedding-3-large': 0.00013 / 1000,
    'openai/text-embedding-ada-002': 0.0001 / 1000,
  }

  const price = pricePerToken[model] || pricePerToken[DEFAULT_EMBEDDING_MODEL]
  return tokenCount * price
}

/**
 * Check if embeddings are similar (above threshold)
 */
export function areSimilar(
  embedding1: number[],
  embedding2: number[],
  threshold: number = 0.8
): boolean {
  const similarity = cosineSimilarity(embedding1, embedding2)
  return similarity >= threshold
}

/**
 * Calculate cosine similarity between two vectors
 * Returns value between -1 and 1 (1 = identical, 0 = orthogonal, -1 = opposite)
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let norm1 = 0
  let norm2 = 0

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i]
    norm1 += vec1[i] * vec1[i]
    norm2 += vec2[i] * vec2[i]
  }

  const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2)
  return magnitude === 0 ? 0 : dotProduct / magnitude
}

/**
 * Normalize vector to unit length
 */
export function normalizeVector(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
  return magnitude === 0 ? vector : vector.map((val) => val / magnitude)
}

// Helper function
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
