/**
 * Сервис для парсинга различных типов файлов и извлечения текста
 */

interface ParsedDocument {
 text: string
 metadata: {
 title?: string
 author?: string
 pageCount?: number
 wordCount?: number
 language?: string
 [key: string]: unknown
 }
}

/**
 * Парсит PDF файл
 */
export const parsePDF = async (fileBuffer: Buffer): Promise<ParsedDocument> => {
 try {
 // Динамический импорт для поддержки ESM
 // @ts-ignore - pdf-parse doesn't have type definitions
 const pdfParse = (await import('pdf-parse')).default
 const data = await pdfParse(fileBuffer)
 
 return {
 text: data.text,
 metadata: {
 title: data.info?.Title,
 author: data.info?.Author,
 pageCount: data.numpages,
 wordCount: data.text.split(/\s+/).filter((word: string) => word.length > 0).length,
 },
 }
 } catch (error) {
 // Если библиотека не установлена, выбрасываем понятную ошибку
 if (error instanceof Error && error.message.includes('Cannot find module')) {
 throw new Error('PDF parsing requires pdf-parse package. Run: cd services/worker && npm install pdf-parse')
 }
 throw error
 }
}

/**
 * Парсит DOCX файл
 */
export const parseDOCX = async (fileBuffer: Buffer): Promise<ParsedDocument> => {
 try {
 // Динамический импорт для поддержки ESM
 // @ts-ignore - mammoth doesn't have type definitions
 const mammoth = (await import('mammoth')).default
 const result = await mammoth.extractRawText({ buffer: fileBuffer })
 
 return {
 text: result.value,
 metadata: {
 wordCount: result.value.split(/\s+/).filter((word: string) => word.length > 0).length,
 },
 }
 } catch (error) {
 // Если библиотека не установлена, выбрасываем понятную ошибку
 if (error instanceof Error && error.message.includes('Cannot find module')) {
 throw new Error('DOCX parsing requires mammoth package. Run: cd services/worker && npm install mammoth')
 }
 throw error
 }
}

/**
 * Парсит текстовый файл
 */
export const parseTXT = async (fileBuffer: Buffer): Promise<ParsedDocument> => {
 const text = fileBuffer.toString('utf-8')
 
 return {
 text,
 metadata: {
 wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
 characterCount: text.length,
 },
 }
}

/**
 * Парсит HTML файл
 */
export const parseHTML = async (fileBuffer: Buffer): Promise<ParsedDocument> => {
 // TODO: Установить cheerio: npm install cheerio
 // const cheerio = require('cheerio')
 // const $ = cheerio.load(fileBuffer.toString('utf-8'))
 // const text = $('body').text()
 
 // Временная заглушка - простое извлечение текста
 const html = fileBuffer.toString('utf-8')
 const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
 
 return {
 text,
 metadata: {
 wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
 },
 }
}

/**
 * Парсит Markdown файл
 */
export const parseMarkdown = async (fileBuffer: Buffer): Promise<ParsedDocument> => {
 const text = fileBuffer.toString('utf-8')
 
 // Простое извлечение текста (можно улучшить через markdown parser)
 const plainText = text
 .replace(/#{1,6}\s+/g, '') // Заголовки
 .replace(/\*\*([^*]+)\*\*/g, '$1') // Жирный текст
 .replace(/\*([^*]+)\*/g, '$1') // Курсив
 .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Ссылки
 .replace(/`([^`]+)`/g, '$1') // Код
 .replace(/\n{2,}/g, '\n\n') // Множественные переносы
 
 return {
 text: plainText,
 metadata: {
 wordCount: plainText.split(/\s+/).filter(word => word.length > 0).length,
 },
 }
}

/**
 * Определяет тип файла по MIME type или расширению
 */
export const detectFileType = (mimeType: string, fileName: string): 'pdf' | 'docx' | 'txt' | 'html' | 'md' | 'unknown' => {
 const extension = fileName.split('.').pop()?.toLowerCase() ?? ''
 
 if (mimeType === 'application/pdf' || extension === 'pdf') {
 return 'pdf'
 }
 
 if (
 mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
 extension === 'docx'
 ) {
 return 'docx'
 }
 
 if (mimeType === 'text/html' || extension === 'html' || extension === 'htm') {
 return 'html'
 }
 
 if (mimeType === 'text/markdown' || extension === 'md' || extension === 'markdown') {
 return 'md'
 }
 
 if (mimeType.startsWith('text/') || extension === 'txt') {
 return 'txt'
 }
 
 return 'unknown'
}

/**
 * Главная функция парсинга файла
 */
export const parseFile = async (fileBuffer: Buffer, mimeType: string, fileName: string): Promise<ParsedDocument> => {
 const fileType = detectFileType(mimeType, fileName)
 
 switch (fileType) {
 case 'pdf':
 return parsePDF(fileBuffer)
 case 'docx':
 return parseDOCX(fileBuffer)
 case 'html':
 return parseHTML(fileBuffer)
 case 'md':
 return parseMarkdown(fileBuffer)
 case 'txt':
 return parseTXT(fileBuffer)
 default:
 throw new Error(`Неподдерживаемый тип файла: ${mimeType} (${fileName})`)
 }
}

