/**
 * Worker task для извлечения Knowledge Graph из обработанных файлов
 * Автоматически извлекает сущности и связи для долгосрочной памяти агента
 */

import { getSupabaseClient } from '../lib/supabase'
import { env } from '../lib/env'

interface ExtractKGJob {
  assetId?: string
  articleId?: string
  organizationId: string
  agentId?: string | null
  chunkIds?: string[]
}

/**
 * Извлекает Knowledge Graph из текста через LLM
 */
const extractKnowledgeFromText = async (text: string): Promise<{
  entities: Array<{ type: string; name: string; value?: string; confidence?: number }>
  relationships: Array<{ source: string; target: string; type: string; confidence?: number }>
}> => {
  const apiKey = env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  const systemPrompt = `Ты специалист по извлечению структурированных знаний из текста для обучения AI-агента как штатного сотрудника компании.

Твоя задача:
1. Найти все важные СУЩНОСТИ (люди, организации, продукты, услуги, процессы, концепции)
2. Определить СВЯЗИ между сущностями для понимания бизнес-процессов

Типы сущностей:
- person: имена людей, роли, должности
- organization: компании, организации, бренды, отделы
- product: конкретные продукты, товары
- service: услуги, сервисы компании
- process: бизнес-процессы, процедуры
- concept: концепции, методологии, подходы
- feature: особенности продуктов/услуг

Типы связей:
- works_for: человек работает в организации
- provides: организация предоставляет услугу/продукт
- uses: использование продукта/услуги/процесса
- related_to: общая связь
- part_of: часть целого
- depends_on: зависимость
- requires: требует наличия

Верни ТОЛЬКО JSON:
{
  "entities": [
    {"type": "product", "name": "Продукт X", "value": "Описание продукта", "confidence": 0.95}
  ],
  "relationships": [
    {"source": "Продукт X", "target": "Компания ABC", "type": "provides", "confidence": 0.9}
  ]
}`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'GPT Agent Platform',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Извлеки знания из следующего текста:\n\n${text.slice(0, 4000)}` },
        ],
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`)
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>
    }

    const content = data.choices[0]?.message?.content

    if (!content) {
      return { entities: [], relationships: [] }
    }

    // Извлекаем JSON из ответа
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { entities: [], relationships: [] }
    }

    return JSON.parse(jsonMatch[0]) as {
      entities: Array<{ type: string; name: string; value?: string; confidence?: number }>
      relationships: Array<{ source: string; target: string; type: string; confidence?: number }>
    }
  } catch (error) {
    console.error('Failed to extract knowledge from text', error)
    return { entities: [], relationships: [] }
  }
}

/**
 * Сохраняет извлеченные сущности в БД
 */
const saveEntities = async (
  supabase: ReturnType<typeof getSupabaseClient>,
  organizationId: string,
  entities: Array<{ type: string; name: string; value?: string; confidence?: number }>,
  agentId?: string | null,
  articleId?: string | null,
  assetId?: string | null,
  chunkId?: string | null,
): Promise<Map<string, string>> => {
  const entityNameToId = new Map<string, string>()

  if (entities.length === 0) {
    return entityNameToId
  }

  // Дедупликация по имени
  const uniqueEntities = new Map<string, typeof entities[0]>()
  for (const entity of entities) {
    const key = `${entity.type}:${entity.name}`
    if (!uniqueEntities.has(key) || (entity.confidence ?? 0) > (uniqueEntities.get(key)?.confidence ?? 0)) {
      uniqueEntities.set(key, entity)
    }
  }

  // Проверяем существующие сущности
  const entityNames = Array.from(uniqueEntities.values()).map((e) => e.name)
  const { data: existing } = await supabase
    .from('knowledge_graph_entities')
    .select('id, entity_name')
    .eq('org_id', organizationId)
    .in('entity_name', entityNames)

  const existingMap = new Map((existing ?? []).map((e) => [e.entity_name, e.id]))

  // Сохраняем новые или обновляем существующие
  for (const entity of uniqueEntities.values()) {
    const existingId = existingMap.get(entity.name)

    if (existingId) {
      entityNameToId.set(entity.name, existingId)
      
      // Обновляем если уверенность выше
      await supabase
        .from('knowledge_graph_entities')
        .update({
          confidence: entity.confidence ?? 1.0,
          entity_value: entity.value ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingId)
    } else {
      const { data: newEntity, error } = await supabase
        .from('knowledge_graph_entities')
        .insert({
          org_id: organizationId,
          agent_id: agentId ?? null,
          article_id: articleId ?? null,
          entity_type: entity.type,
          entity_name: entity.name,
          entity_value: entity.value ?? null,
          confidence: entity.confidence ?? 1.0,
          source_chunk_id: chunkId ?? null,
          metadata: {},
        })
        .select('id')
        .single()

      if (!error && newEntity) {
        entityNameToId.set(entity.name, newEntity.id)
      }
    }
  }

  return entityNameToId
}

/**
 * Сохраняет связи между сущностями
 */
const saveRelationships = async (
  supabase: ReturnType<typeof getSupabaseClient>,
  organizationId: string,
  relationships: Array<{ source: string; target: string; type: string; confidence?: number }>,
  entityNameToId: Map<string, string>,
  chunkId?: string | null,
): Promise<void> => {
  if (relationships.length === 0) {
    return
  }

  const relationshipRows = relationships
    .map((rel) => {
      const sourceId = entityNameToId.get(rel.source)
      const targetId = entityNameToId.get(rel.target)

      if (!sourceId || !targetId) {
        return null
      }

      return {
        org_id: organizationId,
        source_entity_id: sourceId,
        target_entity_id: targetId,
        relationship_type: rel.type,
        confidence: rel.confidence ?? 1.0,
        source_chunk_id: chunkId ?? null,
        metadata: {},
      }
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)

  if (relationshipRows.length === 0) {
    return
  }

  // Upsert для избежания дубликатов
  await supabase.from('knowledge_graph_relationships').upsert(
    relationshipRows,
    {
      onConflict: 'source_entity_id,target_entity_id,relationship_type',
    },
  )
}

/**
 * Извлекает Knowledge Graph из обработанных chunks
 */
export const extractKnowledgeGraph = async (payload: ExtractKGJob): Promise<void> => {
  const { organizationId, agentId, assetId, articleId, chunkIds } = payload
  const supabase = getSupabaseClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

  try {
    // Получаем chunks для обработки
    let query = supabase
      .from('knowledge_chunks')
      .select('id, content, embedding')
      .eq('org_id', organizationId)

    if (assetId) {
      query = query.eq('asset_id', assetId)
    }

    if (articleId) {
      query = query.eq('article_id', articleId)
    }

    if (chunkIds && chunkIds.length > 0) {
      query = query.in('id', chunkIds)
    }

    const { data: chunks, error: chunksError } = await query

    if (chunksError || !chunks || chunks.length === 0) {
      console.log('[worker] No chunks found for KG extraction')
      return
    }

    // Обрабатываем chunks батчами (чтобы не перегрузить LLM)
    const batchSize = 5
    let totalEntities = 0
    let totalRelationships = 0

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)
      const combinedText = batch.map((c) => (c.content as string) ?? '').join('\n\n')

      if (combinedText.trim().length === 0) {
        continue
      }

      // Извлекаем знания из батча
      const knowledge = await extractKnowledgeFromText(combinedText)

      if (knowledge.entities.length === 0) {
        continue
      }

      // Сохраняем сущности
      const entityNameToId = await saveEntities(
        supabase,
        organizationId,
        knowledge.entities,
        agentId ?? null,
        articleId ?? null,
        assetId ?? null,
        batch[0]?.id as string | undefined,
      )

      totalEntities += entityNameToId.size

      // Сохраняем связи
      if (knowledge.relationships.length > 0) {
        await saveRelationships(
          supabase,
          organizationId,
          knowledge.relationships,
          entityNameToId,
          batch[0]?.id as string | undefined,
        )

        totalRelationships += knowledge.relationships.length
      }

      // Небольшая задержка между батчами
      if (i + batchSize < chunks.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    console.log(
      `[worker] Knowledge Graph extracted: ${totalEntities} entities, ${totalRelationships} relationships`,
    )
  } catch (error) {
    console.error('[worker] Failed to extract Knowledge Graph', error)
    // Не выбрасываем ошибку - это не критично для работы системы
  }
}


