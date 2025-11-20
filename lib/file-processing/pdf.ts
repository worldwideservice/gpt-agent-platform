/**
 * PDF Text Extraction
 * Extract text content from PDF files
 */

import { logger } from '@/lib/logger'

// Dynamic import to avoid bundling issues
let pdfParse: any = null

async function getPdfParse() {
  if (!pdfParse) {
    const pdfParseModule = await import('pdf-parse')
    // Handle both ESM and CommonJS exports
    pdfParse = 'default' in pdfParseModule ? pdfParseModule.default : pdfParseModule
  }
  return pdfParse
}

export interface PDFExtractionResult {
  text: string
  pages: number
  metadata?: {
    title?: string
    author?: string
    subject?: string
    keywords?: string
    creator?: string
    producer?: string
    creationDate?: string
    modDate?: string
  }
}

/**
 * Extract text from PDF buffer
 */
export async function extractTextFromPDF(
  buffer: Buffer
): Promise<PDFExtractionResult> {
  try {
    logger.info('Extracting text from PDF', {
      size: buffer.length,
    })

    const parse = await getPdfParse()
    const data = await parse(buffer)

    const result: PDFExtractionResult = {
      text: data.text,
      pages: data.numpages,
      metadata: {
        title: data.info?.Title,
        author: data.info?.Author,
        subject: data.info?.Subject,
        keywords: data.info?.Keywords,
        creator: data.info?.Creator,
        producer: data.info?.Producer,
        creationDate: data.info?.CreationDate,
        modDate: data.info?.ModDate,
      },
    }

    logger.info('PDF text extracted', {
      pages: result.pages,
      textLength: result.text.length,
    })

    return result
  } catch (error) {
    logger.error('Failed to extract text from PDF', { error })
    throw new Error('Failed to extract text from PDF')
  }
}

/**
 * Extract text from PDF file path
 */
export async function extractTextFromPDFFile(
  filePath: string
): Promise<PDFExtractionResult> {
  try {
    const fs = await import('fs/promises')
    const buffer = await fs.readFile(filePath)
    return extractTextFromPDF(buffer)
  } catch (error) {
    logger.error('Failed to read PDF file', { error, filePath })
    throw new Error('Failed to read PDF file')
  }
}

/**
 * Check if buffer is a valid PDF
 */
export function isPDF(buffer: Buffer): boolean {
  // PDF files start with %PDF-
  return buffer.slice(0, 5).toString() === '%PDF-'
}

/**
 * Estimate page count without full parsing (faster)
 */
export async function estimatePDFPages(buffer: Buffer): Promise<number> {
  try {
    const text = buffer.toString('latin1')
    const matches = text.match(/\/Type\s*\/Page[^s]/g)
    return matches ? matches.length : 0
  } catch (error) {
    logger.warn('Failed to estimate PDF pages', { error })
    return 0
  }
}
