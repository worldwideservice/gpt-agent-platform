/**
 * Сервис для обработки скриптов продаж
 * Поддержка шаблонизации переменных и интеграция в chat
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export interface ScriptContext {
  // Данные клиента/лида
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  companyName?: string
  
  // Данные сделки
  leadId?: string
  leadName?: string
  leadValue?: number
  leadStage?: string
  leadPipeline?: string
  
  // Данные продукта/услуги
  productName?: string
  productPrice?: number
  productDescription?: string
  
  // Данные агента
  agentName?: string
  
  // Дополнительные переменные
  customVariables?: Record<string, string | number | boolean>
  
  // Данные из CRM
  crmData?: Record<string, any>
}

/**
 * Обрабатывает скрипт с подстановкой переменных
 */
export const processScript = (
  scriptContent: string,
  context: ScriptContext
): string => {
  let processed = scriptContent

  // Стандартные переменные
  const variables: Record<string, string> = {
    '{{customer_name}}': context.customerName || 'Клиент',
    '{{customer_email}}': context.customerEmail || '',
    '{{customer_phone}}': context.customerPhone || '',
    '{{company_name}}': context.companyName || '',
    '{{lead_id}}': context.leadId || '',
    '{{lead_name}}': context.leadName || 'Сделка',
    '{{lead_value}}': context.leadValue ? String(context.leadValue) : '',
    '{{lead_stage}}': context.leadStage || '',
    '{{lead_pipeline}}': context.leadPipeline || '',
    '{{product_name}}': context.productName || 'Продукт',
    '{{product_price}}': context.productPrice ? String(context.productPrice) : '',
    '{{product_description}}': context.productDescription || '',
    '{{agent_name}}': context.agentName || 'Агент',
  }

  // Подставляем стандартные переменные
  for (const [key, value] of Object.entries(variables)) {
    processed = processed.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value)
  }

  // Подставляем кастомные переменные
  if (context.customVariables) {
    for (const [key, value] of Object.entries(context.customVariables)) {
      const placeholder = `{{${key}}}`
      processed = processed.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), String(value))
    }
  }

  // Подставляем переменные из CRM данных
  if (context.crmData) {
    for (const [key, value] of Object.entries(context.crmData)) {
      const placeholder = `{{crm.${key}}}`
      processed = processed.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), String(value))
    }
  }

  // Очищаем неиспользованные переменные (опционально)
  // processed = processed.replace(/\{\{[^}]+\}\}/g, '')

  return processed
}

/**
 * Получает релевантные скрипты для агента и контекста
 */
export const getRelevantScripts = async (
  orgId: string,
  agentId: string,
  context: ScriptContext
): Promise<Array<{
  id: string
  title: string
  scriptType: string
  content: string
  processedContent: string
}>> => {
  const supabase = getSupabaseServiceRoleClient()

  try {
    // Получаем скрипты для агента
    let query = supabase
      .from('sales_scripts')
      .select('*')
      .eq('org_id', orgId)
      .or(`agent_id.is.null,agent_id.eq.${agentId}`)
      .order('effectiveness_score', { ascending: false })
      .order('usage_count', { ascending: false })

    // Если есть этап воронки, фильтруем по нему
    if (context.leadStage) {
      // Здесь нужно получить pipeline_stage_id по leadStage
      // Пока просто получаем все скрипты
    }

    const { data: scripts, error } = await query

    if (error) {
      console.error('Failed to fetch scripts', error)
      return []
    }

    if (!scripts || scripts.length === 0) {
      return []
    }

    // Обрабатываем скрипты с подстановкой переменных
    return scripts.map((script: any) => ({
      id: script.id,
      title: script.title,
      scriptType: script.script_type,
      content: script.content,
      processedContent: processScript(script.content, context),
    }))
  } catch (error) {
    console.error('Error getting relevant scripts', error)
    return []
  }
}

/**
 * Извлекает переменные из скрипта
 */
export const extractVariables = (scriptContent: string): string[] => {
  const variableRegex = /\{\{([^}]+)\}\}/g
  const variables: string[] = []
  let match

  while ((match = variableRegex.exec(scriptContent)) !== null) {
    const variableName = match[1].trim()
    if (!variables.includes(variableName)) {
      variables.push(variableName)
    }
  }

  return variables
}

/**
 * Валидирует скрипт - проверяет наличие всех необходимых переменных
 */
export const validateScript = (
  scriptContent: string,
  context: ScriptContext
): { valid: boolean; missingVariables: string[] } => {
  const variables = extractVariables(scriptContent)
  const missingVariables: string[] = []

  for (const variable of variables) {
    // Проверяем стандартные переменные
    const standardVars: Record<string, string | undefined> = {
      customer_name: context.customerName,
      customer_email: context.customerEmail,
      customer_phone: context.customerPhone,
      company_name: context.companyName,
      lead_id: context.leadId,
      lead_name: context.leadName,
      lead_value: context.leadValue ? String(context.leadValue) : undefined,
      lead_stage: context.leadStage,
      lead_pipeline: context.leadPipeline,
      product_name: context.productName,
      product_price: context.productPrice ? String(context.productPrice) : undefined,
      product_description: context.productDescription,
      agent_name: context.agentName,
    }

    // Проверяем кастомные переменные
    const customValue = context.customVariables?.[variable]
    
    // Проверяем CRM переменные
    const crmMatch = variable.match(/^crm\.(.+)$/)
    const crmValue = crmMatch ? context.crmData?.[crmMatch[1]] : undefined

    if (!standardVars[variable] && !customValue && !crmValue) {
      missingVariables.push(variable)
    }
  }

  return {
    valid: missingVariables.length === 0,
    missingVariables,
  }
}






