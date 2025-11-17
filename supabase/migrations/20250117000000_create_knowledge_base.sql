-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table - stores uploaded files and their metadata
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Document metadata
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  file_type TEXT NOT NULL, -- pdf, txt, docx, md, url
  mime_type TEXT,

  -- Content
  raw_content TEXT, -- Original extracted text

  -- Categorization
  category TEXT, -- faq, documentation, policies, products
  tags TEXT[], -- Array of tags for filtering

  -- Processing status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  error_message TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  indexed_at TIMESTAMPTZ,

  -- Indexes
  CONSTRAINT documents_status_check CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  CONSTRAINT documents_file_type_check CHECK (file_type IN ('pdf', 'txt', 'docx', 'md', 'url'))
);

-- Document chunks table - stores document fragments with embeddings
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,

  -- Chunk content
  content TEXT NOT NULL,
  chunk_index INTEGER NOT NULL, -- Position in document

  -- Embedding vector (1536 dimensions for text-embedding-3-small)
  embedding vector(1536),

  -- Metadata
  token_count INTEGER,
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Unique constraint to prevent duplicate chunks
  CONSTRAINT document_chunks_unique UNIQUE (document_id, chunk_index)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_org_id ON documents(org_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_chunk_index ON document_chunks(chunk_index);

-- HNSW index for fast vector similarity search
-- Using cosine distance as it works well for embeddings
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding ON document_chunks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER documents_updated_at_trigger
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_documents_updated_at();

-- Row Level Security (RLS) for multi-tenancy
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access documents from their organization
CREATE POLICY documents_org_isolation ON documents
  FOR ALL
  USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can only access chunks from documents in their organization
CREATE POLICY document_chunks_org_isolation ON document_chunks
  FOR ALL
  USING (
    document_id IN (
      SELECT id FROM documents
      WHERE org_id IN (
        SELECT org_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- Function for vector similarity search
-- Returns most similar chunks to a query embedding
CREATE OR REPLACE FUNCTION search_documents(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5,
  filter_org_id UUID DEFAULT NULL,
  filter_category TEXT DEFAULT NULL,
  filter_tags TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  chunk_id UUID,
  document_id UUID,
  document_title TEXT,
  content TEXT,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id AS chunk_id,
    dc.document_id,
    d.title AS document_title,
    dc.content,
    1 - (dc.embedding <=> query_embedding) AS similarity,
    dc.metadata
  FROM document_chunks dc
  JOIN documents d ON d.id = dc.document_id
  WHERE
    -- Only completed documents
    d.status = 'completed'
    -- Similarity threshold
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
    -- Optional filters
    AND (filter_org_id IS NULL OR d.org_id = filter_org_id)
    AND (filter_category IS NULL OR d.category = filter_category)
    AND (filter_tags IS NULL OR d.tags && filter_tags)
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function to get document statistics
CREATE OR REPLACE FUNCTION get_document_stats(p_org_id UUID)
RETURNS TABLE (
  total_documents BIGINT,
  completed_documents BIGINT,
  processing_documents BIGINT,
  failed_documents BIGINT,
  total_chunks BIGINT,
  total_size BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT d.id) AS total_documents,
    COUNT(DISTINCT d.id) FILTER (WHERE d.status = 'completed') AS completed_documents,
    COUNT(DISTINCT d.id) FILTER (WHERE d.status = 'processing') AS processing_documents,
    COUNT(DISTINCT d.id) FILTER (WHERE d.status = 'failed') AS failed_documents,
    COUNT(dc.id) AS total_chunks,
    COALESCE(SUM(d.file_size), 0) AS total_size
  FROM documents d
  LEFT JOIN document_chunks dc ON dc.document_id = d.id
  WHERE d.org_id = p_org_id;
END;
$$;

-- Comments for documentation
COMMENT ON TABLE documents IS 'Stores uploaded documents and their metadata for the knowledge base';
COMMENT ON TABLE document_chunks IS 'Stores document fragments with vector embeddings for semantic search';
COMMENT ON COLUMN document_chunks.embedding IS 'Vector embedding (1536 dimensions) generated by OpenAI text-embedding-3-small';
COMMENT ON FUNCTION search_documents IS 'Performs vector similarity search to find relevant document chunks';
COMMENT ON INDEX idx_document_chunks_embedding IS 'HNSW index for fast approximate nearest neighbor search';
