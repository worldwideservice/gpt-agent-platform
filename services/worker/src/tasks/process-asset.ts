/**
 * Worker task для обработки загруженных файлов агента
 * - Парсит файл
 * - Разбивает на chunks
 * - Генерирует embeddings
 * - Извлекает сущности для Knowledge Graph
 * - Сохраняет chunks в БД
 */

import { getSupabaseClient } from '../../../lib/supabase'
import { env } from '../lib/env.ts'

// Прямая реализация функций, так как worker не имеет доступа к lib корневого проекта
// TODO: Вынести общие функции в отдельный пакет или использовать одинаковые функции

// Утилиты для embeddings (упрощенная версия)
const chunkByTokenEstimate = (text: string, chunkSize = 600, overlap = 120): string[] => {
 const words = text.split(/\s+/)
 const chunks: string[] = []

 if (words.length === 0) {
 return []
 }

 for (let start = 0; start < words.length; start += chunkSize - overlap) {
 const end = Math.min(words.length, start + chunkSize)
 const slice = words.slice(start, end).join(' ').trim()

 if (slice.length > 0) {
 chunks.push(slice)
 }

 if (end === words.length) {
 break
 }
 }

 return chunks
}

const generateEmbeddings = async (input: string | string[]): Promise<Array<{ embedding: number[]; index: number }>> => {
 const apiKey = env.OPENROUTER_API_KEY

 if (!apiKey) {
 throw new Error('OPENROUTER_API_KEY is not configured')
 }

 const normalizedInput = Array.isArray(input) ? input : [input]
 const model = 'openai/text-embedding-3-large'

 const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 Authorization: `Bearer ${apiKey}`,
 'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
 'X-Title': 'GPT Agent Platform',
 },
 body: JSON.stringify({
 model,
 input: normalizedInput,
 }),
 })

 if (!response.ok) {
 const errorText = await response.text()
 throw new Error(`OpenRouter embeddings error: ${response.status} ${response.statusText} - ${errorText}`)
 }

 const payload = (await response.json()) as {
 data: Array<{ embedding: number[]; index: number }>
 }

 return payload.data
}

const generateEmbeddingsForDocument = async (
 content: string,
 chunkSize = 600,
 overlap = 120,
): Promise<Array<{ content: string; embedding: number[] }>> => {
 const chunks = chunkByTokenEstimate(content, chunkSize, overlap)

 if (chunks.length === 0) {
 return []
 }

 const embeddings = await generateEmbeddings(chunks)

 return embeddings.map((item, index) => ({
 content: chunks[index],
 embedding: item.embedding,
 }))
}

interface AssetStatusUpdate {
 status: 'pending' | 'processing' | 'completed' | 'failed'
 error?: string | null
 chunksCount?: number
 processingError?: string | null
}

const updateAssetStatus = async (assetId: string, update: AssetStatusUpdate): Promise<void> => {
 const supabase = getSupabaseClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
 
 const updateData: Record<string, unknown> = {
 status: update.status,
 error: update.error ?? null,
 processed_at: update.status === 'completed' || update.status === 'failed' 
 ? new Date().toISOString() 
 : null,
 }
 
 if (update.chunksCount !== undefined) {
 updateData.chunks_count = update.chunksCount
 }
 
 if (update.processingError !== undefined) {
 updateData.processing_error = update.processingError
 }
 
 const { error } = await supabase
 .from('agent_assets')
 .update(updateData)
 .eq('id', assetId)
 
 if (error) {
 console.error('Failed to update asset status', error)
 throw new Error(`Не удалось обновить статус файла: ${error.message}`)
 }
}

interface ProcessAssetJob {
 assetId: string
 organizationId: string
}

/**
 * Парсит содержимое файла различных форматов
 */
const parseFileContent = async (fileBuffer: Buffer, mimeType: string, fileName: string): Promise<string> => {
 // Простой парсинг текстовых файлов
 if (mimeType.startsWith('text/') || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
 return fileBuffer.toString('utf-8')
 }

 // Парсинг PDF
 if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) {
 try {
 const pdfParse = (await import('pdf-parse')).default
 const data = await pdfParse(fileBuffer)
 return data.text
 } catch (error) {
 if (error instanceof Error && error.message.includes('Cannot find module')) {
 throw new Error('PDF parsing requires pdf-parse package: cd services/worker && npm install pdf-parse')
 }
 throw error
 }
 }

 // Парсинг DOCX
 if (
 mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
 fileName.endsWith('.docx')
 ) {
 try {
 const mammoth = (await import('mammoth')).default
 const result = await mammoth.extractRawText({ buffer: fileBuffer })
 return result.value
 } catch (error) {
 if (error instanceof Error && error.message.includes('Cannot find module')) {
 throw new Error('DOCX parsing requires mammoth package: cd services/worker && npm install mammoth')
 }
 throw error
 }
 }

 // Простое извлечение текста из HTML
 if (mimeType === 'text/html' || fileName.endsWith('.html')) {
 const html = fileBuffer.toString('utf-8')
 return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
 }

 throw new Error(`Unsupported file type: ${mimeType} (${fileName})`)
}

/**
 * Обрабатывает загруженный файл агента
 */
export const processAsset = async (payload: ProcessAssetJob): Promise<void> => {
 const { assetId, organizationId } = payload
 const supabase = getSupabaseClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

 try {
 // Обновляем статус на "обработка"
 await updateAssetStatus(assetId, 'processing')

 // Получаем информацию о файле
 const { data: asset, error: fetchError } = await supabase
 .from('agent_assets')
 .select('*')
 .eq('id', assetId)
 .eq('org_id', organizationId)
 .single()

 if (fetchError || !asset) {
 throw new Error(`Asset not found: ${assetId}`)
 }

 if (!asset.storage_path) {
 throw new Error('Asset storage path is missing')
 }

 // Скачиваем файл из Storage (нужен клиент с service role для доступа)
 // TODO: Использовать правильный клиент для Storage
 const storageClient = getSupabaseClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
 const { data: fileData, error: downloadError } = await storageClient.storage
 .from('agent-assets')
 .download(asset.storage_path)

 if (downloadError || !fileData) {
 throw new Error(`Failed to download file: ${downloadError?.message ?? 'Unknown error'}`)
 }

 // Конвертируем Blob в Buffer
 const arrayBuffer = await fileData.arrayBuffer()
 const fileBuffer = Buffer.from(arrayBuffer)

 // Парсим файл
 const textContent = await parseFileContent(fileBuffer, asset.mime_type ?? '', asset.source_name ?? '')

 if (!textContent || textContent.trim().length === 0) {
 throw new Error('File content is empty after parsing')
 }

 // Разбиваем на chunks и генерируем embeddings
 const chunksWithEmbeddings = await generateEmbeddingsForDocument(textContent, 600, 120)

 if (chunksWithEmbeddings.length === 0) {
 throw new Error('Failed to generate embeddings for file content')
 }

 // Сохраняем chunks в БД
 const chunkRows = chunksWithEmbeddings.map((chunk, index) => ({
 org_id: organizationId,
 agent_id: asset.agent_id,
 asset_id: assetId,
 content: chunk.content,
 embedding: chunk.embedding,
 metadata: {
 position: index,
 length: chunk.content.length,
 sourceFile: asset.source_name,
 fileSize: asset.file_size,
 },
 }))

 // Сохраняем chunks (Supabase JS клиент автоматически обрабатывает pgvector формат)
 const { error: chunksError } = await supabase.from('knowledge_chunks').insert(chunkRows)

 if (chunksError) {
 throw new Error(`Failed to save chunks: ${chunksError.message}`)
 }

 // Добавляем задачу для извлечения Knowledge Graph (асинхронно, не блокируем обработку)
 // Это можно делать в фоне, так как не критично для работы
 try {
 const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:4000'
 await fetch(`${backendUrl}/jobs`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 type: 'extract-knowledge-graph',
 assetId,
 organizationId,
 agentId: asset.agent_id,
 }),
 }).catch((err) => {
 // Не критично если не удалось добавить задачу
 console.warn('[worker] Failed to queue KG extraction', err)
 })
 } catch (error) {
 // Игнорируем ошибки - KG extraction не критичен
 }

 // Обновляем статус на "завершено"
 await updateAssetStatus(assetId, 'completed', null, chunksWithEmbeddings.length)

 console.log(`[worker] Asset ${assetId} processed successfully: ${chunksWithEmbeddings.length} chunks created`)
 } catch (error) {
 console.error(`[worker] Failed to process asset ${assetId}:`, error)

 const errorMessage = error instanceof Error ? error.message : 'Unknown error'

 await updateAssetStatus(assetId, 'failed', errorMessage)

 throw error
 }
}

