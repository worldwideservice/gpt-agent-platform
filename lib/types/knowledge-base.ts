/**
 * Knowledge Base Types
 * Types for document storage and vector search
 */

export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type DocumentFileType = 'pdf' | 'txt' | 'docx' | 'md' | 'url'
export type DocumentCategory = 'faq' | 'documentation' | 'policies' | 'products' | 'other'

export interface Document {
  id: string
  org_id: string

  // Metadata
  title: string
  description?: string
  file_name: string
  file_path?: string
  file_size?: number
  file_type: DocumentFileType
  mime_type?: string

  // Content
  raw_content?: string

  // Categorization
  category?: DocumentCategory
  tags?: string[]

  // Processing
  status: DocumentStatus
  error_message?: string

  // Metadata
  metadata?: Record<string, any>

  // Timestamps
  created_at: string
  updated_at: string
  indexed_at?: string
}

export interface DocumentChunk {
  id: string
  document_id: string

  // Content
  content: string
  chunk_index: number

  // Embedding
  embedding?: number[]

  // Metadata
  token_count?: number
  metadata?: Record<string, any>

  // Timestamps
  created_at: string
}

export interface DocumentWithChunks extends Document {
  chunks: DocumentChunk[]
}

export interface SearchResult {
  chunk_id: string
  document_id: string
  document_title: string
  content: string
  similarity: number
  metadata?: Record<string, any>
}

export interface SearchParams {
  query: string
  org_id: string
  match_threshold?: number // 0-1, default 0.7
  match_count?: number // default 5
  category?: DocumentCategory
  tags?: string[]
}

export interface DocumentStats {
  total_documents: number
  completed_documents: number
  processing_documents: number
  failed_documents: number
  total_chunks: number
  total_size: number
}

export interface CreateDocumentInput {
  org_id: string
  title: string
  description?: string
  file_name: string
  file_type: DocumentFileType
  mime_type?: string
  raw_content?: string
  category?: DocumentCategory
  tags?: string[]
  metadata?: Record<string, any>
}

export interface UpdateDocumentInput {
  title?: string
  description?: string
  category?: DocumentCategory
  tags?: string[]
  status?: DocumentStatus
  error_message?: string
  indexed_at?: string
  metadata?: Record<string, any>
}

export interface ChunkingOptions {
  chunk_size: number // Characters per chunk
  chunk_overlap: number // Overlap between chunks
  separators?: string[] // Custom separators
}

export interface EmbeddingOptions {
  model: 'text-embedding-3-small' | 'text-embedding-3-large' | 'text-embedding-ada-002'
  dimensions?: number // For text-embedding-3-* models
}
