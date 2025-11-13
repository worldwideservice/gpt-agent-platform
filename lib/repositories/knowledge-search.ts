/**
 * Репозиторий для векторного поиска по базе знаний
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { generateEmbeddings } from '@/lib/services/embeddings'
import { logger } from '@/lib/utils'

interface KnowledgeChunk {
 id: string
 content: string
 metadata: {
 articleId?: string
 articleTitle?: string
 categoryId?: string
 categoryName?: string
 }
 similarity: number
}

/**
 * Поиск релевантных чанков из базы знаний по векторному поиску
 * Пока без реального embedding - возвращает статьи из базы знаний
 */
export const searchKnowledgeBase = async (
 organizationId: string,
 query: string,
 agentId?: string | null,
 limit = 5,
): Promise<KnowledgeChunk[]> => {
 const supabase = getSupabaseServiceRoleClient()

 try {
 const embeddingResponse = await generateEmbeddings(organizationId, query)
 const embedding = embeddingResponse.data[0]?.embedding

 if (embedding && embedding.length > 0) {
 const { data, error } = await supabase.rpc('match_knowledge_chunks', {
 query_embedding: embedding,
 org_uuid: organizationId,
 agent_uuid: agentId ?? null,
 article_uuid: null,
 match_count: limit,
 similarity_threshold: 0.45,
 })

 if (error) {
 throw error
 }

 const matches = (data as Array<{ id: string; article_id: string | null; content: string; similarity: number; metadata: Record<string, unknown> }> | null) ?? []

 if (matches.length > 0) {
 return matches.map((match) => {
 const articleId = match.article_id ?? (match.metadata?.articleId as string | undefined) ?? undefined
 return {
 id: match.id,
 content: match.content,
 metadata: {
 ...(articleId ? { articleId } : {}),
 ...((match.metadata as Record<string, unknown>) ?? {}),
 },
 similarity: match.similarity ?? 0,
 }
 }) as KnowledgeChunk[]
 }
 }
 } catch (error) {
 logger.error('Vector search failed, falling back to text search', error instanceof Error ? error : new Error(String(error)), { organizationId, query })
 }

 // Fallback: текстовый поиск по статьям
 const { data: articles, error: textSearchError } = await supabase
 .from('knowledge_base_articles')
 .select(
 `
 id,
 title,
 content,
 category_id,
 knowledge_base_categories!inner(name)
 `,
 )
 .eq('org_id', organizationId)
 .ilike('content', `%${query}%`)
 .limit(limit)

 if (textSearchError) {
 logger.error('Fallback text search failed', textSearchError instanceof Error ? textSearchError : new Error(String(textSearchError)), { organizationId, query })
 return []
 }

 return ((articles as any[]) ?? []).map((article) => ({
 id: article.id,
 content: article.content,
 metadata: {
 articleId: article.id,
 articleTitle: article.title,
 categoryId: article.category_id,
 categoryName: article.knowledge_base_categories?.name,
 },
 similarity: 0.3,
 }))
}

/**
 * Форматирует контекст из базы знаний для добавления в промпт
 */
export const formatKnowledgeContext = (chunks: KnowledgeChunk[]): string => {
 if (chunks.length === 0) {
 return ''
 }

 const contextParts: string[] = []

 for (const chunk of chunks) {
 const parts: string[] = []

 if (chunk.metadata.articleTitle) {
 parts.push(`**${chunk.metadata.articleTitle}**`)
 }

 if (chunk.metadata.categoryName) {
 parts.push(`Категория: ${chunk.metadata.categoryName}`)
 }

 parts.push(chunk.content.slice(0, 500)) // Ограничиваем длину контента

 contextParts.push(parts.join('\n\n'))
 }

 return contextParts.join('\n\n---\n\n')
}

export type { KnowledgeChunk }

