# Knowledge Base System

Vector-based document storage and semantic search using OpenAI embeddings and Supabase pgvector.

## Overview

The knowledge base system allows you to:
- Upload documents (PDF, TXT, DOCX, MD, URLs)
- Automatically chunk and vectorize content
- Perform semantic search using vector similarity
- Integrate with AI agents for RAG (Retrieval Augmented Generation)

## Architecture

```
Document Upload
      ↓
Text Extraction
      ↓
Chunking (1000 chars with overlap)
      ↓
Embedding Generation (OpenAI)
      ↓
Vector Storage (Supabase pgvector)
      ↓
Semantic Search (cosine similarity)
```

## Database Schema

### documents table
Stores uploaded files and metadata:
- `id` - UUID primary key
- `org_id` - Organization reference
- `title`, `description` - Metadata
- `file_name`, `file_type`, `mime_type` - File info
- `raw_content` - Extracted text
- `category`, `tags` - Organization
- `status` - pending | processing | completed | failed
- `created_at`, `updated_at`, `indexed_at` - Timestamps

### document_chunks table
Stores document fragments with embeddings:
- `id` - UUID primary key
- `document_id` - Document reference
- `content` - Text chunk
- `chunk_index` - Position in document
- `embedding` - Vector(1536) - OpenAI embedding
- `token_count`, `metadata` - Additional info

## Usage

### Creating a Document

```typescript
import { createDocument } from '@/lib/repositories/document-storage'

const document = await createDocument({
  org_id: 'org_123',
  title: 'Product FAQ',
  file_name: 'faq.pdf',
  file_type: 'pdf',
  raw_content: extractedText,
  category: 'faq',
  tags: ['product', 'support'],
})
```

### Chunking and Indexing

```typescript
import { chunkTextSmart } from '@/lib/chunking'
import { createChunks } from '@/lib/repositories/document-storage'

// Chunk the text
const chunks = chunkTextSmart(document.raw_content, {
  chunk_size: 1000,
  chunk_overlap: 200,
})

// Generate embeddings and store
await createChunks(
  document.id,
  chunks.map((chunk) => ({
    content: chunk.content,
    chunk_index: chunk.index,
  }))
)
```

### Semantic Search

```typescript
import { searchDocuments } from '@/lib/repositories/document-storage'

const results = await searchDocuments({
  query: 'How do I reset my password?',
  org_id: 'org_123',
  match_threshold: 0.7, // Minimum similarity (0-1)
  match_count: 5, // Top 5 results
  category: 'faq', // Optional filter
  tags: ['support'], // Optional filter
})

// Results contain:
// - chunk_id, document_id, document_title
// - content - The relevant text chunk
// - similarity - Score (0-1)
```

### Integration with AI Agents

```typescript
// In your AI agent prompt:
const searchResults = await searchDocuments({
  query: userQuestion,
  org_id: session.orgId,
  match_count: 3,
})

const context = searchResults
  .map((r) => `[${r.document_title}]\n${r.content}`)
  .join('\n\n---\n\n')

const prompt = `
Context from knowledge base:
${context}

User question: ${userQuestion}

Answer the question using the context above.
If the answer is not in the context, say so.
`
```

## Chunking Strategies

### Standard Chunking
```typescript
import { chunkText } from '@/lib/chunking'

const chunks = chunkText(text, {
  chunk_size: 1000,
  chunk_overlap: 200,
  separators: ['\n\n', '\n', '. ', ' '],
})
```

### Semantic Chunking
Respects paragraph boundaries:
```typescript
import { chunkTextSemantic } from '@/lib/chunking'

const chunks = chunkTextSemantic(text, {
  chunk_size: 1000,
})
```

### Markdown Chunking
Preserves headings with their content:
```typescript
import { chunkMarkdown } from '@/lib/chunking'

const chunks = chunkMarkdown(markdownText, {
  chunk_size: 1000,
})
```

### Smart Chunking (Recommended)
Auto-detects format and uses best strategy:
```typescript
import { chunkTextSmart } from '@/lib/chunking'

const chunks = chunkTextSmart(text, {
  chunk_size: 1000,
  chunk_overlap: 200,
})
```

## Embeddings

### Generate Embedding
```typescript
import { generateEmbedding } from '@/lib/embeddings'

const embedding = await generateEmbedding('Your text here')
// Returns: number[] (1536 dimensions)
```

### Batch Generation
```typescript
import { generateEmbeddings } from '@/lib/embeddings'

const embeddings = await generateEmbeddings([
  'Text 1',
  'Text 2',
  'Text 3',
])
// Automatically batches requests
```

### Cost Estimation
```typescript
import { estimateTokenCount, calculateEmbeddingCost } from '@/lib/embeddings'

const tokens = estimateTokenCount(text)
const cost = calculateEmbeddingCost(tokens, 'text-embedding-3-small')

console.log(`Estimated cost: $${cost.toFixed(6)}`)
```

## Vector Search

The system uses pgvector's HNSW index for fast approximate nearest neighbor search with cosine distance.

### Similarity Threshold

- **0.9+** - Very similar (paraphrases, near duplicates)
- **0.8-0.9** - Similar (related content)
- **0.7-0.8** - Somewhat related
- **<0.7** - Probably not relevant

### Performance

- Index type: HNSW (Hierarchical Navigable Small World)
- Distance metric: Cosine
- Typical search time: <100ms for 100K+ vectors

## File Processing

### PDF
```typescript
// Uses pdf-parse library
import { extractTextFromPDF } from '@/lib/file-processing/pdf'

const text = await extractTextFromPDF(pdfBuffer)
```

### DOCX
```typescript
// Uses mammoth library
import { extractTextFromDOCX } from '@/lib/file-processing/docx'

const text = await extractTextFromDOCX(docxBuffer)
```

### Markdown
```typescript
// Direct text, may strip some formatting
import { extractTextFromMarkdown } from '@/lib/file-processing/markdown'

const text = extractTextFromMarkdown(markdownContent)
```

### URL
```typescript
// Fetches and extracts text
import { extractTextFromURL } from '@/lib/file-processing/url'

const text = await extractTextFromURL('https://example.com/page')
```

## Best Practices

### Chunking
- **Size**: 500-1500 characters per chunk
- **Overlap**: 10-20% of chunk size
- **Format**: Use semantic/markdown chunking for structured content

### Embeddings
- **Model**: `text-embedding-3-small` (best cost/performance)
- **Batch**: Process multiple chunks together
- **Cache**: Don't re-embed unchanged content

### Search
- **Threshold**: Start with 0.7, adjust based on results
- **Count**: 3-5 results usually sufficient
- **Filters**: Use category/tags to narrow scope

### Performance
- **Index**: HNSW index is created automatically
- **Batching**: Process documents in batches of 100 chunks
- **Monitoring**: Track embedding costs and search latency

## API Reference

### Document Operations
- `createDocument(input)` - Create document
- `getDocument(id)` - Get by ID
- `getDocuments(orgId, options)` - List documents
- `updateDocument(id, updates)` - Update metadata
- `deleteDocument(id)` - Delete (cascades to chunks)
- `getDocumentStats(orgId)` - Get statistics

### Chunk Operations
- `createChunks(documentId, chunks)` - Create with embeddings
- `getChunks(documentId)` - Get all chunks
- `deleteChunks(documentId)` - Delete all chunks
- `reindexDocument(documentId, chunks)` - Re-chunk and re-embed

### Search
- `searchDocuments(params)` - Semantic search

### Utilities
- `chunkText(text, options)` - Standard chunking
- `chunkTextSemantic(text, options)` - Semantic chunking
- `chunkMarkdown(text, options)` - Markdown chunking
- `chunkTextSmart(text, options)` - Auto-detect strategy
- `generateEmbedding(text)` - Single embedding
- `generateEmbeddings(texts)` - Batch embeddings

## Costs

### Embeddings
- **text-embedding-3-small**: $0.00002 / 1K tokens
- **1000 documents** (~10 pages each): ~$0.10

### Storage
- **Supabase**: Free tier includes 500MB
- **Vectors**: ~6KB per chunk

### Search
- **Queries**: Embedding generation only (~$0.00002 per query)

## Migration

```sql
-- Run migration
supabase db push

-- Or apply manually
psql < supabase/migrations/20250117000000_create_knowledge_base.sql
```

## Testing

```bash
# Run unit tests
npm test lib/chunking
npm test lib/embeddings
npm test lib/repositories/document-storage

# Integration tests
npm test -- --grep "knowledge base"
```

## Monitoring

```typescript
import { getDocumentStats } from '@/lib/repositories/document-storage'

const stats = await getDocumentStats(orgId)
// {
//   total_documents: 100,
//   completed_documents: 95,
//   processing_documents: 3,
//   failed_documents: 2,
//   total_chunks: 1850,
//   total_size: 52428800 // bytes
// }
```

## Troubleshooting

### Document not indexing
- Check `status` field for errors
- View `error_message` for details
- Ensure OpenAI API key is valid
- Check file is not corrupted

### Poor search results
- Lower `match_threshold` (try 0.6)
- Increase `match_count` (try 10)
- Improve document chunking
- Add more relevant documents

### Slow search
- Ensure HNSW index exists
- Check Supabase performance tier
- Reduce `match_count`
- Use category/tag filters

## Roadmap

- [ ] Multi-language support
- [ ] Image OCR for PDFs
- [ ] Excel/CSV support
- [ ] Document versioning
- [ ] Hybrid search (vector + full-text)
- [ ] Custom embedding models
- [ ] Document summarization
- [ ] Auto-categorization
