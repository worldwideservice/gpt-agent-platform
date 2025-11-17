/**
 * Document Storage Repository
 * Database operations for document files and vector search
 */

import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { generateEmbedding } from '@/lib/embeddings'
import type {
  Document,
  DocumentChunk,
  DocumentWithChunks,
  SearchResult,
  SearchParams,
  DocumentStats,
  CreateDocumentInput,
  UpdateDocumentInput,
} from '@/lib/types/knowledge-base'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Create a new document
 */
export async function createDocument(
  input: CreateDocumentInput
): Promise<Document> {
  try {
    logger.info('Creating document', {
      orgId: input.org_id,
      title: input.title,
      fileType: input.file_type,
    })

    const { data, error } = await supabase
      .from('documents')
      .insert({
        org_id: input.org_id,
        title: input.title,
        description: input.description,
        file_name: input.file_name,
        file_type: input.file_type,
        mime_type: input.mime_type,
        raw_content: input.raw_content,
        category: input.category,
        tags: input.tags,
        metadata: input.metadata,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      logger.error('Failed to create document', { error })
      throw error
    }

    logger.info('Document created', { documentId: data.id })
    return data
  } catch (error) {
    logger.error('Error creating document', { error })
    throw error
  }
}

/**
 * Get document by ID
 */
export async function getDocument(id: string): Promise<Document | null> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select()
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }

    return data
  } catch (error) {
    logger.error('Error getting document', { error, id })
    throw error
  }
}

/**
 * Get all documents for an organization
 */
export async function getDocuments(
  orgId: string,
  options: {
    category?: string
    tags?: string[]
    status?: string
    limit?: number
    offset?: number
  } = {}
): Promise<Document[]> {
  try {
    let query = supabase
      .from('documents')
      .select()
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })

    if (options.category) {
      query = query.eq('category', options.category)
    }

    if (options.tags && options.tags.length > 0) {
      query = query.contains('tags', options.tags)
    }

    if (options.status) {
      query = query.eq('status', options.status)
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error

    return data || []
  } catch (error) {
    logger.error('Error getting documents', { error, orgId })
    throw error
  }
}

/**
 * Update document
 */
export async function updateDocument(
  id: string,
  updates: UpdateDocumentInput
): Promise<Document> {
  try {
    logger.info('Updating document', { documentId: id, updates })

    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    logger.info('Document updated', { documentId: id })
    return data
  } catch (error) {
    logger.error('Error updating document', { error, id })
    throw error
  }
}

/**
 * Delete document (and all its chunks via CASCADE)
 */
export async function deleteDocument(id: string): Promise<void> {
  try {
    logger.info('Deleting document', { documentId: id })

    const { error } = await supabase.from('documents').delete().eq('id', id)

    if (error) throw error

    logger.info('Document deleted', { documentId: id })
  } catch (error) {
    logger.error('Error deleting document', { error, id })
    throw error
  }
}

/**
 * Create document chunks with embeddings
 */
export async function createChunks(
  documentId: string,
  chunks: Array<{ content: string; chunk_index: number; metadata?: any }>
): Promise<DocumentChunk[]> {
  try {
    logger.info('Creating chunks with embeddings', {
      documentId,
      count: chunks.length,
    })

    // Generate embeddings for all chunks
    const contents = chunks.map((c) => c.content)
    const { generateEmbeddings } = await import('@/lib/embeddings')
    const embeddings = await generateEmbeddings(contents)

    // Prepare chunks data with embeddings
    const chunksData = chunks.map((chunk, index) => ({
      document_id: documentId,
      content: chunk.content,
      chunk_index: chunk.chunk_index,
      embedding: embeddings[index],
      token_count: Math.ceil(chunk.content.length / 4), // Approximate
      metadata: chunk.metadata,
    }))

    // Insert chunks in batches (Supabase limit)
    const BATCH_SIZE = 100
    const insertedChunks: DocumentChunk[] = []

    for (let i = 0; i < chunksData.length; i += BATCH_SIZE) {
      const batch = chunksData.slice(i, i + BATCH_SIZE)

      const { data, error } = await supabase
        .from('document_chunks')
        .insert(batch)
        .select()

      if (error) throw error

      insertedChunks.push(...(data || []))
    }

    logger.info('Chunks created', {
      documentId,
      count: insertedChunks.length,
    })

    return insertedChunks
  } catch (error) {
    logger.error('Error creating chunks', { error, documentId })
    throw error
  }
}

/**
 * Get chunks for a document
 */
export async function getChunks(documentId: string): Promise<DocumentChunk[]> {
  try {
    const { data, error } = await supabase
      .from('document_chunks')
      .select()
      .eq('document_id', documentId)
      .order('chunk_index')

    if (error) throw error

    return data || []
  } catch (error) {
    logger.error('Error getting chunks', { error, documentId })
    throw error
  }
}

/**
 * Delete all chunks for a document
 */
export async function deleteChunks(documentId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('document_chunks')
      .delete()
      .eq('document_id', documentId)

    if (error) throw error
  } catch (error) {
    logger.error('Error deleting chunks', { error, documentId })
    throw error
  }
}

/**
 * Semantic search using vector similarity
 */
export async function searchDocuments(
  params: SearchParams
): Promise<SearchResult[]> {
  try {
    logger.info('Searching documents', {
      query: params.query,
      orgId: params.org_id,
    })

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(params.query)

    // Call the search function
    const { data, error } = await supabase.rpc('search_documents', {
      query_embedding: queryEmbedding,
      match_threshold: params.match_threshold || 0.7,
      match_count: params.match_count || 5,
      filter_org_id: params.org_id,
      filter_category: params.category,
      filter_tags: params.tags,
    })

    if (error) throw error

    logger.info('Search complete', {
      query: params.query,
      results: data?.length || 0,
    })

    return data || []
  } catch (error) {
    logger.error('Error searching documents', { error, params })
    throw error
  }
}

/**
 * Get document with all chunks
 */
export async function getDocumentWithChunks(
  id: string
): Promise<DocumentWithChunks | null> {
  try {
    const document = await getDocument(id)
    if (!document) return null

    const chunks = await getChunks(id)

    return {
      ...document,
      chunks,
    }
  } catch (error) {
    logger.error('Error getting document with chunks', { error, id })
    throw error
  }
}

/**
 * Get organization statistics
 */
export async function getDocumentStats(orgId: string): Promise<DocumentStats> {
  try {
    const { data, error } = await supabase.rpc('get_document_stats', {
      p_org_id: orgId,
    })

    if (error) throw error

    return data?.[0] || {
      total_documents: 0,
      completed_documents: 0,
      processing_documents: 0,
      failed_documents: 0,
      total_chunks: 0,
      total_size: 0,
    }
  } catch (error) {
    logger.error('Error getting document stats', { error, orgId })
    throw error
  }
}

/**
 * Reindex document - delete old chunks and create new ones
 */
export async function reindexDocument(
  documentId: string,
  chunks: Array<{ content: string; chunk_index: number; metadata?: any }>
): Promise<void> {
  try {
    logger.info('Reindexing document', { documentId })

    // Delete old chunks
    await deleteChunks(documentId)

    // Create new chunks with embeddings
    await createChunks(documentId, chunks)

    // Update document status
    await updateDocument(documentId, {
      status: 'completed',
      indexed_at: new Date().toISOString(),
    })

    logger.info('Document reindexed', { documentId })
  } catch (error) {
    logger.error('Error reindexing document', { error, documentId })

    // Update status to failed
    await updateDocument(documentId, {
      status: 'failed',
      error_message: error instanceof Error ? error.message : 'Unknown error',
    })

    throw error
  }
}
