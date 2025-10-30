/**
 * Сервис долгосрочной памяти агентов
 * Хранит и извлекает контекст для персонализированного общения
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { generateChatResponse } from './llm'
import { searchKnowledgeBase } from '@/lib/repositories/knowledge-search'

export interface MemoryItem {
  id: string
  org_id: string
  agent_id: string | null
  client_identifier: string // email, phone, или другой идентификатор клиента
  memory_type: 'fact' | 'preference' | 'context' | 'interaction'
  content: string
  importance: number // 1-10, важность для запоминания
  confidence: number // 0-1, уверенность в корректности
  source: 'conversation' | 'crm' | 'manual' | 'inferred'
  expires_at?: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface MemoryContext {
  facts: string[]
  preferences: string[]
  recentContext: string[]
  interactionHistory: string[]
}

/**
 * Сохраняет новый элемент памяти
 */
export const saveMemoryItem = async (
  orgId: string,
  agentId: string | null,
  clientIdentifier: string,
  memoryType: MemoryItem['memory_type'],
  content: string,
  importance = 5,
  confidence = 0.8,
  source: MemoryItem['source'] = 'conversation',
  metadata: Record<string, any> = {},
  expiresAt?: Date,
): Promise<string | null> => {
  const supabase = getSupabaseServiceRoleClient()

  try {
    const { data, error } = await supabase
      .from('agent_memory')
      .insert({
        org_id: orgId,
        agent_id: agentId,
        client_identifier: clientIdentifier,
        memory_type: memoryType,
        content,
        importance,
        confidence,
        source,
        expires_at: expiresAt?.toISOString(),
        metadata,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Failed to save memory item', error)
      return null
    }

    return data.id
  } catch (error) {
    console.error('Error saving memory item', error)
    return null
  }
}

/**
 * Извлекает память для клиента
 */
export const getClientMemory = async (
  orgId: string,
  clientIdentifier: string,
  agentId?: string | null,
  limit = 20,
): Promise<MemoryItem[]> => {
  const supabase = getSupabaseServiceRoleClient()

  let query = supabase
    .from('agent_memory')
    .select('*')
    .eq('org_id', orgId)
    .eq('client_identifier', clientIdentifier)
    .gte('importance', 3) // Только важные воспоминания
    .gte('confidence', 0.6) // Только достоверные
    .order('importance', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (agentId) {
    query = query.or(`agent_id.is.null,agent_id.eq.${agentId}`)
  } else {
    query = query.is('agent_id', null)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to get client memory', error)
    return []
  }

  return data ?? []
}

/**
 * Извлекает релевантную память для текущего контекста разговора
 */
export const getRelevantMemory = async (
  orgId: string,
  clientIdentifier: string,
  currentMessage: string,
  agentId?: string | null,
  limit = 10,
): Promise<MemoryItem[]> => {
  const supabase = getSupabaseServiceRoleClient()

  // Получаем все воспоминания клиента
  const allMemories = await getClientMemory(orgId, clientIdentifier, agentId, 100)

  if (allMemories.length === 0) {
    return []
  }

  // Используем семантический поиск для релевантности
  const memoriesWithSimilarity = await Promise.all(
    allMemories.map(async (memory) => {
      const similarity = await calculateSemanticSimilarity(currentMessage, memory.content)
      return { ...memory, similarity }
    }),
  )

  // Сортируем по релевантности и важности
  const sortedMemories = memoriesWithSimilarity
    .sort((a, b) => {
      const scoreA = a.similarity * 0.7 + (a.importance / 10) * 0.3
      const scoreB = b.similarity * 0.7 + (b.importance / 10) * 0.3
      return scoreB - scoreA
    })
    .slice(0, limit)

  return sortedMemories
}

/**
 * Вычисляет семантическую схожесть между двумя текстами
 */
const calculateSemanticSimilarity = async (text1: string, text2: string): Promise<number> => {
  try {
    // Используем OpenRouter для вычисления схожести
    const systemPrompt = `Ты эксперт по анализу текста. Оцени схожесть между двумя текстами по шкале от 0 до 1.
Верни только число от 0 до 1, где:
- 1.0 = тексты идентичны или почти идентичны
- 0.5 = тексты связаны по теме, но разные
- 0.0 = тексты совершенно не связаны

Текст 1: "${text1}"
Текст 2: "${text2}"

Верни только число:`

    const response = await generateChatResponse('dummy-org', `Текст 1: "${text1}"\nТекст 2: "${text2}"`, {
      systemPrompt,
      model: 'openai/gpt-4o-mini',
    })

    const similarity = parseFloat(response.content.trim())
    return isNaN(similarity) ? 0 : Math.max(0, Math.min(1, similarity))
  } catch (error) {
    console.error('Error calculating semantic similarity', error)
    // Fallback: простое сравнение по словам
    const words1 = new Set(text1.toLowerCase().split(/\s+/))
    const words2 = new Set(text2.toLowerCase().split(/\s+/))
    const intersection = new Set([...words1].filter(x => words2.has(x)))
    const union = new Set([...words1, ...words2])
    return intersection.size / union.size
  }
}

/**
 * Извлекает память агента для формирования контекста
 */
export const getMemoryContext = async (
  orgId: string,
  clientIdentifier: string,
  agentId?: string | null,
): Promise<MemoryContext> => {
  const memories = await getClientMemory(orgId, clientIdentifier, agentId, 50)

  const context: MemoryContext = {
    facts: [],
    preferences: [],
    recentContext: [],
    interactionHistory: [],
  }

  // Группируем по типам
  for (const memory of memories.slice(0, 20)) { // Топ-20 воспоминаний
    switch (memory.memory_type) {
      case 'fact':
        context.facts.push(memory.content)
        break
      case 'preference':
        context.preferences.push(memory.content)
        break
      case 'context':
        context.recentContext.push(memory.content)
        break
      case 'interaction':
        context.interactionHistory.push(memory.content)
        break
    }
  }

  return context
}

/**
 * Автоматически извлекает и сохраняет важную информацию из разговора
 */
export const extractAndSaveMemoryFromConversation = async (
  orgId: string,
  agentId: string | null,
  clientIdentifier: string,
  conversationMessages: Array<{ role: 'user' | 'assistant'; content: string }>,
): Promise<void> => {
  if (conversationMessages.length < 2) return

  const lastUserMessage = conversationMessages
    .filter(msg => msg.role === 'user')
    .slice(-1)[0]?.content

  if (!lastUserMessage) return

  try {
    // Извлекаем важную информацию из последнего сообщения
    const extractedInfo = await extractImportantInfoFromMessage(lastUserMessage)

    for (const info of extractedInfo) {
      await saveMemoryItem(
        orgId,
        agentId,
        clientIdentifier,
        info.type,
        info.content,
        info.importance,
        info.confidence,
        'conversation',
        { source_message: lastUserMessage },
      )
    }
  } catch (error) {
    console.error('Error extracting memory from conversation', error)
  }
}

/**
 * Извлекает важную информацию из сообщения пользователя
 */
const extractImportantInfoFromMessage = async (message: string): Promise<Array<{
  type: MemoryItem['memory_type']
  content: string
  importance: number
  confidence: number
}>> => {
  try {
    const systemPrompt = `Ты эксперт по анализу разговоров. Извлеки важную информацию из сообщения пользователя, которая может быть полезна для будущего общения.

Категории информации:
1. FACTS - объективные факты о клиенте (имя, компания, должность, контактные данные)
2. PREFERENCES - предпочтения и интересы ("любит чай", "предпочитает email", "работает по утрам")
3. CONTEXT - текущий контекст разговора или ситуации

Формат ответа JSON:
{
  "information": [
    {
      "type": "fact|preference|context",
      "content": "краткое описание факта/предпочтения/контекста",
      "importance": 1-10,
      "confidence": 0.0-1.0
    }
  ]
}

Если нет важной информации - верни пустой массив.

Сообщение пользователя: "${message}"`

    const response = await generateChatResponse('dummy-org', message, {
      systemPrompt,
      model: 'openai/gpt-4o-mini',
    })

    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return []

    const parsed = JSON.parse(jsonMatch[0])
    return parsed.information ?? []
  } catch (error) {
    console.error('Error extracting important info', error)
    return []
  }
}

/**
 * Обновляет важность памяти на основе обратной связи
 */
export const updateMemoryImportance = async (
  memoryId: string,
  orgId: string,
  newImportance: number,
): Promise<boolean> => {
  const supabase = getSupabaseServiceRoleClient()

  const { error } = await supabase
    .from('agent_memory')
    .update({
      importance: Math.max(1, Math.min(10, newImportance)),
      updated_at: new Date().toISOString(),
    })
    .eq('id', memoryId)
    .eq('org_id', orgId)

  return !error
}

/**
 * Удаляет устаревшую память
 */
export const cleanupExpiredMemory = async (): Promise<void> => {
  const supabase = getSupabaseServiceRoleClient()

  const { error } = await supabase
    .from('agent_memory')
    .delete()
    .lt('expires_at', new Date().toISOString())

  if (error) {
    console.error('Error cleaning up expired memory', error)
  }
}

/**
 * Форматирует контекст памяти для системного промпта
 */
export const formatMemoryContext = (memoryContext: MemoryContext): string => {
  const parts: string[] = []

  if (memoryContext.facts.length > 0) {
    parts.push('\n## Известные факты о клиенте:')
    for (const fact of memoryContext.facts.slice(0, 5)) {
      parts.push(`- ${fact}`)
    }
  }

  if (memoryContext.preferences.length > 0) {
    parts.push('\n## Предпочтения клиента:')
    for (const pref of memoryContext.preferences.slice(0, 5)) {
      parts.push(`- ${pref}`)
    }
  }

  if (memoryContext.recentContext.length > 0) {
    parts.push('\n## Контекст предыдущих разговоров:')
    for (const ctx of memoryContext.recentContext.slice(0, 3)) {
      parts.push(`- ${ctx}`)
    }
  }

  return parts.join('\n')
}


