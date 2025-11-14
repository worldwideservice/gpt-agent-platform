/**
 * Сервис для работы с Knowledge Graph - извлечение сущностей и связей из текста
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { generateChatResponse } from './llm'
import { logger } from '@/lib/utils/logger'

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
 const systemPrompt = `Ты специалист по извлечению структурированных знаний из текста для построения Knowledge Graph.

Твоя задача:
1. Найти ВСЕ важные СУЩНОСТИ в тексте (люди, организации, продукты, услуги, процессы, концепции, события, места)
2. Определить ВСЕ СВЯЗИ между этими сущностями для понимания бизнес-процессов и структуры компании

Типы сущностей (расширенный список):
- person: имена людей, роли, должности, контакты
- organization: компании, организации, бренды, отделы, подразделения
- product: конкретные продукты, товары, решения
- service: услуги, сервисы компании, предложения
- process: бизнес-процессы, процедуры, workflows, алгоритмы
- concept: концепции, методологии, подходы, принципы
- feature: особенности продуктов/услуг, функции, возможности
- event: события, мероприятия, даты, митинги, встречи
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

Верни ответ ТОЛЬКО в формате JSON (без markdown, без комментариев):
{
 "entities": [
 {"type": "person", "name": "Иван Петров", "value": "Иван Петров - менеджер по продажам", "confidence": 0.9},
 {"type": "organization", "name": "Компания ABC", "value": "IT-компания", "confidence": 0.95}
 ],
 "relationships": [
 {"source": "Иван Петров", "target": "Компания ABC", "type": "works_for", "confidence": 0.9}
 ]
}

КРИТИЧЕСКИ ВАЖНО:
- Нормализуй названия сущностей: "Иван Петров" = "И. Петров" = "Петров Иван" → "Иван Петров"
- Извлекай ВСЕ связи, даже косвенные (через промежуточные сущности)
- confidence от 0 до 1 (0.7+ для уверенных, 0.5-0.7 для вероятных)
- Извлекай только существенные сущности (не стоп-слова, не общие понятия)
- Для организаций используй полное название, если указано
- Для людей используй полное ФИО, если указано`

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
 logger.error('Failed to extract knowledge from text', error)
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

 // Нормализуем и группируем сущности по имени для дедупликации
 const normalizeEntityName = (name: string): string => {
   // Приводим к нижнему регистру для сравнения
   // Убираем лишние пробелы
   // Убираем знаки препинания в конце
   return name.trim().toLowerCase().replace(/[.,;:!?]+$/, '').replace(/\s+/g, ' ')
 }

 const uniqueEntities = new Map<string, Entity>()
 const normalizedToOriginal = new Map<string, string>()

 for (const entity of entities) {
   const normalizedName = normalizeEntityName(entity.name)
   const key = `${entity.type}:${normalizedName}`
   
   // Проверяем, есть ли уже такая сущность
   if (!uniqueEntities.has(key) || (entity.confidence ?? 0) > (uniqueEntities.get(key)?.confidence ?? 0)) {
     uniqueEntities.set(key, { ...entity, name: normalizedToOriginal.get(normalizedName) || entity.name })
     normalizedToOriginal.set(normalizedName, entity.name)
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
 logger.error('Failed to save entity', error)
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
 logger.error('Failed to save relationships', error)
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


