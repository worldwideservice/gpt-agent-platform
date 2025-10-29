/**
 * Сервис для работы с Knowledge Graph - извлечение сущностей и связей из текста
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { generateChatResponse } from './llm'

interface Entity {
  type: string
  name: string
  value?: string
  confidence?: number
}

interface Relationship {
  source: string
  target: string
  type: string
  confidence?: number
}

interface ExtractedKnowledge {
  entities: Entity[]
  relationships: Relationship[]
}

/**
 * Извлекает сущности и связи из текста с помощью LLM
 */
export const extractKnowledgeFromText = async (
  organizationId: string,
  text: string,
  agentId?: string | null,
): Promise<ExtractedKnowledge> => {
  const systemPrompt = `Ты специалист по извлечению структурированных знаний из текста.

Твоя задача:
1. Найти все важные СУЩНОСТИ в тексте (люди, организации, продукты, услуги, концепции, события)
2. Определить СВЯЗИ между этими сущностями

Типы сущностей:
- person: имена людей, роли, должности
- organization: компании, организации, бренды
- product: названия продуктов, товаров
- service: услуги, сервисы
- concept: концепции, идеи, темы
- event: события, мероприятия, даты

Типы связей:
- works_for: человек работает в организации
- provides: организация предоставляет услугу/продукт
- uses: использование продукта/услуги
- related_to: общая связь
- part_of: часть целого
- located_in: расположение

Верни ответ ТОЛЬКО в формате JSON:
{
  "entities": [
    {"type": "person", "name": "Иван Петров", "value": "Иван Петров - менеджер", "confidence": 0.9},
    {"type": "organization", "name": "Компания ABC", "confidence": 0.95}
  ],
  "relationships": [
    {"source": "Иван Петров", "target": "Компания ABC", "type": "works_for", "confidence": 0.9}
  ]
}

Важно:
- Названия сущностей должны быть нормализованы (одинаковые написания объединяй)
- confidence от 0 до 1 (уверенность в извлечении)
- Только существенные сущности и связи`

  try {
    const response = await generateChatResponse(organizationId, text, {
      systemPrompt,
      model: 'openai/gpt-4o-mini', // Используем более дешевую модель для извлечения
    })

    // Парсим JSON из ответа
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { entities: [], relationships: [] }
    }

    const parsed = JSON.parse(jsonMatch[0]) as ExtractedKnowledge

    return {
      entities: parsed.entities ?? [],
      relationships: parsed.relationships ?? [],
    }
  } catch (error) {
    console.error('Failed to extract knowledge from text', error)
    return { entities: [], relationships: [] }
  }
}

/**
 * Сохраняет извлеченные сущности в базу данных
 */
export const saveEntities = async (
  organizationId: string,
  entities: Entity[],
  agentId?: string | null,
  articleId?: string | null,
  chunkId?: string | null,
): Promise<string[]> => {
  const supabase = getSupabaseServiceRoleClient()
  const entityIds: string[] = []

  if (entities.length === 0) {
    return entityIds
  }

  // Группируем сущности по имени для дедупликации
  const uniqueEntities = new Map<string, Entity>()
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

  // Вставляем или обновляем сущности
  for (const entity of uniqueEntities.values()) {
    const existingId = existingMap.get(entity.name)

    if (existingId) {
      entityIds.push(existingId)
      
      // Обновляем если уверенность выше
      await supabase
        .from('knowledge_graph_entities')
        .update({
          confidence: entity.confidence ?? 1.0,
          metadata: { value: entity.value },
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

      if (error) {
        console.error('Failed to save entity', error)
        continue
      }

      if (newEntity) {
        entityIds.push(newEntity.id)
      }
    }
  }

  return entityIds
}

/**
 * Сохраняет связи между сущностями
 */
export const saveRelationships = async (
  organizationId: string,
  relationships: Relationship[],
  entityNameToId: Map<string, string>,
  chunkId?: string | null,
): Promise<void> => {
  const supabase = getSupabaseServiceRoleClient()

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

  // Используем upsert для избежания дубликатов
  const { error } = await supabase.from('knowledge_graph_relationships').upsert(
    relationshipRows,
    {
      onConflict: 'source_entity_id,target_entity_id,relationship_type',
    },
  )

  if (error) {
    console.error('Failed to save relationships', error)
  }
}

/**
 * Получает связанные сущности для контекста
 */
export const getRelatedEntities = async (
  organizationId: string,
  entityNames: string[],
  limit = 10,
): Promise<Array<{ name: string; type: string; relationships: Array<{ target: string; type: string }> }>> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data: entities } = await supabase
    .from('knowledge_graph_entities')
    .select('id, entity_name, entity_type')
    .eq('org_id', organizationId)
    .in('entity_name', entityNames)
    .limit(limit)

  if (!entities || entities.length === 0) {
    return []
  }

  const entityIds = entities.map((e) => e.id)
  const entityMap = new Map(entities.map((e) => [e.id, e]))

  const { data: relationships } = await supabase
    .from('knowledge_graph_relationships')
    .select('source_entity_id, target_entity_id, relationship_type, knowledge_graph_entities!target(id, entity_name, entity_type)')
    .eq('org_id', organizationId)
    .in('source_entity_id', entityIds)
    .limit(limit * 2)

  if (!relationships) {
    return []
  }

  const result = new Map<string, { name: string; type: string; relationships: Array<{ target: string; type: string }> }>()

  for (const entity of entities) {
    result.set(entity.entity_name, {
      name: entity.entity_name,
      type: entity.entity_type,
      relationships: [],
    })
  }

  for (const rel of relationships) {
    const source = entityMap.get(rel.source_entity_id)
    if (!source) continue

    const targetEntity = rel.knowledge_graph_entities as unknown as { id: string; entity_name: string; entity_type: string } | null
    if (!targetEntity) continue

    const sourceData = result.get(source.entity_name)
    if (sourceData) {
      sourceData.relationships.push({
        target: targetEntity.entity_name,
        type: rel.relationship_type,
      })
    }
  }

  return Array.from(result.values())
}

export type { Entity, Relationship, ExtractedKnowledge }


