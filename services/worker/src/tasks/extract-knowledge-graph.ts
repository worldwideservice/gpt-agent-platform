/**
 * Worker task для извлечения Knowledge Graph из обработанных файлов
 * Автоматически извлекает сущности и связи для долгосрочной памяти агента
 */

import { cache } from '@/lib/cache'
import { getSupabaseClient } from '../lib/supabase.ts'
import { env } from '../lib/env.ts'

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
const extractKnowledgeFromText = async (
  text: string,
): Promise<{
  entities: Array<{
    type: string
    name: string
    value?: string
    confidence?: number
  }>
  relationships: Array<{
    source: string
    target: string
    type: string
    confidence?: number
  }>
}> => {
  const apiKey = env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  const systemPrompt = `Ты специалист по извлечению структурированных знаний из текста для построения Knowledge Graph компании.

Твоя задача:
1. Найти ВСЕ важные СУЩНОСТИ (люди, организации, продукты, услуги, процессы, концепции, технологии, места)
2. Определить ВСЕ СВЯЗИ между сущностями для полного понимания бизнес-процессов и структуры

Типы сущностей (расширенный список):
- person: имена людей, роли, должности, контакты
- organization: компании, организации, бренды, отделы, подразделения
- product: конкретные продукты, товары, решения
- service: услуги, сервисы компании, предложения
- process: бизнес-процессы, процедуры, workflows, алгоритмы
- concept: концепции, методологии, подходы, принципы
- feature: особенности продуктов/услуг, функции, возможности
- event: события, мероприятия, даты, митинги
- location: места, офисы, локации, адреса
- technology: технологии, инструменты, платформы, системы
- document: документы, файлы, отчеты, презентации
- metric: метрики, KPI, показатели, измерения

Типы связей (расширенный список):
- works_for: человек работает в организации/отделе
- manages: управляет (человек → человек/процесс/отдел)
- provides: организация предоставляет услугу/продукт
- uses: использование продукта/услуги/процесса/технологии
- related_to: общая связь, ассоциация
- part_of: часть целого (отдел → компания, функция → продукт)
- depends_on: зависимость (процесс зависит от процесса/ресурса)
- requires: требует наличия (процесс требует ресурс/условие)
- located_in: расположение (офис в городе, отдел в здании)
- owns: владеет (компания владеет продуктом/активом)
- collaborates_with: сотрудничает с (организация с организацией)
- reports_to: подчиняется (сотрудник → руководитель)
- responsible_for: отвечает за (роль → процесс/задача)
- participates_in: участвует в (человек → событие/процесс)
- contains: содержит (документ содержит информацию, продукт содержит функцию)

Верни ТОЛЬКО JSON (без markdown, без комментариев):
{
 "entities": [
 {"type": "product", "name": "Продукт X", "value": "Описание продукта", "confidence": 0.95}
 ],
 "relationships": [
 {"source": "Продукт X", "target": "Компания ABC", "type": "provides", "confidence": 0.9}
 ]
}

КРИТИЧЕСКИ ВАЖНО:
- Нормализуй названия: "Иван Петров" = "И. Петров" = "Петров Иван" → "Иван Петров"
- Извлекай ВСЕ связи, включая косвенные
- confidence: 0.7+ (уверенные), 0.5-0.7 (вероятные), <0.5 (игнорировать)
- Только существенные сущности (не стоп-слова, не общие понятия)`

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer':
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'GPT Agent Platform',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: `Извлеки знания из следующего текста:\n\n${text.slice(0, 4000)}`,
            },
          ],
          temperature: 0.3,
        }),
      },
    )

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
      entities: Array<{
        type: string
        name: string
        value?: string
        confidence?: number
      }>
      relationships: Array<{
        source: string
        target: string
        type: string
        confidence?: number
      }>
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
  entities: Array<{
    type: string
    name: string
    value?: string
    confidence?: number
  }>,
  agentId?: string | null,
  articleId?: string | null,
  assetId?: string | null,
  chunkId?: string | null,
): Promise<Map<string, string>> => {
  const entityNameToId = new Map<string, string>()

  if (entities.length === 0) {
    return entityNameToId
  }

  // Нормализуем названия сущностей для дедупликации
  const normalizeEntityName = (name: string): string => {
    // Приводим к нижнему регистру, убираем лишние пробелы и знаки препинания
    return name
      .trim()
      .toLowerCase()
      .replace(/[.,;:!?]+$/, '')
      .replace(/\s+/g, ' ')
  }

  // Дедупликация по нормализованному имени
  const uniqueEntities = new Map<string, (typeof entities)[0]>()
  const normalizedToOriginal = new Map<string, string>()

  for (const entity of entities) {
    const normalizedName = normalizeEntityName(entity.name)
    const key = `${entity.type}:${normalizedName}`

    // Сохраняем оригинальное название (самое полное)
    if (
      !normalizedToOriginal.has(normalizedName) ||
      entity.name.length >
        (normalizedToOriginal.get(normalizedName)?.length || 0)
    ) {
      normalizedToOriginal.set(normalizedName, entity.name)
    }

    if (
      !uniqueEntities.has(key) ||
      (entity.confidence ?? 0) > (uniqueEntities.get(key)?.confidence ?? 0)
    ) {
      uniqueEntities.set(key, {
        ...entity,
        name: normalizedToOriginal.get(normalizedName) || entity.name,
      })
    }
  }

  // Проверяем существующие сущности (по нормализованным именам)
  const entityNames = Array.from(uniqueEntities.values()).map((e) => e.name)
  const normalizedNames = Array.from(uniqueEntities.values()).map((e) =>
    normalizeEntityName(e.name),
  )

  // Получаем все сущности организации для проверки нормализованных имен
  const { data: existing } = await supabase
    .from('knowledge_graph_entities')
    .select('id, entity_name')
    .eq('org_id', organizationId)

  // Создаем мапу нормализованных имен к ID
  const existingMap = new Map<string, string>()
  if (existing) {
    for (const entity of existing) {
      const normalized = normalizeEntityName(entity.entity_name)
      if (normalizedNames.includes(normalized)) {
        existingMap.set(normalized, entity.id)
      }
    }
  }

  // Сохраняем новые или обновляем существующие
  for (const entity of uniqueEntities.values()) {
    const normalized = normalizeEntityName(entity.name)
    const existingId = existingMap.get(normalized)

    if (existingId) {
      // Используем оригинальное название из БД, если оно есть
      const existingEntity = existing?.find((e) => e.id === existingId)
      const finalName = existingEntity?.entity_name || entity.name
      entityNameToId.set(entity.name, existingId)
      entityNameToId.set(finalName, existingId) // Также маппим по оригинальному названию

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
  relationships: Array<{
    source: string
    target: string
    type: string
    confidence?: number
  }>,
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
  await supabase
    .from('knowledge_graph_relationships')
    .upsert(relationshipRows, {
      onConflict: 'source_entity_id,target_entity_id,relationship_type',
    })
}

/**
 * Извлекает Knowledge Graph из обработанных chunks
 */
export const extractKnowledgeGraph = async (
  payload: ExtractKGJob,
): Promise<void> => {
  const { organizationId, agentId, assetId, articleId, chunkIds } = payload
  const supabase = getSupabaseClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
  )

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
      const combinedText = batch
        .map((c) => (c.content as string) ?? '')
        .join('\n\n')

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

    if (totalEntities > 0 || totalRelationships > 0) {
      await cache
        .delPattern(`agent-context:${organizationId}:*`)
        .catch(() => {})
      await cache.delPattern(`agent-kg:${organizationId}:*`).catch(() => {})
    }

    console.log(
      `[worker] Knowledge Graph extracted: ${totalEntities} entities, ${totalRelationships} relationships`,
    )
  } catch (error) {
    console.error('[worker] Failed to extract Knowledge Graph', error)
    // Не выбрасываем ошибку - это не критично для работы системы
  }
}
