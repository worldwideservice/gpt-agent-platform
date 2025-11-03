import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { generateEmbeddingsForDocument } from '@/lib/services/embeddings'

import type { KnowledgeBaseArticle, KnowledgeBaseCategory } from '@/types'

interface CategoryRow {
 id: string
 org_id: string
 name: string
 description: string | null
 parent_id: string | null
 sort_order: number
 created_at: string
 updated_at: string
}

interface ArticleRow {
 id: string
 org_id: string
 category_id: string | null
 title: string
 content: string
 slug: string | null
 is_published: boolean
 views_count: number
 created_at: string
 updated_at: string
}

const mapCategoryRowToDomain = (row: CategoryRow, articlesCount: number): KnowledgeBaseCategory => ({
 id: row.id,
 name: row.name,
 articlesCount,
 createdAt: new Date(row.created_at),
 description: row.description ?? null,
 parentId: row.parent_id ?? null,
})

const mapArticleRowToDomain = (row: ArticleRow): KnowledgeBaseArticle => {
 return {
 id: row.id,
 title: row.title,
 categoryId: row.category_id ?? null,
 content: row.content,
 slug: row.slug ?? null,
 isPublished: typeof row.is_published === 'boolean' ? row.is_published : true,
 viewsCount: typeof row.views_count === 'number' ? row.views_count : 0,
 createdAt: new Date(row.created_at),
 updatedAt: new Date(row.updated_at),
 }
}

const reindexArticleKnowledge = async (
 supabase: ReturnType<typeof getSupabaseServiceRoleClient>,
 params: { organizationId: string; articleId: string; content: string },
) => {
 const { organizationId, articleId, content } = params

 try {
 await supabase.from('knowledge_chunks').delete().eq('article_id', articleId)

 if (content.trim().length === 0) {
 return
 }

 const chunks = await generateEmbeddingsForDocument(organizationId, content)

 if (chunks.length === 0) {
 // Сохраняем текстовый chunk без embedding, чтобы fallback поиск работал
 await supabase.from('knowledge_chunks').insert({
 org_id: organizationId,
 article_id: articleId,
 content: content.slice(0, 2048),
 metadata: { position: 0, fallback: true },
 })
 return
 }

 const rows = chunks.map((chunk, index) => ({
 org_id: organizationId,
 article_id: articleId,
 content: chunk.content,
 embedding: chunk.embedding,
 metadata: {
 position: index,
 length: chunk.content.length,
 },
 }))

 const { error } = await supabase.from('knowledge_chunks').insert(rows)

 if (error) {
 console.error('Failed to store knowledge embeddings', error)
 }
 } catch (error) {
 console.error('Knowledge article reindex failed', error)
 }
}

export const getKnowledgeBaseCategories = async (organizationId: string): Promise<KnowledgeBaseCategory[]> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .from('knowledge_base_categories')
 .select('*')
 .eq('org_id', organizationId)
 .order('sort_order', { ascending: true })
 .order('name', { ascending: true })

 if (error) {
 console.error('Failed to fetch knowledge base categories', error)
 throw new Error('Не удалось загрузить категории')
 }

 const rows = (data as CategoryRow[] | null) ?? []

 const articlesCountByCategory = await Promise.all(
 rows.map(async (category) => {
 const { count } = await supabase
 .from('knowledge_base_articles')
 .select('id', { count: 'exact', head: true })
 .eq('org_id', organizationId)
 .eq('category_id', category.id)

 return { categoryId: category.id, count: count ?? 0 }
 }),
 )

 const countMap = new Map(articlesCountByCategory.map((item) => [item.categoryId, item.count]))

 return rows.map((row) => mapCategoryRowToDomain(row, countMap.get(row.id) ?? 0))
}

export const getKnowledgeBaseCategoryById = async (
 categoryId: string,
 organizationId: string,
): Promise<KnowledgeBaseCategory | null> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .from('knowledge_base_categories')
 .select('*')
 .eq('id', categoryId)
 .eq('org_id', organizationId)
 .maybeSingle()

 if (error) {
 console.error('Failed to fetch knowledge base category', error)
 throw new Error('Не удалось загрузить категорию')
 }

 if (!data) {
 return null
 }

 const { count } = await supabase
 .from('knowledge_base_articles')
 .select('id', { count: 'exact', head: true })
 .eq('org_id', organizationId)
 .eq('category_id', categoryId)

 return mapCategoryRowToDomain(data as CategoryRow, count ?? 0)
}

export const createKnowledgeBaseCategory = async (
 organizationId: string,
 data: { name: string; description?: string; parentId?: string | null },
): Promise<KnowledgeBaseCategory> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data: categoryData, error } = await supabase
 .from('knowledge_base_categories')
 .insert({
 org_id: organizationId,
 name: data.name,
 description: data.description?.trim() ? data.description.trim() : null,
 parent_id: data.parentId ?? null,
 })
 .select('*')
 .single()

 if (error) {
 console.error('Failed to create knowledge base category', error)
 throw new Error('Не удалось создать категорию')
 }

 return mapCategoryRowToDomain(categoryData as CategoryRow, 0)
}

export const updateKnowledgeBaseCategory = async (
 categoryId: string,
 organizationId: string,
 data: { name?: string; description?: string; parentId?: string | null },
): Promise<KnowledgeBaseCategory> => {
 const supabase = getSupabaseServiceRoleClient()

 const updatePayload: Record<string, unknown> = {}

 if (data.name !== undefined) {
 updatePayload.name = data.name
 }

 if (data.description !== undefined) {
 updatePayload.description = data.description?.trim() ? data.description.trim() : null
 }

 if (data.parentId !== undefined) {
 updatePayload.parent_id = data.parentId
 }

 const { data: categoryData, error } = await supabase
 .from('knowledge_base_categories')
 .update(updatePayload)
 .eq('id', categoryId)
 .eq('org_id', organizationId)
 .select('*')
 .single()

 if (error) {
 console.error('Failed to update knowledge base category', error)
 throw new Error('Не удалось обновить категорию')
 }

 if (!categoryData) {
 throw new Error('Категория не найдена')
 }

 const { count } = await supabase
 .from('knowledge_base_articles')
 .select('id', { count: 'exact', head: true })
 .eq('org_id', organizationId)
 .eq('category_id', categoryId)

 return mapCategoryRowToDomain(categoryData as CategoryRow, count ?? 0)
}

export const deleteKnowledgeBaseCategory = async (categoryId: string, organizationId: string): Promise<void> => {
 const supabase = getSupabaseServiceRoleClient()

 const { error } = await supabase
 .from('knowledge_base_categories')
 .delete()
 .eq('id', categoryId)
 .eq('org_id', organizationId)

 if (error) {
 console.error('Failed to delete knowledge base category', error)
 throw new Error('Не удалось удалить категорию')
 }
}

export const getKnowledgeBaseArticles = async (
 organizationId: string,
 categoryId?: string,
): Promise<KnowledgeBaseArticle[]> => {
 const supabase = getSupabaseServiceRoleClient()

 let query = supabase
 .from('knowledge_base_articles')
 .select('*')
 .eq('org_id', organizationId)
 .order('created_at', { ascending: false })

 if (categoryId) {
 query = query.eq('category_id', categoryId)
 }

 const { data, error } = await query

 if (error) {
 console.error('Failed to fetch knowledge base articles', error)
 throw new Error('Не удалось загрузить статьи')
 }

 return ((data as ArticleRow[] | null) ?? []).map(mapArticleRowToDomain)
}

export const getKnowledgeBaseArticleById = async (
 articleId: string,
 organizationId: string,
): Promise<KnowledgeBaseArticle | null> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .from('knowledge_base_articles')
 .select('*')
 .eq('id', articleId)
 .eq('org_id', organizationId)
 .maybeSingle()

 if (error) {
 console.error('Failed to fetch knowledge base article', error)
 throw new Error('Не удалось загрузить статью')
 }

 if (!data) {
 return null
 }

 return mapArticleRowToDomain(data as ArticleRow)
}

export const createKnowledgeBaseArticle = async (
 organizationId: string,
 data: { title: string; content: string; categoryId?: string | null; slug?: string | null; isPublished?: boolean },
): Promise<KnowledgeBaseArticle> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data: articleData, error } = await supabase
 .from('knowledge_base_articles')
 .insert({
 org_id: organizationId,
 title: data.title,
 content: data.content,
 category_id: data.categoryId ?? null,
 slug: data.slug?.trim() ? data.slug.trim() : null,
 is_published: data.isPublished ?? true,
 })
 .select('*')
 .single()

 if (error) {
 console.error('Failed to create knowledge base article', error)
 throw new Error('Не удалось создать статью')
 }

 const article = mapArticleRowToDomain(articleData as ArticleRow)

 await reindexArticleKnowledge(supabase, {
 organizationId,
 articleId: article.id,
 content: article.content,
 })

 return article
}

export const updateKnowledgeBaseArticle = async (
 articleId: string,
 organizationId: string,
 data: { title?: string; content?: string; categoryId?: string | null; slug?: string | null; isPublished?: boolean },
): Promise<KnowledgeBaseArticle> => {
 const supabase = getSupabaseServiceRoleClient()

 const updatePayload: Record<string, unknown> = {}

 if (data.title !== undefined) {
 updatePayload.title = data.title
 }

 if (data.content !== undefined) {
 updatePayload.content = data.content
 }

 if (data.categoryId !== undefined) {
 updatePayload.category_id = data.categoryId
 }

 if (data.slug !== undefined) {
 updatePayload.slug = data.slug?.trim() ? data.slug.trim() : null
 }

 if (data.isPublished !== undefined) {
 updatePayload.is_published = data.isPublished
 }

 const { data: articleData, error } = await supabase
 .from('knowledge_base_articles')
 .update(updatePayload)
 .eq('id', articleId)
 .eq('org_id', organizationId)
 .select('*')
 .single()

 if (error) {
 console.error('Failed to update knowledge base article', error)
 throw new Error('Не удалось обновить статью')
 }

 if (!articleData) {
 throw new Error('Статья не найдена')
 }

 const article = mapArticleRowToDomain(articleData as ArticleRow)

 if (data.content !== undefined) {
 await reindexArticleKnowledge(supabase, {
 organizationId,
 articleId,
 content: article.content,
 })
 }

 return article
}

export const deleteKnowledgeBaseArticle = async (articleId: string, organizationId: string): Promise<void> => {
 const supabase = getSupabaseServiceRoleClient()

 const { error } = await supabase
 .from('knowledge_base_articles')
 .delete()
 .eq('id', articleId)
 .eq('org_id', organizationId)

 if (error) {
 console.error('Failed to delete knowledge base article', error)
 throw new Error('Не удалось удалить статью')
 }
}
