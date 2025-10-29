/**
 * Строитель контекста для агента - собирает всю информацию для осмысленных ответов
 * Интегрирует: Knowledge Graph + Company Knowledge + Sales Scripts + Memory
 */

import { getCompanyKnowledgeForContext, getSalesScriptForStage, getObjectionResponses } from '@/lib/repositories/company-knowledge'
import { getRelatedEntities } from './knowledge-graph'
import { searchKnowledgeBase } from '@/lib/repositories/knowledge-search'

interface AgentContext {
  companyKnowledge: string
  salesScripts: string
  objectionResponses: string
  knowledgeGraph: string
  vectorSearch: string
  agentMemory: string
  instructions: string
}

interface ContextOptions {
  organizationId: string
  agentId: string | null
  pipelineStageId?: string | null
  userMessage?: string
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
}

/**
 * Строит полный контекст для агента как штатного сотрудника
 */
export const buildAgentContext = async (options: ContextOptions): Promise<AgentContext> => {
  const { organizationId, agentId, pipelineStageId, userMessage } = options

  // Параллельно загружаем все источники знаний
  const [
    companyKnowledge,
    salesScripts,
    objectionResponses,
    vectorChunks,
  ] = await Promise.all([
    // Знания компании (продукты, услуги, процессы)
    getCompanyKnowledgeForContext(organizationId, agentId, pipelineStageId),
    
    // Скрипты продаж для этапа
    pipelineStageId ? getSalesScriptForStage(organizationId, pipelineStageId) : Promise.resolve([]),
    
    // Ответы на возражения
    getObjectionResponses(organizationId),
    
    // Векторный поиск по всем загруженным документам
    userMessage ? searchKnowledgeBase(organizationId, userMessage, agentId, 5) : Promise.resolve([]),
  ])

  // Извлекаем сущности из сообщения для Knowledge Graph (если есть сообщение)
  // TODO: Реализовать извлечение имен сущностей из сообщения для поиска связанных
  let knowledgeGraphContext = ''
  // Пока пропускаем - требует дополнительную логику извлечения имен сущностей из текста
  // Можно добавить позже для улучшения контекста

  // Форматируем знания компании
  const companyKnowledgeText = formatCompanyKnowledge(companyKnowledge)
  
  // Форматируем скрипты продаж
  const salesScriptsText = formatSalesScripts(salesScripts, pipelineStageId)
  
  // Форматируем ответы на возражения
  const objectionResponsesText = formatObjectionResponses(objectionResponses)
  
  // Форматируем векторный поиск
  const vectorSearchText = formatVectorSearch(vectorChunks)

  return {
    companyKnowledge: companyKnowledgeText,
    salesScripts: salesScriptsText,
    objectionResponses: objectionResponsesText,
    knowledgeGraph: knowledgeGraphContext,
    vectorSearch: vectorSearchText,
    agentMemory: '', // TODO: Добавить долгосрочную память
    instructions: '', // Будет добавлено из настроек агента
  }
}

/**
 * Форматирует знания компании для промпта
 */
const formatCompanyKnowledge = (knowledge: Awaited<ReturnType<typeof getCompanyKnowledgeForContext>>): string => {
  if (knowledge.length === 0) {
    return ''
  }

  const grouped = new Map<string, typeof knowledge>()
  
  for (const item of knowledge) {
    if (!grouped.has(item.category)) {
      grouped.set(item.category, [])
    }
    grouped.get(item.category)!.push(item)
  }

  let text = '\n## Знания о компании:\n\n'
  
  for (const [category, items] of grouped.entries()) {
    const categoryNames: Record<string, string> = {
      product: '📦 Продукты',
      service: '🛠️ Услуги',
      process: '⚙️ Процессы',
      script: '📝 Скрипты',
      objection: '❓ Возражения',
      company_info: '🏢 Информация о компании',
    }
    
    text += `### ${categoryNames[category] ?? category}\n\n`
    
    for (const item of items.slice(0, 10)) { // Ограничиваем количество
      text += `**${item.title}**\n${item.content.slice(0, 500)}...\n\n`
    }
  }

  return text
}

/**
 * Форматирует скрипты продаж
 */
const formatSalesScripts = (
  scripts: Awaited<ReturnType<typeof getSalesScriptForStage>>,
  stageId?: string | null,
): string => {
  if (scripts.length === 0) {
    return ''
  }

  let text = '\n## Скрипты продаж'
  if (stageId) {
    text += ` (для текущего этапа воронки)`
  }
  text += ':\n\n'

  for (const script of scripts.slice(0, 5)) { // Топ-5 скриптов
    const typeNames: Record<string, string> = {
      greeting: '👋 Приветствие',
      qualification: '❓ Квалификация',
      presentation: '🎯 Презентация',
      objection_handling: '🛡️ Работа с возражениями',
      closing: '✅ Закрытие сделки',
    }

    text += `### ${script.title} (${typeNames[script.scriptType] ?? script.scriptType})\n`
    text += `${script.content}\n\n`
    
    if (Object.keys(script.variables).length > 0) {
      text += `*Переменные: ${Object.keys(script.variables).join(', ')}*\n\n`
    }
  }

  return text
}

/**
 * Форматирует ответы на возражения
 */
const formatObjectionResponses = (
  responses: Awaited<ReturnType<typeof getObjectionResponses>>,
): string => {
  if (responses.length === 0) {
    return ''
  }

  let text = '\n## Работа с возражениями клиентов:\n\n'

  const grouped = new Map<string, typeof responses>()
  
  for (const response of responses) {
    if (!grouped.has(response.objectionType)) {
      grouped.set(response.objectionType, [])
    }
    grouped.get(response.objectionType)!.push(response)
  }

  for (const [type, items] of grouped.entries()) {
    const typeNames: Record<string, string> = {
      price: '💰 Цена',
      timing: '⏰ Время',
      need: '❓ Потребность',
      competitor: '🏆 Конкурент',
      trust: '🤝 Доверие',
      other: '📌 Прочие',
    }

    text += `### ${typeNames[type] ?? type}\n\n`
    
    for (const item of items.slice(0, 3)) {
      if (item.objectionText) {
        text += `**Возражение:** "${item.objectionText}"\n`
      }
      text += `**Ответ:** ${item.responseScript}\n\n`
    }
  }

  return text
}

/**
 * Форматирует результаты векторного поиска
 */
const formatVectorSearch = (
  chunks: Awaited<ReturnType<typeof searchKnowledgeBase>>,
): string => {
  if (chunks.length === 0) {
    return ''
  }

  let text = '\n## Релевантная информация из документов:\n\n'

  for (const chunk of chunks.slice(0, 5)) {
    text += `[Релевантность: ${Math.round(chunk.similarity * 100)}%]\n`
    text += `${chunk.content.slice(0, 400)}...\n\n`
    
    if (chunk.metadata.articleTitle) {
      text += `*Источник: ${chunk.metadata.articleTitle}*\n\n`
    }
  }

  return text
}

/**
 * Собирает полный системный промпт для агента
 */
export const buildFullSystemPrompt = async (
  options: ContextOptions & { agentInstructions?: string | null },
): Promise<string> => {
  const context = await buildAgentContext(options)

  const parts: string[] = []

  // Инструкции агента (если есть)
  if (options.agentInstructions) {
    parts.push('## Твоя роль и инструкции:\n')
    parts.push(options.agentInstructions.trim())
    parts.push('\n')
  }

  // Знания компании
  if (context.companyKnowledge) {
    parts.push(context.companyKnowledge)
  }

  // Скрипты продаж
  if (context.salesScripts) {
    parts.push(context.salesScripts)
  }

  // Ответы на возражения
  if (context.objectionResponses) {
    parts.push(context.objectionResponses)
  }

  // Векторный поиск
  if (context.vectorSearch) {
    parts.push(context.vectorSearch)
  }

  // Knowledge Graph
  if (context.knowledgeGraph) {
    parts.push(context.knowledgeGraph)
  }

  // Важные правила
  parts.push('\n## Критические правила поведения:\n')
  parts.push('- Ты штатный сотрудник компании - действуй профессионально\n')
  parts.push('- Используй знания компании для точных ответов\n')
  parts.push('- Применяй соответствующие скрипты продаж для текущего этапа воронки\n')
  parts.push('- Работай с возражениями используя подготовленные ответы\n')
  parts.push('- Если не уверен в ответе - не выдумывай, передай специалисту\n')
  parts.push('- Веди диалог с целью продвижения клиента по воронке продаж\n')
  parts.push('- Персонализируй ответы на основе контекста и истории взаимодействия\n')

  return parts.join('\n')
}

export type { AgentContext, ContextOptions }

