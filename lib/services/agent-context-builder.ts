/**
 * Строитель контекста для агента - собирает всю информацию для осмысленных ответов
 * Интегрирует: Knowledge Graph + Company Knowledge + Sales Scripts + Memory
 */

import { createHash } from 'crypto'
import { logger } from '@/lib/utils'

import { cached, cacheConfig, cacheKeys } from '@/lib/cache'
import {
  getCompanyKnowledgeForContext,
  getSalesScriptForStage,
  getObjectionResponses,
} from '@/lib/repositories/company-knowledge'
import { getRelatedEntities } from './knowledge-graph'
import { searchKnowledgeBase } from '@/lib/repositories/knowledge-search'
import {
  getMemoryContext,
  formatMemoryContext,
  extractAndSaveMemoryFromConversation,
} from './agent-memory'
import { processScript, type ScriptContext } from './script-processor'

interface AgentContext {
  companyKnowledge: string
  salesScripts: string
  objectionResponses: string
  knowledgeGraph: string
  vectorSearch: string
  agentMemory: string
  clientMemory: string
  instructions: string
}

interface ContextOptions {
  organizationId: string
  agentId: string | null
  pipelineStageId?: string | null
  userMessage?: string
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
  clientIdentifier?: string
  scriptContext?: ScriptContext
  agentInstructions?: string | null
}

/**
 * Строит полный контекст для агента как штатного сотрудника
 */
export const buildAgentContext = async (
  options: ContextOptions,
): Promise<AgentContext> => {
  const {
    organizationId,
    agentId,
    pipelineStageId,
    userMessage,
    clientIdentifier,
    scriptContext,
    agentInstructions,
  } = options

  const staticContext = await cached(
    cacheKeys.agentStaticContext(
      organizationId,
      agentId ?? null,
      pipelineStageId ?? null,
    ),
    async () => {
      const [companyKnowledge, salesScripts, objectionResponses] =
        await Promise.all([
          getCompanyKnowledgeForContext(
            organizationId,
            agentId,
            pipelineStageId,
          ),
          pipelineStageId
            ? getSalesScriptForStage(organizationId, pipelineStageId)
            : Promise.resolve([]),
          getObjectionResponses(organizationId),
        ])

      return { companyKnowledge, salesScripts, objectionResponses }
    },
    cacheConfig.agentContextStatic,
  )

  const [vectorChunks, clientMemory] = await Promise.all([
    userMessage
      ? searchKnowledgeBase(organizationId, userMessage, agentId, 5)
      : Promise.resolve([]),
    clientIdentifier
      ? getMemoryContext(organizationId, clientIdentifier, agentId)
      : Promise.resolve({
          facts: [],
          preferences: [],
          recentContext: [],
          interactionHistory: [],
        }),
  ])

  const knowledgeGraphContext = userMessage
    ? await cached(
        cacheKeys.agentKnowledgeGraph(
          organizationId,
          createHash('sha1').update(userMessage).digest('hex'),
        ),
        () => generateKnowledgeGraphContext(organizationId, userMessage),
        cacheConfig.agentKnowledgeGraph,
      )
    : ''

  // Форматируем знания компании
  const companyKnowledgeText = formatCompanyKnowledge(
    staticContext.companyKnowledge,
  )

  // Форматируем скрипты продаж с обработкой переменных
  // Используем переданный контекст или создаем базовый
  const scriptContextForProcessing = scriptContext || {
    agentName: 'Агент',
    customVariables: {},
    crmData: {},
  }
  const salesScriptsText = formatSalesScripts(
    staticContext.salesScripts,
    pipelineStageId,
    scriptContextForProcessing,
  )

  // Форматируем ответы на возражения
  const objectionResponsesText = formatObjectionResponses(
    staticContext.objectionResponses,
  )

  // Форматируем векторный поиск
  const vectorSearchText = formatVectorSearch(vectorChunks)

  const memoryText = formatMemoryContext(clientMemory)

  return {
    companyKnowledge: companyKnowledgeText,
    salesScripts: salesScriptsText,
    objectionResponses: objectionResponsesText,
    knowledgeGraph: knowledgeGraphContext,
    vectorSearch: vectorSearchText,
    agentMemory: memoryText,
    clientMemory: memoryText,
    instructions: agentInstructions ?? '',
  }
}

/**
 * Форматирует знания компании для промпта
 */
const formatCompanyKnowledge = (
  knowledge: Awaited<ReturnType<typeof getCompanyKnowledgeForContext>>,
): string => {
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

    for (const item of items.slice(0, 10)) {
      // Ограничиваем количество
      text += `**${item.title}**\n${item.content.slice(0, 500)}...\n\n`
    }
  }

  return text
}

/**
 * Форматирует скрипты продаж с обработкой переменных
 */
const formatSalesScripts = (
  scripts: Awaited<ReturnType<typeof getSalesScriptForStage>>,
  stageId?: string | null,
  scriptContext?: ScriptContext,
): string => {
  if (scripts.length === 0) {
    return ''
  }

  let text = '\n## Скрипты продаж'
  if (stageId) {
    text += ` (для текущего этапа воронки)`
  }
  text += ':\n\n'

  for (const script of scripts.slice(0, 5)) {
    // Топ-5 скриптов
    const typeNames: Record<string, string> = {
      greeting: '👋 Приветствие',
      qualification: '❓ Квалификация',
      presentation: '🎯 Презентация',
      objection_handling: '🛡️ Работа с возражениями',
      closing: '✅ Закрытие сделки',
    }

    // Обрабатываем скрипт с подстановкой переменных
    const processedContent = scriptContext
      ? processScript(script.content, scriptContext)
      : script.content

    text += `### ${script.title} (${typeNames[script.scriptType] ?? script.scriptType})\n`
    text += `${processedContent}\n\n`

    if (Object.keys(script.variables || {}).length > 0) {
      text += `*Доступные переменные: ${Object.keys(script.variables).join(', ')}*\n\n`
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

const generateKnowledgeGraphContext = async (
  organizationId: string,
  userMessage: string,
): Promise<string> => {
  const candidates = extractPotentialEntities(userMessage)

  if (candidates.length === 0) {
    return ''
  }

  const relatedEntities = await getRelatedEntities(
    organizationId,
    candidates.slice(0, 5),
  )

  if (relatedEntities.length === 0) {
    return `\n## Упомянутые сущности:\n- ${candidates.join(', ')}`
  }

  let text = '\n## Связанные сущности из Knowledge Graph:\n\n'

  for (const entity of relatedEntities) {
    text += `**${entity.name}** (${entity.type})\n`
    if (entity.relationships.length > 0) {
      for (const relation of entity.relationships.slice(0, 5)) {
        text += `- ${relation.type} → ${relation.target}\n`
      }
    }
    text += '\n'
  }

  return text
}

const extractPotentialEntities = (message: string): string[] => {
  const matches = message.match(/\b[A-ZА-ЯЁ][\w-]+\b/g) || []
  const normalized = matches
    .map((word) => word.trim())
    .filter((word) => word.length > 2)

  return Array.from(new Set(normalized))
}

/**
 * Собирает полный системный промпт для агента
 */
export const composeSystemPrompt = (
  context: AgentContext,
  agentInstructions?: string | null,
): string => {
  const parts: string[] = []

  // Инструкции агента (если есть)
  if (agentInstructions) {
    parts.push('## Твоя роль и инструкции:\n')
    parts.push(agentInstructions.trim())
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

  // Память о клиенте
  if (context.clientMemory) {
    parts.push(context.clientMemory)
  }

  // Важные правила
  parts.push('\n## Критические правила поведения:\n')
  parts.push('- Ты штатный сотрудник компании - действуй профессионально\n')
  parts.push('- Используй знания компании для точных ответов\n')
  parts.push(
    '- Применяй соответствующие скрипты продаж для текущего этапа воронки\n',
  )
  parts.push('- Работай с возражениями используя подготовленные ответы\n')
  parts.push('- Если не уверен в ответе - не выдумывай, передай специалисту\n')
  parts.push('- Веди диалог с целью продвижения клиента по воронке продаж\n')
  parts.push(
    '- Персонализируй ответы на основе контекста и истории взаимодействия\n',
  )

  return parts.join('\n')
}

export const buildFullSystemPrompt = async (
  options: ContextOptions & { agentInstructions?: string | null },
): Promise<string> => {
  const context = await buildAgentContext(options)
  return composeSystemPrompt(context, options.agentInstructions)
}

/**
 * Извлекает и сохраняет важную информацию из разговора в память агента
 */
export const processConversationMemory = async (
  options: ContextOptions & {
    conversationMessages: Array<{
      role: 'user' | 'assistant'
      content: string
    }>
  },
): Promise<void> => {
  const { organizationId, agentId, clientIdentifier, conversationMessages } =
    options

  if (!clientIdentifier || conversationMessages.length < 2) {
    return
  }

  try {
    await extractAndSaveMemoryFromConversation(
      organizationId,
      agentId,
      clientIdentifier,
      conversationMessages,
    )
  } catch (error) {
    logger.error('Error processing conversation memory', error instanceof Error ? error : new Error(String(error)), { organizationId, agentId, clientIdentifier })
  }
}

export type { AgentContext, ContextOptions }
