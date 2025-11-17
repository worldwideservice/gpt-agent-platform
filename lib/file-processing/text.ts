/**
 * Text and Markdown Extraction
 * Handle plain text and markdown files
 */

import { logger } from '@/lib/logger'

export interface TextExtractionResult {
  text: string
  encoding: string
  lineCount: number
}

/**
 * Extract text from plain text buffer
 */
export function extractTextFromBuffer(
  buffer: Buffer,
  encoding: BufferEncoding = 'utf-8'
): TextExtractionResult {
  try {
    const text = buffer.toString(encoding)
    const lineCount = (text.match(/\n/g) || []).length + 1

    logger.debug('Text extracted from buffer', {
      textLength: text.length,
      lineCount,
      encoding,
    })

    return {
      text,
      encoding,
      lineCount,
    }
  } catch (error) {
    logger.error('Failed to extract text from buffer', { error })
    throw new Error('Failed to extract text')
  }
}

/**
 * Extract text from file
 */
export async function extractTextFromFile(
  filePath: string,
  encoding: BufferEncoding = 'utf-8'
): Promise<TextExtractionResult> {
  try {
    const fs = await import('fs/promises')
    const buffer = await fs.readFile(filePath)
    return extractTextFromBuffer(buffer, encoding)
  } catch (error) {
    logger.error('Failed to read text file', { error, filePath })
    throw new Error('Failed to read text file')
  }
}

/**
 * Extract plain text from markdown (strips formatting)
 */
export function extractTextFromMarkdown(markdown: string): string {
  let text = markdown

  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, '')

  // Remove markdown links but keep text
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')

  // Remove images
  text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')

  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, '')
  text = text.replace(/`([^`]+)`/g, '$1')

  // Remove headers (but keep text)
  text = text.replace(/^#{1,6}\s+/gm, '')

  // Remove bold/italic
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2')
  text = text.replace(/(\*|_)(.*?)\1/g, '$2')

  // Remove blockquotes
  text = text.replace(/^>\s+/gm, '')

  // Remove horizontal rules
  text = text.replace(/^[-*_]{3,}$/gm, '')

  // Remove list markers
  text = text.replace(/^[\s]*[-*+]\s+/gm, '')
  text = text.replace(/^[\s]*\d+\.\s+/gm, '')

  // Normalize whitespace
  text = text.replace(/\n{3,}/g, '\n\n')
  text = text.trim()

  return text
}

/**
 * Detect text encoding
 */
export function detectEncoding(buffer: Buffer): BufferEncoding {
  // Check for BOM (Byte Order Mark)
  if (buffer.length >= 3) {
    // UTF-8 BOM
    if (
      buffer[0] === 0xef &&
      buffer[1] === 0xbb &&
      buffer[2] === 0xbf
    ) {
      return 'utf-8'
    }

    // UTF-16 LE BOM
    if (buffer[0] === 0xff && buffer[1] === 0xfe) {
      return 'utf16le'
    }

    // UTF-16 BE BOM
    if (buffer[0] === 0xfe && buffer[1] === 0xff) {
      return 'utf-8' // Node.js doesn't support utf16be directly
    }
  }

  // Try to detect by content
  const sample = buffer.slice(0, Math.min(1000, buffer.length))

  // Check for null bytes (likely binary or UTF-16)
  if (sample.includes(0x00)) {
    return 'utf16le'
  }

  // Default to UTF-8
  return 'utf-8'
}

/**
 * Clean text for better processing
 */
export function cleanText(text: string): string {
  let cleaned = text

  // Remove control characters (except newline and tab)
  cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')

  // Normalize newlines
  cleaned = cleaned.replace(/\r\n/g, '\n')
  cleaned = cleaned.replace(/\r/g, '\n')

  // Remove excessive whitespace
  cleaned = cleaned.replace(/[ \t]+/g, ' ')
  cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n')

  // Trim lines
  cleaned = cleaned
    .split('\n')
    .map((line) => line.trim())
    .join('\n')

  // Trim overall
  cleaned = cleaned.trim()

  return cleaned
}

/**
 * Truncate text to max length
 */
export function truncateText(
  text: string,
  maxLength: number,
  ellipsis: string = '...'
): string {
  if (text.length <= maxLength) {
    return text
  }

  return text.slice(0, maxLength - ellipsis.length) + ellipsis
}

/**
 * Extract excerpt from text (first N characters)
 */
export function extractExcerpt(
  text: string,
  maxLength: number = 200
): string {
  // Try to break at sentence
  const excerpt = text.slice(0, maxLength)
  const lastPeriod = excerpt.lastIndexOf('. ')

  if (lastPeriod > maxLength * 0.5) {
    return excerpt.slice(0, lastPeriod + 1)
  }

  return truncateText(excerpt, maxLength)
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.split(/\s+/).filter((word) => word.length > 0).length
}

/**
 * Validate text content
 */
export function isValidText(text: string): boolean {
  // Check if text has reasonable content
  if (!text || text.trim().length === 0) {
    return false
  }

  // Check if text is not just whitespace/control characters
  if (!/[a-zA-Z0-9а-яА-Я]/.test(text)) {
    return false
  }

  return true
}
