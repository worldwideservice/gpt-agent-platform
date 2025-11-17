/**
 * Text Chunking Utilities
 * Split text into manageable chunks for embedding generation
 */

import { logger } from '@/lib/logger'
import type { ChunkingOptions } from '@/lib/types/knowledge-base'

const DEFAULT_CHUNK_SIZE = 1000 // characters
const DEFAULT_CHUNK_OVERLAP = 200 // characters
const DEFAULT_SEPARATORS = ['\n\n', '\n', '. ', '! ', '? ', '; ', ', ', ' ']

export interface TextChunk {
  content: string
  index: number
  start: number
  end: number
}

/**
 * Split text into chunks with overlap
 */
export function chunkText(
  text: string,
  options: Partial<ChunkingOptions> = {}
): TextChunk[] {
  const chunkSize = options.chunk_size || DEFAULT_CHUNK_SIZE
  const chunkOverlap = options.chunk_overlap || DEFAULT_CHUNK_OVERLAP
  const separators = options.separators || DEFAULT_SEPARATORS

  if (chunkOverlap >= chunkSize) {
    throw new Error('Overlap must be smaller than chunk size')
  }

  logger.debug('Chunking text', {
    textLength: text.length,
    chunkSize,
    chunkOverlap,
  })

  const chunks: TextChunk[] = []
  let currentPosition = 0
  let chunkIndex = 0

  while (currentPosition < text.length) {
    // Determine chunk end position
    let chunkEnd = Math.min(currentPosition + chunkSize, text.length)

    // If not at the end of text, try to break at a natural separator
    if (chunkEnd < text.length) {
      chunkEnd = findBestBreakpoint(
        text,
        currentPosition,
        chunkEnd,
        separators
      )
    }

    // Extract chunk
    const content = text.slice(currentPosition, chunkEnd).trim()

    if (content.length > 0) {
      chunks.push({
        content,
        index: chunkIndex,
        start: currentPosition,
        end: chunkEnd,
      })
      chunkIndex++
    }

    // Move position forward, accounting for overlap
    currentPosition = chunkEnd - chunkOverlap

    // Prevent infinite loop
    if (currentPosition <= chunks[chunks.length - 1]?.start) {
      currentPosition = chunkEnd
    }
  }

  logger.debug('Text chunked', {
    textLength: text.length,
    chunksCount: chunks.length,
    avgChunkSize: Math.round(
      chunks.reduce((sum, c) => sum + c.content.length, 0) / chunks.length
    ),
  })

  return chunks
}

/**
 * Find best breakpoint for chunk using separators
 */
function findBestBreakpoint(
  text: string,
  start: number,
  end: number,
  separators: string[]
): number {
  // Try each separator in order of preference
  for (const separator of separators) {
    const lastIndex = text.lastIndexOf(separator, end)

    // Separator found in reasonable range
    if (lastIndex > start && lastIndex < end) {
      return lastIndex + separator.length
    }
  }

  // No good separator found, use hard break
  return end
}

/**
 * Chunk text with semantic awareness (respects paragraphs, sentences)
 */
export function chunkTextSemantic(
  text: string,
  options: Partial<ChunkingOptions> = {}
): TextChunk[] {
  const chunkSize = options.chunk_size || DEFAULT_CHUNK_SIZE

  logger.debug('Semantic chunking text', {
    textLength: text.length,
    chunkSize,
  })

  const chunks: TextChunk[] = []

  // Split by double newline (paragraphs)
  const paragraphs = text.split(/\n\n+/)
  let currentChunk = ''
  let currentStart = 0
  let chunkIndex = 0

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim()
    if (!trimmedParagraph) continue

    // If adding this paragraph exceeds chunk size and we have content
    if (
      currentChunk &&
      currentChunk.length + trimmedParagraph.length > chunkSize
    ) {
      // Save current chunk
      chunks.push({
        content: currentChunk.trim(),
        index: chunkIndex,
        start: currentStart,
        end: currentStart + currentChunk.length,
      })
      chunkIndex++

      // Start new chunk
      currentChunk = trimmedParagraph + '\n\n'
      currentStart += currentChunk.length
    } else {
      // Add to current chunk
      currentChunk += trimmedParagraph + '\n\n'
    }
  }

  // Add remaining chunk
  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      index: chunkIndex,
      start: currentStart,
      end: currentStart + currentChunk.length,
    })
  }

  logger.debug('Semantic chunking complete', {
    chunksCount: chunks.length,
  })

  return chunks
}

/**
 * Chunk markdown text (preserves headings with their content)
 */
export function chunkMarkdown(
  markdown: string,
  options: Partial<ChunkingOptions> = {}
): TextChunk[] {
  const chunkSize = options.chunk_size || DEFAULT_CHUNK_SIZE

  logger.debug('Chunking markdown', {
    textLength: markdown.length,
    chunkSize,
  })

  const chunks: TextChunk[] = []

  // Split by headings
  const sections = markdown.split(/^(#{1,6}\s+.+)$/gm)
  let currentChunk = ''
  let currentHeading = ''
  let currentStart = 0
  let chunkIndex = 0

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].trim()
    if (!section) continue

    // Check if this is a heading
    if (section.match(/^#{1,6}\s+/)) {
      // If we have a current chunk, save it
      if (currentChunk.trim()) {
        chunks.push({
          content: (currentHeading + '\n\n' + currentChunk).trim(),
          index: chunkIndex,
          start: currentStart,
          end: currentStart + currentChunk.length,
        })
        chunkIndex++
      }

      // Start new chunk with this heading
      currentHeading = section
      currentChunk = ''
      currentStart += section.length
    } else {
      // Add content to current chunk
      if (currentChunk.length + section.length > chunkSize && currentChunk) {
        // Save current chunk
        chunks.push({
          content: (currentHeading + '\n\n' + currentChunk).trim(),
          index: chunkIndex,
          start: currentStart,
          end: currentStart + currentChunk.length,
        })
        chunkIndex++

        // Start new chunk with same heading
        currentChunk = section
        currentStart += currentChunk.length
      } else {
        currentChunk += '\n\n' + section
      }
    }
  }

  // Add remaining chunk
  if (currentChunk.trim()) {
    chunks.push({
      content: (currentHeading + '\n\n' + currentChunk).trim(),
      index: chunkIndex,
      start: currentStart,
      end: currentStart + currentChunk.length,
    })
  }

  logger.debug('Markdown chunking complete', {
    chunksCount: chunks.length,
  })

  return chunks
}

/**
 * Smart chunking - auto-detects format and uses appropriate strategy
 */
export function chunkTextSmart(
  text: string,
  options: Partial<ChunkingOptions> = {}
): TextChunk[] {
  // Detect format
  const hasMarkdownHeadings = /^#{1,6}\s+.+$/m.test(text)
  const hasManyParagraphs = (text.match(/\n\n/g) || []).length > 5

  // Choose strategy
  if (hasMarkdownHeadings) {
    logger.debug('Using markdown chunking strategy')
    return chunkMarkdown(text, options)
  } else if (hasManyParagraphs) {
    logger.debug('Using semantic chunking strategy')
    return chunkTextSemantic(text, options)
  } else {
    logger.debug('Using standard chunking strategy')
    return chunkText(text, options)
  }
}

/**
 * Calculate optimal chunk size based on token limit
 */
export function calculateOptimalChunkSize(
  tokenLimit: number = 8192,
  reservedTokens: number = 2048
): number {
  // Reserve tokens for prompt, response, etc.
  const availableTokens = tokenLimit - reservedTokens

  // ~4 characters per token on average
  return availableTokens * 4
}

/**
 * Estimate number of chunks for text
 */
export function estimateChunkCount(
  text: string,
  chunkSize: number = DEFAULT_CHUNK_SIZE
): number {
  return Math.ceil(text.length / chunkSize)
}

/**
 * Merge small chunks to optimize embedding costs
 */
export function mergeSmallChunks(
  chunks: TextChunk[],
  minChunkSize: number = 200
): TextChunk[] {
  const merged: TextChunk[] = []
  let currentMerged: TextChunk | null = null

  for (const chunk of chunks) {
    if (chunk.content.length >= minChunkSize) {
      // Chunk is large enough, save previous merge if any
      if (currentMerged) {
        merged.push(currentMerged)
        currentMerged = null
      }
      merged.push(chunk)
    } else {
      // Chunk is too small, merge with previous
      if (!currentMerged) {
        currentMerged = { ...chunk }
      } else {
        currentMerged.content += '\n\n' + chunk.content
        currentMerged.end = chunk.end
      }
    }
  }

  // Add remaining merged chunk
  if (currentMerged) {
    merged.push(currentMerged)
  }

  logger.debug('Merged small chunks', {
    original: chunks.length,
    merged: merged.length,
    saved: chunks.length - merged.length,
  })

  return merged
}
