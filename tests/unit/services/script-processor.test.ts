import { describe, it, expect, vi, beforeEach } from 'vitest'

// Создаем мок для createMockQuery
const createMockQuery = (result?: { data: any; error: any }) => {
  const query: any = {}

  query.select = vi.fn().mockImplementation(() => query)
  query.eq = vi.fn().mockImplementation(() => query)
  query.or = vi.fn().mockImplementation(() => query)
  query.order = vi.fn().mockImplementation(() => query)

  query.then = vi.fn((resolve) => {
    const resolvedResult = result !== undefined ? result : { data: [], error: null }
    return Promise.resolve(resolvedResult).then(resolve)
  })

  query.catch = vi.fn((reject) => {
    const resolvedResult = result !== undefined ? result : { data: [], error: null }
    return Promise.resolve(resolvedResult).catch(reject)
  })

  return query
}

const mockSupabaseClient = createMockQuery()
mockSupabaseClient.from = vi.fn(() => mockSupabaseClient)

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

vi.mock('@/lib/utils', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}))

import {
  processScript,
  getRelevantScripts,
  extractVariables,
  validateScript,
  type ScriptContext,
} from '@/lib/services/script-processor'

describe('Script Processor Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('processScript', () => {
    it('должен заменить стандартные переменные', () => {
      const script = 'Здравствуйте, {{customer_name}}! Ваш email: {{customer_email}}'
      const context: ScriptContext = {
        customerName: 'Иван Петров',
        customerEmail: 'ivan@example.com',
      }

      const result = processScript(script, context)

      expect(result).toBe('Здравствуйте, Иван Петров! Ваш email: ivan@example.com')
    })

    it('должен использовать значения по умолчанию для пустых переменных', () => {
      const script = 'Здравствуйте, {{customer_name}}!'
      const context: ScriptContext = {}

      const result = processScript(script, context)

      expect(result).toBe('Здравствуйте, Клиент!')
    })

    it('должен обрабатывать переменные сделки', () => {
      const script = 'Сделка {{lead_name}} на сумму {{lead_value}} в этапе {{lead_stage}}'
      const context: ScriptContext = {
        leadName: 'Продажа CRM',
        leadValue: 150000,
        leadStage: 'Переговоры',
      }

      const result = processScript(script, context)

      expect(result).toBe('Сделка Продажа CRM на сумму 150000 в этапе Переговоры')
    })

    it('должен обрабатывать кастомные переменные', () => {
      const script = 'Привет, {{custom_greeting}}! Ваш код: {{code}}'
      const context: ScriptContext = {
        customVariables: {
          custom_greeting: 'Добрый день',
          code: '12345',
        },
      }

      const result = processScript(script, context)

      expect(result).toBe('Привет, Добрый день! Ваш код: 12345')
    })

    it('должен обрабатывать CRM переменные', () => {
      const script = 'Pipeline ID: {{crm.pipeline_id}}, Contact: {{crm.contact_name}}'
      const context: ScriptContext = {
        crmData: {
          pipeline_id: 'pipe-123',
          contact_name: 'Мария Иванова',
        },
      }

      const result = processScript(script, context)

      expect(result).toBe('Pipeline ID: pipe-123, Contact: Мария Иванова')
    })

    it('должен обрабатывать все типы переменных одновременно', () => {
      const script = '{{customer_name}}, {{product_name}} стоит {{product_price}}. Ваш промокод: {{promo}}. CRM ID: {{crm.deal_id}}'
      const context: ScriptContext = {
        customerName: 'Алексей',
        productName: 'Подписка Premium',
        productPrice: 5000,
        customVariables: {
          promo: 'SAVE20',
        },
        crmData: {
          deal_id: 'deal-456',
        },
      }

      const result = processScript(script, context)

      expect(result).toBe('Алексей, Подписка Premium стоит 5000. Ваш промокод: SAVE20. CRM ID: deal-456')
    })

    it('должен корректно обрабатывать переменные агента', () => {
      const script = 'Я {{agent_name}}, ваш виртуальный помощник'
      const context: ScriptContext = {
        agentName: 'АИ Ассистент',
      }

      const result = processScript(script, context)

      expect(result).toBe('Я АИ Ассистент, ваш виртуальный помощник')
    })

    it('должен обрабатывать булевые значения в кастомных переменных', () => {
      const script = 'Подтверждено: {{confirmed}}'
      const context: ScriptContext = {
        customVariables: {
          confirmed: true,
        },
      }

      const result = processScript(script, context)

      expect(result).toBe('Подтверждено: true')
    })

    it('должен обрабатывать числовые значения в кастомных переменных', () => {
      const script = 'Количество: {{count}}'
      const context: ScriptContext = {
        customVariables: {
          count: 42,
        },
      }

      const result = processScript(script, context)

      expect(result).toBe('Количество: 42')
    })
  })

  describe('extractVariables', () => {
    it('должен извлекать переменные из скрипта', () => {
      const script = 'Привет, {{name}}! Ваш заказ {{order_id}} готов.'

      const result = extractVariables(script)

      expect(result).toEqual(['name', 'order_id'])
    })

    it('должен извлекать уникальные переменные', () => {
      const script = '{{name}} {{name}} {{email}}'

      const result = extractVariables(script)

      expect(result).toEqual(['name', 'email'])
    })

    it('должен вернуть пустой массив для скрипта без переменных', () => {
      const script = 'Простой текст без переменных'

      const result = extractVariables(script)

      expect(result).toEqual([])
    })

    it('должен извлекать переменные с пробелами', () => {
      const script = '{{ name }} {{ email }}'

      const result = extractVariables(script)

      expect(result).toEqual(['name', 'email'])
    })

    it('должен извлекать CRM переменные', () => {
      const script = '{{crm.pipeline_id}} {{crm.stage_name}}'

      const result = extractVariables(script)

      expect(result).toEqual(['crm.pipeline_id', 'crm.stage_name'])
    })
  })

  describe('validateScript', () => {
    it('должен валидировать корректный скрипт', () => {
      const script = 'Привет, {{customer_name}}!'
      const context: ScriptContext = {
        customerName: 'Иван',
      }

      const result = validateScript(script, context)

      expect(result).toEqual({
        valid: true,
        missingVariables: [],
      })
    })

    it('должен находить отсутствующие стандартные переменные', () => {
      const script = 'Email: {{customer_email}}, Phone: {{customer_phone}}'
      const context: ScriptContext = {
        customerEmail: 'test@example.com',
        // customer_phone отсутствует
      }

      const result = validateScript(script, context)

      expect(result).toEqual({
        valid: false,
        missingVariables: ['customer_phone'],
      })
    })

    it('должен находить отсутствующие кастомные переменные', () => {
      const script = 'Code: {{code}}, Name: {{name}}'
      const context: ScriptContext = {
        customVariables: {
          code: '123',
          // name отсутствует
        },
      }

      const result = validateScript(script, context)

      expect(result).toEqual({
        valid: false,
        missingVariables: ['name'],
      })
    })

    it('должен валидировать CRM переменные', () => {
      const script = 'Deal: {{crm.deal_id}}, Contact: {{crm.contact_id}}'
      const context: ScriptContext = {
        crmData: {
          deal_id: 'deal-123',
          contact_id: 'contact-456',
        },
      }

      const result = validateScript(script, context)

      expect(result).toEqual({
        valid: true,
        missingVariables: [],
      })
    })

    it('должен находить отсутствующие CRM переменные', () => {
      const script = 'Deal: {{crm.deal_id}}'
      const context: ScriptContext = {
        crmData: {
          // deal_id отсутствует
        },
      }

      const result = validateScript(script, context)

      expect(result).toEqual({
        valid: false,
        missingVariables: ['crm.deal_id'],
      })
    })

    it('должен находить множественные отсутствующие переменные', () => {
      const script = '{{customer_name}} {{customer_email}} {{product_name}}'
      const context: ScriptContext = {
        customerName: 'Иван',
        // customer_email и product_name отсутствуют
      }

      const result = validateScript(script, context)

      expect(result.valid).toBe(false)
      expect(result.missingVariables).toHaveLength(2)
      expect(result.missingVariables).toContain('customer_email')
      expect(result.missingVariables).toContain('product_name')
    })

    it('должен валидировать скрипт с числовыми переменными', () => {
      const script = 'Price: {{product_price}}, Value: {{lead_value}}'
      const context: ScriptContext = {
        productPrice: 1000,
        leadValue: 5000,
      }

      const result = validateScript(script, context)

      expect(result).toEqual({
        valid: true,
        missingVariables: [],
      })
    })
  })

  describe('getRelevantScripts', () => {
    it('должен получить скрипты для агента', async () => {
      const mockScripts = [
        {
          id: 'script-1',
          title: 'Приветствие',
          script_type: 'greeting',
          content: 'Здравствуйте, {{customer_name}}!',
          effectiveness_score: 95,
          usage_count: 100,
        },
        {
          id: 'script-2',
          title: 'Прощание',
          script_type: 'farewell',
          content: 'До свидания, {{customer_name}}!',
          effectiveness_score: 90,
          usage_count: 80,
        },
      ]

      const selectQuery = createMockQuery({ data: mockScripts, error: null })
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const context: ScriptContext = {
        customerName: 'Иван',
      }

      const result = await getRelevantScripts('org-123', 'agent-1', context)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'script-1',
        title: 'Приветствие',
        scriptType: 'greeting',
        content: 'Здравствуйте, {{customer_name}}!',
        processedContent: 'Здравствуйте, Иван!',
      })
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('sales_scripts')
    })

    it('должен вернуть пустой массив при ошибке БД', async () => {
      const selectQuery = createMockQuery({
        data: null,
        error: { message: 'DB error' }
      })
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await getRelevantScripts('org-123', 'agent-1', {})

      expect(result).toEqual([])
    })

    it('должен вернуть пустой массив если скрипты не найдены', async () => {
      const selectQuery = createMockQuery({ data: [], error: null })
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await getRelevantScripts('org-123', 'agent-1', {})

      expect(result).toEqual([])
    })

    it('должен обработать переменные в полученных скриптах', async () => {
      const mockScripts = [
        {
          id: 'script-1',
          title: 'Оффер',
          script_type: 'offer',
          content: 'Продукт {{product_name}} стоит {{product_price}}',
          effectiveness_score: 85,
          usage_count: 50,
        },
      ]

      const selectQuery = createMockQuery({ data: mockScripts, error: null })
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const context: ScriptContext = {
        productName: 'Подписка',
        productPrice: 999,
      }

      const result = await getRelevantScripts('org-123', 'agent-1', context)

      expect(result[0].processedContent).toBe('Продукт Подписка стоит 999')
    })

    it('должен корректно обрабатывать исключения', async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Connection error')
      })

      const result = await getRelevantScripts('org-123', 'agent-1', {})

      expect(result).toEqual([])
    })

    it('должен сортировать скрипты по эффективности и использованию', async () => {
      const mockScripts = [
        {
          id: 'script-1',
          title: 'Script 1',
          script_type: 'type1',
          content: 'Content 1',
          effectiveness_score: 80,
          usage_count: 50,
        },
        {
          id: 'script-2',
          title: 'Script 2',
          script_type: 'type2',
          content: 'Content 2',
          effectiveness_score: 95,
          usage_count: 100,
        },
      ]

      const selectQuery = createMockQuery({ data: mockScripts, error: null })
      selectQuery.order = vi.fn().mockReturnValue(selectQuery)
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      await getRelevantScripts('org-123', 'agent-1', {})

      // Проверяем что вызвалась сортировка
      expect(selectQuery.order).toHaveBeenCalledWith('effectiveness_score', { ascending: false })
      expect(selectQuery.order).toHaveBeenCalledWith('usage_count', { ascending: false })
    })
  })
})
