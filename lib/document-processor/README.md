# Document Processing Pipeline

Orchestrates document upload, text extraction, chunking, and indexing.

## Installation

Install required dependencies for file processing:

```bash
npm install pdf-parse mammoth
# or
yarn add pdf-parse mammoth
```

## Supported File Types

- **PDF** (.pdf) - Uses pdf-parse
- **DOCX** (.docx) - Uses mammoth
- **Markdown** (.md) - Native parsing
- **Text** (.txt) - UTF-8 encoding
- **URL** (https://) - Web scraping

## Usage

### Processing a File

```typescript
import { processDocument } from '@/lib/document-processor'

const file = await fs.readFile('document.pdf')

const document = await processDocument(
  file,
  {
    org_id: 'org_123',
    file_name: 'document.pdf',
    file_type: 'pdf',
    title: 'Important Document',
    category: 'documentation',
    tags: ['important', 'project-x'],
  },
  {
    chunkSize: 1000,
    chunkOverlap: 200,
  }
)

console.log('Document indexed:', document.id)
```

### Processing a URL

```typescript
import { processURL } from '@/lib/document-processor'

const document = await processURL(
  'https://example.com/article',
  {
    org_id: 'org_123',
    category: 'articles',
    tags: ['external'],
  }
)
```

### Batch Processing

```typescript
import { processDocumentsBatch } from '@/lib/document-processor'

const results = await processDocumentsBatch([
  {
    file: buffer1,
    metadata: { org_id: 'org_123', file_name: 'doc1.pdf', file_type: 'pdf' },
  },
  {
    file: buffer2,
    metadata: { org_id: 'org_123', file_name: 'doc2.docx', file_type: 'docx' },
  },
])

console.log(`Successful: ${results.successful.length}`)
console.log(`Failed: ${results.failed.length}`)
```

### Reprocessing

Useful when you change chunking strategy:

```typescript
import { reprocessDocument } from '@/lib/document-processor'

await reprocessDocument(documentId, {
  chunkSize: 1500,
  chunkOverlap: 300,
})
```

## Processing Flow

```
Upload File/URL
      ↓
Create Document Record (status: processing)
      ↓
Extract Text (based on file type)
      ↓
Clean Text (remove control chars, normalize whitespace)
      ↓
Chunk Text (smart strategy - auto-detects format)
      ↓
Generate Embeddings (OpenAI text-embedding-3-small)
      ↓
Store Chunks (with vectors)
      ↓
Update Document (status: completed, indexed_at: now)
```

## Error Handling

If processing fails, the document status is set to 'failed' with error message:

```typescript
const document = await getDocument(documentId)

if (document.status === 'failed') {
  console.error('Processing failed:', document.error_message)

  // Retry processing
  await reprocessDocument(documentId)
}
```

## Configuration

### Chunking Options

```typescript
{
  chunkSize: 1000,        // Characters per chunk
  chunkOverlap: 200,      // Overlap between chunks
  skipEmbedding: false,   // Set true for testing without OpenAI
}
```

### Optimal Settings

| Document Type | Chunk Size | Overlap | Strategy |
|---------------|------------|---------|----------|
| FAQ/Q&A | 500 | 100 | Semantic |
| Documentation | 1000 | 200 | Markdown |
| Articles | 1500 | 300 | Semantic |
| Books | 2000 | 400 | Smart |

## API Endpoints

Create API endpoints for file upload:

```typescript
// app/api/documents/upload/route.ts
import { processDocument } from '@/lib/document-processor'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  const buffer = Buffer.from(await file.arrayBuffer())

  const document = await processDocument(
    buffer,
    {
      org_id: session.orgId,
      file_name: file.name,
      file_type: getFileType(file.type),
      title: formData.get('title') as string,
    }
  )

  return Response.json({ document })
}
```

## Monitoring

Track processing statistics:

```typescript
import { getProcessingStats } from '@/lib/document-processor'

const stats = await getProcessingStats(orgId)

console.log(`Total: ${stats.total_documents}`)
console.log(`Completed: ${stats.completed_documents}`)
console.log(`Processing: ${stats.processing_documents}`)
console.log(`Failed: ${stats.failed_documents}`)
```

## Performance

### Processing Times (approximate)

| File Type | Size | Processing Time |
|-----------|------|----------------|
| PDF (10 pages) | 500KB | 3-5s |
| DOCX (20 pages) | 100KB | 2-3s |
| Markdown | 50KB | 1-2s |
| URL | - | 2-10s (depends on site) |

### Optimization Tips

1. **Batch Processing**: Process multiple files together
2. **Skip Embedding**: Use `skipEmbedding: true` for testing
3. **Smaller Chunks**: Reduce chunk size for faster processing
4. **Queue Jobs**: Use BullMQ for background processing

## Costs

### Embedding Generation

```
text-embedding-3-small: $0.00002 / 1K tokens

Document (10 pages, ~5000 words):
- Tokens: ~6500
- Chunks: ~7 (1000 chars each)
- Cost: ~$0.00013

1000 documents: ~$0.13
```

### Storage

```
Supabase:
- Text storage: ~1KB per chunk
- Vector storage: ~6KB per chunk (1536 dimensions)

1000 documents * 7 chunks = 7000 chunks:
- Text: ~7MB
- Vectors: ~42MB
- Total: ~49MB (well within free tier)
```

## Troubleshooting

### PDF extraction fails

```
Error: Failed to extract text from PDF
```

**Solution**:
- Check PDF is not password-protected
- Ensure PDF contains text (not just images - use OCR)
- Verify pdf-parse is installed: `npm install pdf-parse`

### DOCX extraction fails

```
Error: Failed to extract text from DOCX
```

**Solution**:
- Check file is valid .docx (not .doc)
- Ensure mammoth is installed: `npm install mammoth`
- Try opening file in Word to verify it's not corrupted

### URL extraction fails

```
Error: Failed to extract text from URL
```

**Solution**:
- Check URL is accessible (try in browser)
- Verify HTTPS certificate is valid
- Some sites block scrapers - use robots.txt compliant scraping
- Add user-agent header if needed

### Embeddings take too long

```
Processing time: 30s+
```

**Solution**:
- Reduce chunk size (fewer chunks = faster)
- Process in batches (automatic in `createChunks`)
- Check OpenAI API latency
- Consider caching embeddings for unchanged content

## Dependencies

```json
{
  "dependencies": {
    "pdf-parse": "^1.1.1",
    "mammoth": "^1.8.0",
    "openai": "^4.x.x"
  }
}
```

## Testing

```bash
# Test PDF extraction
npm test lib/file-processing/pdf

# Test DOCX extraction
npm test lib/file-processing/docx

# Test pipeline
npm test lib/document-processor
```

## Example: Complete Workflow

```typescript
import { processDocument, searchDocuments } from '@/lib/document-processor'

// 1. Upload and process document
const doc = await processDocument(
  pdfBuffer,
  {
    org_id: 'org_123',
    file_name: 'product-manual.pdf',
    file_type: 'pdf',
    category: 'documentation',
    tags: ['product', 'manual'],
  }
)

// 2. Wait for processing (or use webhooks)
while (doc.status === 'processing') {
  await sleep(1000)
  doc = await getDocument(doc.id)
}

// 3. Search for information
const results = await searchDocuments({
  query: 'How to reset password?',
  org_id: 'org_123',
  category: 'documentation',
  match_threshold: 0.7,
  match_count: 3,
})

// 4. Use results in AI agent
const context = results.map(r => r.content).join('\n\n')
const answer = await generateAnswer(userQuestion, context)
```

## Security

- File size limits: 50MB (configurable)
- Validate file types before processing
- Sanitize extracted text
- Rate limit uploads
- Scan for malware (recommended)

## Next Steps

- Add OCR for image-based PDFs
- Support Excel/CSV files
- Implement document versioning
- Add webhook notifications
- Queue processing jobs
