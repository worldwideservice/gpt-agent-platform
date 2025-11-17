/**
 * Document Processing Pipeline
 * Orchestrates document upload, text extraction, chunking, and indexing
 */

import { logger } from '@/lib/logger'
import { extractTextFromPDF } from '@/lib/file-processing/pdf'
import { extractTextFromDOCX } from '@/lib/file-processing/docx'
import { extractTextFromBuffer, extractTextFromMarkdown, cleanText } from '@/lib/file-processing/text'
import { extractTextFromURL } from '@/lib/file-processing/url'
import { chunkTextSmart } from '@/lib/chunking'
import {
  createDocument,
  updateDocument,
  createChunks,
} from '@/lib/repositories/document-storage'
import type {
  Document,
  DocumentFileType,
  CreateDocumentInput,
} from '@/lib/types/knowledge-base'

export interface ProcessDocumentOptions {
  chunkSize?: number
  chunkOverlap?: number
  skipEmbedding?: boolean // For testing
}

/**
 * Process uploaded file and index it
 */
export async function processDocument(
  file: Buffer,
  metadata: {
    org_id: string
    file_name: string
    file_type: DocumentFileType
    title?: string
    description?: string
    category?: string
    tags?: string[]
  },
  options: ProcessDocumentOptions = {}
): Promise<Document> {
  const { org_id, file_name, file_type, title, description, category, tags } = metadata
  const { chunkSize = 1000, chunkOverlap = 200, skipEmbedding = false } = options

  try {
    logger.info('Processing document', {
      orgId: org_id,
      fileName: file_name,
      fileType: file_type,
      fileSize: file.length,
    })

    // Create document record
    const document = await createDocument({
      org_id,
      file_name,
      file_type,
      title: title || file_name,
      description,
      category,
      tags,
      file_size: file.length,
      status: 'processing',
    } as CreateDocumentInput)

    try {
      // Extract text based on file type
      const extractedText = await extractText(file, file_type)

      // Clean text
      const cleanedText = cleanText(extractedText)

      // Update document with extracted content
      await updateDocument(document.id, {
        raw_content: cleanedText,
      })

      // Chunk the text
      const textChunks = chunkTextSmart(cleanedText, {
        chunk_size: chunkSize,
        chunk_overlap: chunkOverlap,
      })

      logger.info('Text chunked', {
        documentId: document.id,
        chunksCount: textChunks.length,
      })

      // Generate embeddings and store chunks
      if (!skipEmbedding) {
        await createChunks(
          document.id,
          textChunks.map((chunk) => ({
            content: chunk.content,
            chunk_index: chunk.index,
            metadata: {
              start: chunk.start,
              end: chunk.end,
            },
          }))
        )
      }

      // Mark as completed
      await updateDocument(document.id, {
        status: 'completed',
        indexed_at: new Date().toISOString(),
      })

      logger.info('Document processed successfully', {
        documentId: document.id,
        chunksCount: textChunks.length,
      })

      return document
    } catch (error) {
      // Mark as failed
      await updateDocument(document.id, {
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })

      throw error
    }
  } catch (error) {
    logger.error('Document processing failed', {
      error,
      fileName: file_name,
      fileType: file_type,
    })
    throw error
  }
}

/**
 * Process URL and index it
 */
export async function processURL(
  url: string,
  metadata: {
    org_id: string
    title?: string
    description?: string
    category?: string
    tags?: string[]
  },
  options: ProcessDocumentOptions = {}
): Promise<Document> {
  const { org_id, title, description, category, tags } = metadata
  const { chunkSize = 1000, chunkOverlap = 200, skipEmbedding = false } = options

  try {
    logger.info('Processing URL', { url, orgId: org_id })

    // Create document record
    const document = await createDocument({
      org_id,
      file_name: url,
      file_type: 'url',
      title: title || url,
      description,
      category,
      tags,
      status: 'processing',
    } as CreateDocumentInput)

    try {
      // Extract text from URL
      const result = await extractTextFromURL(url)

      // Update document with extracted content and metadata
      await updateDocument(document.id, {
        raw_content: result.text,
        title: title || result.title || url,
        description: description || result.description,
        metadata: {
          url: result.url,
          statusCode: result.statusCode,
        },
      })

      // Chunk the text
      const textChunks = chunkTextSmart(result.text, {
        chunk_size: chunkSize,
        chunk_overlap: chunkOverlap,
      })

      // Generate embeddings and store chunks
      if (!skipEmbedding) {
        await createChunks(
          document.id,
          textChunks.map((chunk) => ({
            content: chunk.content,
            chunk_index: chunk.index,
          }))
        )
      }

      // Mark as completed
      await updateDocument(document.id, {
        status: 'completed',
        indexed_at: new Date().toISOString(),
      })

      logger.info('URL processed successfully', {
        documentId: document.id,
        url,
        chunksCount: textChunks.length,
      })

      return document
    } catch (error) {
      // Mark as failed
      await updateDocument(document.id, {
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })

      throw error
    }
  } catch (error) {
    logger.error('URL processing failed', { error, url })
    throw error
  }
}

/**
 * Extract text from file buffer based on type
 */
async function extractText(
  buffer: Buffer,
  fileType: DocumentFileType
): Promise<string> {
  logger.debug('Extracting text', { fileType, size: buffer.length })

  switch (fileType) {
    case 'pdf': {
      const result = await extractTextFromPDF(buffer)
      return result.text
    }

    case 'docx': {
      const result = await extractTextFromDOCX(buffer)
      return result.text
    }

    case 'md': {
      const text = buffer.toString('utf-8')
      return extractTextFromMarkdown(text)
    }

    case 'txt': {
      const result = extractTextFromBuffer(buffer)
      return result.text
    }

    default:
      throw new Error(`Unsupported file type: ${fileType}`)
  }
}

/**
 * Process multiple documents in batch
 */
export async function processDocumentsBatch(
  documents: Array<{
    file: Buffer
    metadata: {
      org_id: string
      file_name: string
      file_type: DocumentFileType
      title?: string
      description?: string
      category?: string
      tags?: string[]
    }
  }>,
  options: ProcessDocumentOptions = {}
): Promise<{ successful: Document[]; failed: Array<{ fileName: string; error: string }> }> {
  logger.info('Processing documents batch', { count: documents.length })

  const successful: Document[] = []
  const failed: Array<{ fileName: string; error: string }> = []

  for (const doc of documents) {
    try {
      const result = await processDocument(doc.file, doc.metadata, options)
      successful.push(result)
    } catch (error) {
      failed.push({
        fileName: doc.metadata.file_name,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  logger.info('Batch processing complete', {
    total: documents.length,
    successful: successful.length,
    failed: failed.length,
  })

  return { successful, failed }
}

/**
 * Reprocess existing document (useful after changing chunking strategy)
 */
export async function reprocessDocument(
  documentId: string,
  options: ProcessDocumentOptions = {}
): Promise<void> {
  const { chunkSize = 1000, chunkOverlap = 200, skipEmbedding = false } = options

  try {
    logger.info('Reprocessing document', { documentId })

    const { getDocument, deleteChunks } = await import('@/lib/repositories/document-storage')

    // Get document
    const document = await getDocument(documentId)
    if (!document) {
      throw new Error('Document not found')
    }

    if (!document.raw_content) {
      throw new Error('Document has no content to reprocess')
    }

    // Update status
    await updateDocument(documentId, { status: 'processing' })

    try {
      // Delete old chunks
      await deleteChunks(documentId)

      // Re-chunk
      const textChunks = chunkTextSmart(document.raw_content, {
        chunk_size: chunkSize,
        chunk_overlap: chunkOverlap,
      })

      // Create new chunks with embeddings
      if (!skipEmbedding) {
        await createChunks(
          documentId,
          textChunks.map((chunk) => ({
            content: chunk.content,
            chunk_index: chunk.index,
          }))
        )
      }

      // Mark as completed
      await updateDocument(documentId, {
        status: 'completed',
        indexed_at: new Date().toISOString(),
      })

      logger.info('Document reprocessed successfully', { documentId })
    } catch (error) {
      // Mark as failed
      await updateDocument(documentId, {
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })

      throw error
    }
  } catch (error) {
    logger.error('Document reprocessing failed', { error, documentId })
    throw error
  }
}

/**
 * Get processing statistics
 */
export async function getProcessingStats(orgId: string) {
  const { getDocumentStats } = await import('@/lib/repositories/document-storage')
  return getDocumentStats(orgId)
}
