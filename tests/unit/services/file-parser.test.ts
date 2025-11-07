import { describe, it, expect, vi, beforeEach } from 'vitest'

// Моки для pdf-parse и mammoth (используются динамически)
vi.mock('pdf-parse', () => ({
  default: vi.fn(),
}))

vi.mock('mammoth', () => ({
  default: {
    extractRawText: vi.fn(),
  },
}))

describe('File Parser Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('parseTXT', () => {
    it('should parse text file correctly', async () => {
      const { parseTXT } = await import('@/lib/services/file-parser')

      const buffer = Buffer.from('Hello World\nThis is a test file.', 'utf-8')
      const result = await parseTXT(buffer)

      expect(result.text).toBe('Hello World\nThis is a test file.')
      expect(result.metadata.wordCount).toBe(7)
      expect(result.metadata.characterCount).toBe(32)
    })

    it('should handle empty text file', async () => {
      const { parseTXT } = await import('@/lib/services/file-parser')

      const buffer = Buffer.from('', 'utf-8')
      const result = await parseTXT(buffer)

      expect(result.text).toBe('')
      expect(result.metadata.wordCount).toBe(0)
      expect(result.metadata.characterCount).toBe(0)
    })

    it('should handle text with special characters', async () => {
      const { parseTXT } = await import('@/lib/services/file-parser')

      const text = 'Привет! Hello 世界 🎉'
      const buffer = Buffer.from(text, 'utf-8')
      const result = await parseTXT(buffer)

      expect(result.text).toBe(text)
      expect(result.metadata.wordCount).toBeGreaterThan(0)
    })
  })

  describe('parseHTML', () => {
    it('should parse HTML file and extract text', async () => {
      const { parseHTML } = await import('@/lib/services/file-parser')

      const html = '<html><body><h1>Title</h1><p>Content here</p></body></html>'
      const buffer = Buffer.from(html, 'utf-8')
      const result = await parseHTML(buffer)

      expect(result.text).toBeDefined()
      expect(result.text.length).toBeGreaterThan(0)
      expect(result.metadata.wordCount).toBeGreaterThan(0)
    })

    it('should handle empty HTML', async () => {
      const { parseHTML } = await import('@/lib/services/file-parser')

      const buffer = Buffer.from('<html></html>', 'utf-8')
      const result = await parseHTML(buffer)

      expect(result.text).toBeDefined()
    })
  })

  describe('parseMarkdown', () => {
    it('should parse markdown file', async () => {
      const { parseMarkdown } = await import('@/lib/services/file-parser')

      const markdown = '# Title\n\nThis is **bold** text.'
      const buffer = Buffer.from(markdown, 'utf-8')
      const result = await parseMarkdown(buffer)

      // parseMarkdown преобразует markdown, удаляя форматирование
      expect(result.text).toContain('Title')
      expect(result.text).toContain('This is bold text')
      expect(result.metadata.wordCount).toBeGreaterThan(0)
    })

    it('should handle empty markdown', async () => {
      const { parseMarkdown } = await import('@/lib/services/file-parser')

      const buffer = Buffer.from('', 'utf-8')
      const result = await parseMarkdown(buffer)

      expect(result.text).toBe('')
      expect(result.metadata.wordCount).toBe(0)
    })
  })

  describe('detectFileType', () => {
    it('should detect PDF by mime type', async () => {
      const { detectFileType } = await import('@/lib/services/file-parser')

      expect(detectFileType('application/pdf', 'document.pdf')).toBe('pdf')
    })

    it('should detect DOCX by mime type', async () => {
      const { detectFileType } = await import('@/lib/services/file-parser')

      expect(detectFileType('application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'document.docx')).toBe('docx')
    })

    it('should detect TXT by mime type', async () => {
      const { detectFileType } = await import('@/lib/services/file-parser')

      expect(detectFileType('text/plain', 'document.txt')).toBe('txt')
    })

    it('should detect HTML by mime type', async () => {
      const { detectFileType } = await import('@/lib/services/file-parser')

      expect(detectFileType('text/html', 'document.html')).toBe('html')
    })

    it('should detect Markdown by file extension', async () => {
      const { detectFileType } = await import('@/lib/services/file-parser')

      expect(detectFileType('text/plain', 'document.md')).toBe('md')
      expect(detectFileType('text/markdown', 'document.md')).toBe('md')
    })

    it('should return unknown for unsupported types', async () => {
      const { detectFileType } = await import('@/lib/services/file-parser')

      expect(detectFileType('application/zip', 'archive.zip')).toBe('unknown')
      expect(detectFileType('image/png', 'image.png')).toBe('unknown')
    })

    it('should detect by file extension when mime type is generic', async () => {
      const { detectFileType } = await import('@/lib/services/file-parser')

      expect(detectFileType('application/octet-stream', 'document.pdf')).toBe('pdf')
      expect(detectFileType('application/octet-stream', 'document.docx')).toBe('docx')
    })
  })

  describe('parseFile', () => {
    it('should parse TXT file', async () => {
      const { parseFile } = await import('@/lib/services/file-parser')

      const buffer = Buffer.from('Plain text content', 'utf-8')
      const result = await parseFile(buffer, 'text/plain', 'test.txt')

      expect(result.text).toBe('Plain text content')
      expect(result.metadata.wordCount).toBe(3)
    })

    it('should parse HTML file', async () => {
      const { parseFile } = await import('@/lib/services/file-parser')

      const html = '<html><body><p>HTML content</p></body></html>'
      const buffer = Buffer.from(html, 'utf-8')
      const result = await parseFile(buffer, 'text/html', 'test.html')

      expect(result.text).toBeDefined()
      expect(result.metadata.wordCount).toBeGreaterThan(0)
    })

    it('should parse Markdown file', async () => {
      const { parseFile } = await import('@/lib/services/file-parser')

      const markdown = '# Title\nContent here'
      const buffer = Buffer.from(markdown, 'utf-8')
      const result = await parseFile(buffer, 'text/markdown', 'test.md')

      expect(result.text).toBeDefined()
      expect(result.metadata.wordCount).toBeGreaterThan(0)
    })

    it('should throw error for unknown file type', async () => {
      const { parseFile } = await import('@/lib/services/file-parser')

      const buffer = Buffer.from('content')
      
      await expect(parseFile(buffer, 'application/zip', 'archive.zip')).rejects.toThrow('Неподдерживаемый тип файла')
    })

  })

  describe('parsePDF', () => {
    it('should parse PDF file successfully', async () => {
      const pdfParseModule = await import('pdf-parse')
      vi.mocked(pdfParseModule.default).mockResolvedValue({
        text: 'PDF Content\nWith multiple lines',
        info: {
          Title: 'Test PDF',
          Author: 'Test Author',
        },
        numpages: 2,
      })

      const { parsePDF } = await import('@/lib/services/file-parser')

      const buffer = Buffer.from('fake pdf content')
      const result = await parsePDF(buffer)

      expect(result.text).toBe('PDF Content\nWith multiple lines')
      expect(result.metadata.title).toBe('Test PDF')
      expect(result.metadata.author).toBe('Test Author')
      expect(result.metadata.pageCount).toBe(2)
      expect(result.metadata.wordCount).toBeGreaterThan(0)
    })

    it('should handle PDF parsing errors', async () => {
      const pdfParseModule = await import('pdf-parse')
      vi.mocked(pdfParseModule.default).mockRejectedValue(new Error('PDF parsing failed'))

      const { parsePDF } = await import('@/lib/services/file-parser')

      const buffer = Buffer.from('invalid pdf')
      
      await expect(parsePDF(buffer)).rejects.toThrow('PDF parsing failed')
    })

    it('should throw helpful error if pdf-parse not installed', async () => {
      const pdfParseModule = await import('pdf-parse')
      vi.mocked(pdfParseModule.default).mockRejectedValue(new Error('Cannot find module \'pdf-parse\''))

      const { parsePDF } = await import('@/lib/services/file-parser')

      const buffer = Buffer.from('pdf content')
      
      await expect(parsePDF(buffer)).rejects.toThrow('PDF parsing requires pdf-parse package')
    })
  })

  describe('parseDOCX', () => {
    it('should parse DOCX file successfully', async () => {
      const mammothModule = await import('mammoth')
      vi.mocked(mammothModule.default.extractRawText).mockResolvedValue({
        value: 'DOCX Content\nWith multiple lines',
      })

      const { parseDOCX } = await import('@/lib/services/file-parser')

      const buffer = Buffer.from('fake docx content')
      const result = await parseDOCX(buffer)

      expect(result.text).toBe('DOCX Content\nWith multiple lines')
      expect(result.metadata.wordCount).toBeGreaterThan(0)
    })

    it('should handle DOCX parsing errors', async () => {
      const mammothModule = await import('mammoth')
      vi.mocked(mammothModule.default.extractRawText).mockRejectedValue(new Error('DOCX parsing failed'))

      const { parseDOCX } = await import('@/lib/services/file-parser')

      const buffer = Buffer.from('invalid docx')
      
      await expect(parseDOCX(buffer)).rejects.toThrow('DOCX parsing failed')
    })

    it('should throw helpful error if mammoth not installed', async () => {
      const mammothModule = await import('mammoth')
      vi.mocked(mammothModule.default.extractRawText).mockRejectedValue(new Error('Cannot find module \'mammoth\''))

      const { parseDOCX } = await import('@/lib/services/file-parser')

      const buffer = Buffer.from('docx content')
      
      await expect(parseDOCX(buffer)).rejects.toThrow('DOCX parsing requires mammoth package')
    })
  })

  describe('parseHTML - edge cases', () => {
    it('should remove script and style tags', async () => {
      const { parseHTML } = await import('@/lib/services/file-parser')

      const html = '<html><head><style>body { color: red; }</style></head><body><script>alert("test");</script><p>Content</p></body></html>'
      const buffer = Buffer.from(html, 'utf-8')
      const result = await parseHTML(buffer)

      expect(result.text).not.toContain('alert')
      expect(result.text).not.toContain('color: red')
      expect(result.text).toContain('Content')
    })

    it('should handle HTML without body tag', async () => {
      const { parseHTML } = await import('@/lib/services/file-parser')

      const html = '<html><p>Content</p></html>'
      const buffer = Buffer.from(html, 'utf-8')
      const result = await parseHTML(buffer)

      expect(result.text).toContain('Content')
    })

    it('should handle HTML entities', async () => {
      const { parseHTML } = await import('@/lib/services/file-parser')

      const html = '<p>Hello &amp; Goodbye &lt;world&gt;</p>'
      const buffer = Buffer.from(html, 'utf-8')
      const result = await parseHTML(buffer)

      expect(result.text).toContain('Hello & Goodbye <world>')
    })

    it('should remove HTML comments', async () => {
      const { parseHTML } = await import('@/lib/services/file-parser')

      const html = '<p>Content</p><!-- This is a comment --><p>More content</p>'
      const buffer = Buffer.from(html, 'utf-8')
      const result = await parseHTML(buffer)

      expect(result.text).not.toContain('This is a comment')
      expect(result.text).toContain('Content')
      expect(result.text).toContain('More content')
    })
  })

  describe('parseMarkdown - edge cases', () => {
    it('should handle markdown links', async () => {
      const { parseMarkdown } = await import('@/lib/services/file-parser')

      const markdown = '[Link text](https://example.com)'
      const buffer = Buffer.from(markdown, 'utf-8')
      const result = await parseMarkdown(buffer)

      expect(result.text).toContain('Link text')
      expect(result.text).not.toContain('https://example.com')
    })

    it('should handle markdown code blocks', async () => {
      const { parseMarkdown } = await import('@/lib/services/file-parser')

      const markdown = 'Here is `code` in text'
      const buffer = Buffer.from(markdown, 'utf-8')
      const result = await parseMarkdown(buffer)

      expect(result.text).toContain('code')
      expect(result.text).not.toContain('`')
    })

    it('should handle markdown bold and italic', async () => {
      const { parseMarkdown } = await import('@/lib/services/file-parser')

      const markdown = 'This is **bold** and *italic* text'
      const buffer = Buffer.from(markdown, 'utf-8')
      const result = await parseMarkdown(buffer)

      expect(result.text).toContain('bold')
      expect(result.text).toContain('italic')
      expect(result.text).not.toContain('**')
      expect(result.text).not.toContain('*')
    })

    it('should handle multiple markdown headings', async () => {
      const { parseMarkdown } = await import('@/lib/services/file-parser')

      const markdown = '# Title\n## Subtitle\n### Section'
      const buffer = Buffer.from(markdown, 'utf-8')
      const result = await parseMarkdown(buffer)

      expect(result.text).toContain('Title')
      expect(result.text).toContain('Subtitle')
      expect(result.text).toContain('Section')
      expect(result.text).not.toContain('#')
    })
  })

  describe('detectFileType - edge cases', () => {
    it('should detect by extension when mime type is text/plain', async () => {
      const { detectFileType } = await import('@/lib/services/file-parser')

      expect(detectFileType('text/plain', 'file.pdf')).toBe('pdf')
      expect(detectFileType('text/plain', 'file.docx')).toBe('docx')
      expect(detectFileType('text/plain', 'file.html')).toBe('html')
      expect(detectFileType('text/plain', 'file.md')).toBe('md')
    })

    it('should handle files without extension', async () => {
      const { detectFileType } = await import('@/lib/services/file-parser')

      expect(detectFileType('application/pdf', 'file')).toBe('pdf')
      expect(detectFileType('text/html', 'file')).toBe('html')
      expect(detectFileType('application/octet-stream', 'file')).toBe('unknown')
    })

    it('should handle HTML with htm extension', async () => {
      const { detectFileType } = await import('@/lib/services/file-parser')

      expect(detectFileType('text/html', 'file.htm')).toBe('html')
      expect(detectFileType('application/octet-stream', 'file.htm')).toBe('html')
    })

    it('should handle markdown with markdown extension', async () => {
      const { detectFileType } = await import('@/lib/services/file-parser')

      expect(detectFileType('text/plain', 'file.markdown')).toBe('md')
    })

    it('should check both mime type and extension', async () => {
      const { detectFileType } = await import('@/lib/services/file-parser')

      // MIME type имеет приоритет, если он точно определен
      expect(detectFileType('application/pdf', 'file.txt')).toBe('pdf')
      expect(detectFileType('text/html', 'file.txt')).toBe('html')
      // Extension используется, если mime type не определен точно
      expect(detectFileType('application/octet-stream', 'file.pdf')).toBe('pdf')
      expect(detectFileType('application/octet-stream', 'file.html')).toBe('html')
    })
  })

  describe('parseFile - error handling', () => {
    it('should throw error for unsupported file type', async () => {
      const { parseFile } = await import('@/lib/services/file-parser')

      const buffer = Buffer.from('content')
      
      await expect(parseFile(buffer, 'application/zip', 'archive.zip')).rejects.toThrow('Неподдерживаемый тип файла')
    })

    it('should handle parsePDF errors in parseFile', async () => {
      const pdfParseModule = await import('pdf-parse')
      vi.mocked(pdfParseModule.default).mockRejectedValue(new Error('PDF error'))

      const { parseFile } = await import('@/lib/services/file-parser')

      const buffer = Buffer.from('pdf content')
      
      await expect(parseFile(buffer, 'application/pdf', 'test.pdf')).rejects.toThrow('PDF error')
    })

    it('should handle parseDOCX errors in parseFile', async () => {
      const mammothModule = await import('mammoth')
      vi.mocked(mammothModule.default.extractRawText).mockRejectedValue(new Error('DOCX error'))

      const { parseFile } = await import('@/lib/services/file-parser')

      const buffer = Buffer.from('docx content')
      
      await expect(parseFile(buffer, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'test.docx')).rejects.toThrow('DOCX error')
    })
  })
})

