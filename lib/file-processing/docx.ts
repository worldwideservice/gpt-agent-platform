/**
 * DOCX Text Extraction
 * Extract text content from Microsoft Word documents
 */

import { logger } from '@/lib/logger'

// Dynamic import to avoid bundling issues
let mammoth: any = null

async function getMammoth() {
  if (!mammoth) {
    mammoth = await import('mammoth')
  }
  return mammoth
}

export interface DOCXExtractionResult {
  text: string
  messages: string[]
}

/**
 * Extract text from DOCX buffer
 */
export async function extractTextFromDOCX(
  buffer: Buffer
): Promise<DOCXExtractionResult> {
  try {
    logger.info('Extracting text from DOCX', {
      size: buffer.length,
    })

    const lib = await getMammoth()
    const result = await lib.extractRawText({ buffer })

    logger.info('DOCX text extracted', {
      textLength: result.value.length,
      messages: result.messages.length,
    })

    return {
      text: result.value,
      messages: result.messages.map((m: any) => m.message),
    }
  } catch (error) {
    logger.error('Failed to extract text from DOCX', { error })
    throw new Error('Failed to extract text from DOCX')
  }
}

/**
 * Extract text from DOCX file path
 */
export async function extractTextFromDOCXFile(
  filePath: string
): Promise<DOCXExtractionResult> {
  try {
    const fs = await import('fs/promises')
    const buffer = await fs.readFile(filePath)
    return extractTextFromDOCX(buffer)
  } catch (error) {
    logger.error('Failed to read DOCX file', { error, filePath })
    throw new Error('Failed to read DOCX file')
  }
}

/**
 * Extract HTML from DOCX (preserves some formatting)
 */
export async function extractHTMLFromDOCX(
  buffer: Buffer
): Promise<string> {
  try {
    const lib = await getMammoth()
    const result = await lib.convertToHtml({ buffer })
    return result.value
  } catch (error) {
    logger.error('Failed to extract HTML from DOCX', { error })
    throw new Error('Failed to extract HTML from DOCX')
  }
}

/**
 * Extract markdown from DOCX
 */
export async function extractMarkdownFromDOCX(
  buffer: Buffer
): Promise<string> {
  try {
    const lib = await getMammoth()
    const result = await lib.convertToMarkdown({ buffer })
    return result.value
  } catch (error) {
    logger.error('Failed to extract markdown from DOCX', { error })
    throw new Error('Failed to extract markdown from DOCX')
  }
}

/**
 * Check if buffer is a valid DOCX
 */
export function isDOCX(buffer: Buffer): boolean {
  // DOCX files are ZIP archives, check for PK signature
  return buffer.slice(0, 2).toString() === 'PK'
}
