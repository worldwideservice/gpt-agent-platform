/**
 * Worker task для обработки загруженных файлов агента
 * - Парсит файл
 * - Разбивает на chunks
 * - Генерирует embeddings
 * - Извлекает сущности для Knowledge Graph
 * - Сохраняет chunks в БД
 */

import { getSupabaseClient } from '../lib/supabase.ts'
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
 * Обрабатывает большой файл с использованием streaming
 */
async function processLargeFileWithStreaming(
  assetId: string,
  organizationId: string,
  asset: any,
  supabase: any,
): Promise<void> {
  const CHUNK_SIZE = 1024 * 1024 // 1MB chunks
  const BATCH_SIZE = 10 // Обрабатываем по 10 chunks за раз
  const EMBEDDING_BATCH_SIZE = 50 // Генерируем embeddings батчами

  try {
    const storageClient = getSupabaseClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    
    // Получаем размер файла
    const { data: fileInfo } = await storageClient.storage
      .from('agent-assets')
      .list(asset.storage_path.split('/').slice(0, -1).join('/'), {
        search: asset.storage_path.split('/').pop(),
      })

    // Скачиваем файл по частям (streaming)
    const { data: fileStream, error: downloadError } = await storageClient.storage
      .from('agent-assets')
      .download(asset.storage_path)

    if (downloadError || !fileStream) {
      throw new Error(`Failed to download file: ${downloadError?.message ?? 'Unknown error'}`)
    }

    // Для текстовых файлов читаем по частям
    if (asset.mime_type?.startsWith('text/') || asset.source_name?.endsWith('.txt') || asset.source_name?.endsWith('.md')) {
      const reader = fileStream.stream().getReader()
      const decoder = new TextDecoder('utf-8')
      let accumulatedText = ''
      let chunkIndex = 0
      const textChunks: string[] = []

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          accumulatedText += decoder.decode(value, { stream: true })
          
          // Разбиваем на chunks по размеру
          while (accumulatedText.length >= CHUNK_SIZE) {
            const chunk = accumulatedText.slice(0, CHUNK_SIZE)
            textChunks.push(chunk)
            accumulatedText = accumulatedText.slice(CHUNK_SIZE)
            chunkIndex++
          }
        }

        // Добавляем остаток
        if (accumulatedText.length > 0) {
          textChunks.push(accumulatedText)
        }
      } finally {
        reader.releaseLock()
      }

      // Обрабатываем chunks батчами
      const allChunksWithEmbeddings: Array<{ content: string; embedding: number[] }> = []

      for (let i = 0; i < textChunks.length; i += BATCH_SIZE) {
        const batch = textChunks.slice(i, i + BATCH_SIZE)
        
        // Разбиваем каждый chunk на более мелкие части для embeddings
        const embeddingChunks: string[] = []
        for (const textChunk of batch) {
          const subChunks = chunkByTokenEstimate(textChunk, 600, 120)
          embeddingChunks.push(...subChunks)
        }

        // Генерируем embeddings батчами
        for (let j = 0; j < embeddingChunks.length; j += EMBEDDING_BATCH_SIZE) {
          const embeddingBatch = embeddingChunks.slice(j, j + EMBEDDING_BATCH_SIZE)
          const embeddings = await generateEmbeddings(embeddingBatch)
          
          for (let k = 0; k < embeddingBatch.length; k++) {
            allChunksWithEmbeddings.push({
              content: embeddingBatch[k],
              embedding: embeddings[k]?.embedding || [],
            })
          }

          // Обновляем прогресс
          const progress = Math.round(((i + batch.length) / textChunks.length) * 100)
          await supabase
            .from('agent_assets')
            .update({
              processing_progress: progress,
              updated_at: new Date().toISOString(),
            })
            .eq('id', assetId)
        }
      }

      // Сохраняем chunks батчами
      for (let i = 0; i < allChunksWithEmbeddings.length; i += 100) {
        const batch = allChunksWithEmbeddings.slice(i, i + 100)
        const chunkRows = batch.map((chunk, index) => ({
          org_id: organizationId,
          agent_id: asset.agent_id,
          asset_id: assetId,
          content: chunk.content,
          embedding: chunk.embedding,
          metadata: {
            position: i + index,
            length: chunk.content.length,
            sourceFile: asset.source_name,
            fileSize: asset.file_size,
          },
        }))

        await supabase.from('knowledge_chunks').insert(chunkRows)
      }

      await updateAssetStatus(assetId, { status: 'completed', chunksCount: allChunksWithEmbeddings.length })
      console.log(`[worker] Large file ${assetId} processed with streaming: ${allChunksWithEmbeddings.length} chunks created`)
    } else {
      // Для PDF/DOCX пока используем стандартную обработку (можно улучшить позже)
      const arrayBuffer = await fileStream.arrayBuffer()
      const fileBuffer = Buffer.from(arrayBuffer)
      const textContent = await parseFileContent(fileBuffer, asset.mime_type ?? '', asset.source_name ?? '')
      
      // Обрабатываем большие тексты по частям
      const chunksWithEmbeddings = await generateEmbeddingsForDocumentInBatches(
        textContent,
        600,
        120,
        EMBEDDING_BATCH_SIZE,
        async (progress) => {
          await supabase
            .from('agent_assets')
            .update({
              processing_progress: progress,
              updated_at: new Date().toISOString(),
            })
            .eq('id', assetId)
        }
      )

      // Сохраняем chunks батчами
      for (let i = 0; i < chunksWithEmbeddings.length; i += 100) {
        const batch = chunksWithEmbeddings.slice(i, i + 100)
        const chunkRows = batch.map((chunk, index) => ({
          org_id: organizationId,
          agent_id: asset.agent_id,
          asset_id: assetId,
          content: chunk.content,
          embedding: chunk.embedding,
          metadata: {
            position: i + index,
            length: chunk.content.length,
            sourceFile: asset.source_name,
            fileSize: asset.file_size,
          },
        }))

        await supabase.from('knowledge_chunks').insert(chunkRows)
      }

      await updateAssetStatus(assetId, { status: 'completed', chunksCount: chunksWithEmbeddings.length })
      console.log(`[worker] Large file ${assetId} processed: ${chunksWithEmbeddings.length} chunks created`)
    }
  } catch (error) {
    console.error(`[worker] Failed to process large file ${assetId} with streaming:`, error)
    throw error
  }
}

/**
 * Генерирует embeddings для документа батчами с прогрессом
 */
async function generateEmbeddingsForDocumentInBatches(
  content: string,
  chunkSize = 600,
  overlap = 120,
  batchSize = 50,
  onProgress?: (progress: number) => Promise<void>,
): Promise<Array<{ content: string; embedding: number[] }>> {
  const chunks = chunkByTokenEstimate(content, chunkSize, overlap)

  if (chunks.length === 0) {
    return []
  }

  const result: Array<{ content: string; embedding: number[] }> = []

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize)
    const embeddings = await generateEmbeddings(batch)

    for (let j = 0; j < batch.length; j++) {
      result.push({
        content: batch[j],
        embedding: embeddings[j]?.embedding || [],
      })
    }

    // Обновляем прогресс
    if (onProgress) {
      const progress = Math.round(((i + batch.length) / chunks.length) * 100)
      await onProgress(progress)
    }
  }

  return result
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

 // Определяем размер файла для выбора стратегии обработки
 const fileSize = asset.file_size || 0
 const LARGE_FILE_THRESHOLD = 10 * 1024 * 1024 // 10MB

 // Для больших файлов используем streaming
 if (fileSize > LARGE_FILE_THRESHOLD) {
   console.log(`[worker] Processing large file ${assetId} (${(fileSize / 1024 / 1024).toFixed(2)}MB) with streaming`)
   return await processLargeFileWithStreaming(assetId, organizationId, asset, supabase)
 }

 // Для небольших файлов используем стандартную обработку
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

